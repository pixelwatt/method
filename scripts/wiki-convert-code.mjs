#!/usr/bin/env node
// wiki-convert-code.mjs — rewrite Code Block Pro blocks as method/code blocks
// in pulled wiki files (docs/wiki/**/*.html).
//
// Usage:
//   node scripts/wiki-convert-code.mjs docs/wiki/guides/getting-started-with-method-v2.html
//   node scripts/wiki-convert-code.mjs --all          # every file under docs/wiki
//   node scripts/wiki-convert-code.mjs --dry <file>   # report only, write nothing
//
// A Code Block Pro block is static: it stores the sample three times (the
// `code` attribute, Shiki's `codeHTML`, and the saved markup). method/code is
// dynamic and stores the sample once, so each block collapses to one
// self-closing delimiter comment:
//
//   <!-- wp:method/code {"code":"…","language":"bash"} /-->
//
// Attribute mapping (anything else Code Block Pro stored is dropped — theme,
// font, colors — because method/code themes through CSS):
//   code                      → code
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
		.replace(/\\"/g, '\\u0022');
}

function mapAttributes(cbp) {
	const out = { code: cbp.code ?? '' };

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

function convert(markup) {
	const notes = [];
	let count = 0;
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
	return { result, count, notes };
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
let touched = 0;
for (const file of targets) {
	await stat(file); // throws a clear error for a bad path
	const before = await readFile(file, 'utf8');
	const { result, count, notes } = convert(before);
	if (!count) continue;
	touched++;
	totalBlocks += count;
	console.log(`${file}: ${count} block${count === 1 ? '' : 's'}${dry ? ' (dry run)' : ''}`);
	for (const n of notes) console.log(`  ! ${n}`);
	if (!dry) await writeFile(file, result, 'utf8');
}
console.log(`${totalBlocks} Code Block Pro block(s) in ${touched} file(s)${dry ? ' would be' : ''} converted.`);
