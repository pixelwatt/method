#!/usr/bin/env node
// wiki-convert-code.mjs — rewrite Code Block Pro blocks as method/code blocks
// in pulled wiki files (docs/wiki/**/*.html).
//
// Usage:
//   node scripts/wiki-convert-code.mjs docs/wiki/guides/getting-started-with-method-v2.html
//   node scripts/wiki-convert-code.mjs --all          # every file under docs/wiki
//   node scripts/wiki-convert-code.mjs --dry <file>   # report only, write nothing
//   node scripts/wiki-convert-code.mjs --all --decode-existing
//       one-time repair: decode HTML entities in method/code blocks that were
//       converted before this script learned that Code Block Pro stores its
//       `code` attribute HTML-escaped (see below)
//
// A Code Block Pro block is static: it stores the sample three times (the
// `code` attribute, Shiki's `codeHTML`, and the saved markup). method/code is
// dynamic and stores the sample once, so each block collapses to one
// self-closing delimiter comment:
//
//   <!-- wp:method/code {"code":"…","language":"bash"} /-->
//
// Code Block Pro stores `code` HTML-escaped (`=&gt;`, `&lt;div&gt;`) and decodes
// it before highlighting. method/code stores the text itself and escapes on
// output (esc_html() doesn't double-encode, so an escaped sample happens to
// render correctly, but the editor shows the entities and a sample authored
// in the Code block is stored unescaped — two conventions in one database).
// The conversion decodes once, so every method/code block holds plain text.
//
// Attribute mapping (anything else Code Block Pro stored is dropped — theme,
// font, colors — because method/code themes through CSS):
//   code                      → code, HTML entities decoded
//   language                  → language (zsh/sh → bash, otherwise as is)
//   headerType  'none'        → showLabel: false
//   headerString              → label (when set)
//   copyButton  false         → showCopy: false
//
// Attributes at their block.json default are omitted, as the editor does.

import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const all = args.includes('--all');
const decodeExisting = args.includes('--decode-existing');
const files = args.filter((a) => !a.startsWith('--'));

const WIKI_DIR = process.env.WIKI_DIR ?? 'docs/wiki';

// Mirrors ALIASES in lib/blocks/utils/highlight.js (the subset Code Block Pro
// could have stored).
const LANGUAGE_ALIASES = {
	zsh: 'bash',
	sh: 'bash',
	shell: 'bash',
	js: 'javascript',
	jsx: 'javascript',
	ts: 'typescript',
	tsx: 'typescript',
	md: 'markdown',
	xml: 'html',
	svg: 'html',
	text: 'plaintext',
	txt: 'plaintext',
};

// Defaults from lib/blocks/method-code/src/block.json; equal values are omitted.
const DEFAULTS = { language: 'php', label: '', showLabel: true, showCopy: true, wrapLines: false };

// Same escaping as serializeAttributes() in @wordpress/blocks, so the output
// is byte-identical to what the editor would save.
function serializeAttributes(attributes) {
	return JSON.stringify(attributes)
		.replace(/--/g, '\\u002d\\u002d')
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\\"/g, '\\u0022')
		// A backslash inside a string: the editor stores it as \u005c so the
		// server's stripslashes never turns "\\n" into a newline.
		.replace(/\\\\/g, '\\u005c');
}

// Single pass, so a sample that documented an entity (`&amp;gt;`) comes out
// as the entity (`&gt;`), not the character.
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#039': "'", '#39': "'", apos: "'" };
function decodeEntities(text) {
	return String(text).replace(/&(amp|lt|gt|quot|apos|#0?39);/g, (m, name) => ENTITIES[name] ?? m);
}

function mapAttributes(cbp) {
	const out = { code: decodeEntities(cbp.code ?? '') };

	let language = String(cbp.language ?? 'php').trim().toLowerCase();
	language = LANGUAGE_ALIASES[language] ?? language;
	if (language !== DEFAULTS.language) out.language = language;

	const label = String(cbp.headerString ?? '').trim();
	if (label) out.label = label;

	if (cbp.headerType === 'none') out.showLabel = false;
	if (cbp.copyButton === false) out.showCopy = false;

	return out;
}

// The opening delimiter is a single line (attribute JSON never holds a raw
// newline), and the closing delimiter is unambiguous: the saved markup
// escapes `>` so no `-->` can appear inside it.
const BLOCK_RE =
	/<!-- wp:kevinbatdorf\/code-block-pro ([^\n]*?) -->[\s\S]*?<!-- \/wp:kevinbatdorf\/code-block-pro -->/g;

const EXISTING_RE = /<!-- wp:method\/code (\{[^\n]*?\}) \/-->/g;

function convert(markup) {
	const notes = [];
	let count = 0;
	let decoded = 0;
	if (decodeExisting) {
		markup = markup.replace(EXISTING_RE, (match, json) => {
			let attrs;
			try {
				attrs = JSON.parse(json);
			} catch (e) {
				return match;
			}
			const next = decodeEntities(attrs.code ?? '');
			if (next === attrs.code) return match;
			decoded++;
			return `<!-- wp:method/code ${serializeAttributes({ ...attrs, code: next })} /-->`;
		});
	}
	const result = markup.replace(BLOCK_RE, (match, json) => {
		let cbp;
		try {
			cbp = JSON.parse(json);
		} catch (e) {
			notes.push(`left a block alone: attribute JSON did not parse (${e.message})`);
			return match;
		}
		count++;
		const attrs = mapAttributes(cbp);
		if (!attrs.code.trim()) notes.push(`block ${count} has empty code`);
		return `<!-- wp:method/code ${serializeAttributes(attrs)} /-->`;
	});
	return { result, count, notes, decoded };
}

async function listHtml(dir) {
	const out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const p = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await listHtml(p)));
		else if (extname(entry.name) === '.html') out.push(p);
	}
	return out;
}

const targets = all ? await listHtml(WIKI_DIR) : files;
if (!targets.length) {
	console.error('Give a file path, or --all.');
	process.exit(1);
}

let totalBlocks = 0;
let totalDecoded = 0;
let touched = 0;
for (const file of targets) {
	await stat(file); // throws a clear error for a bad path
	const before = await readFile(file, 'utf8');
	const { result, count, notes, decoded } = convert(before);
	if (!count && !decoded) continue;
	touched++;
	totalBlocks += count;
	totalDecoded += decoded;
	const what = [count ? `${count} block${count === 1 ? '' : 's'} converted` : '', decoded ? `${decoded} existing block${decoded === 1 ? '' : 's'} decoded` : ''].filter(Boolean).join(', ');
	console.log(`${file}: ${what}${dry ? ' (dry run)' : ''}`);
	for (const n of notes) console.log(`  ! ${n}`);
	if (!dry) await writeFile(file, result, 'utf8');
}
console.log(`${totalBlocks} Code Block Pro block(s)${dry ? ' would be' : ''} converted${decodeExisting ? `, ${totalDecoded} existing method/code block(s)${dry ? ' would be' : ''} decoded` : ''}, across ${touched} file(s).`);
