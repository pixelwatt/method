#!/usr/bin/env node
// wiki-normalize-attrs.mjs — strip dead responsiveSettings data from Method
// blocks in pulled wiki files (docs/wiki/**/*.html).
//
// Usage:
//   node scripts/wiki-normalize-attrs.mjs docs/wiki/<path>.html
//   node scripts/wiki-normalize-attrs.mjs --all
//   … --dry      report only, write nothing
//   … --zeros    also drop all-zero margin / padding / borderRadius (see below)
//
// Pages saved under early Method betas carry responsiveSettings in the
// pre-opt-in shape: every tier holds every key, with defaults filled in, and
// a still older generation of per-tier custom* flags. Method's render ignores
// most of it, so the default rules here are provably invisible on the page:
//
//   1. A tier whose `enabled` is falsy is skipped entirely by
//      method_get_block_responsive_styles() (and advanced-grid-col falls back
//      to the base columns), so it collapses to { "enabled": false } — plus
//      any key the block's own block.json default seeds into that tier
//      (advanced-grid-col's gridCols, say), kept with its stored value: the
//      render ignores it while the tier is off, but the editor shows it the
//      moment the tier is switched on.
//   2. Every value the render reads goes through method_check_array_key(),
//      i.e. PHP empty(): "", false and null are never emitted. They go, and
//      so does an object whose leaves are all empty (border: "" and friends).
//      The old customBg / customSpacing / customBorders / customType flags
//      are all false in legacy content and leave the same way; a true one is
//      kept, because customBg is still read.
//   3. If what is left equals the block's current block.json default —
//      itself normalized by the rules above, since a default can carry
//      seeded empties — the attribute is dropped, as the editor would have.
//
// `--zeros` is different in kind. An all-zero margin / padding / borderRadius
// in an ENABLED tier is a real string the render emits (margin-block-start:
// 0rem, …), which suppresses the layout's own spacing. Removing it changes
// the page to the opt-in behaviour — usually what was meant, but a visual
// change, so it is off by default and reported separately.
//
// Only method/* blocks are touched. Their save() output never derives from
// responsiveSettings (checked: Section, Container, both grids, Buttons), so
// rewriting the delimiter JSON cannot invalidate the saved markup. Core
// blocks carrying Method's extension attributes are left alone on purpose.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const all = args.includes('--all');
const zeros = args.includes('--zeros');
const files = args.filter((a) => !a.startsWith('--'));

const WIKI_DIR = process.env.WIKI_DIR ?? 'docs/wiki';
const BLOCKS_DIR = process.env.BLOCKS_DIR ?? 'lib/blocks';

const TIERS = ['base', 'mobile', 'tablet', 'wide'];
const ZERO_KEYS = new Set(['margin', 'padding', 'borderRadius']);
const ZERO_RE = /^\s*-?0+(\.0+)?(rem|em|px|%|vw|vh)?\s*$/;

// Same escaping as serializeAttributes() in @wordpress/blocks.
function serializeAttributes(attributes) {
	return JSON.stringify(attributes)
		.replace(/--/g, '\\u002d\\u002d')
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\\"/g, '\\u0022');
}

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isEmptyLeaf = (v) => v === '' || v === false || v === null || v === undefined;

// An object (recursively) made only of empty leaves.
function isEmptyObject(v) {
	return isObject(v) && Object.values(v).every((x) => isEmptyLeaf(x) || isEmptyObject(x));
}

function isAllZero(v) {
	return isObject(v) && Object.keys(v).length > 0 && Object.values(v).every((x) => typeof x === 'string' && ZERO_RE.test(x));
}

function deepEqual(a, b) {
	return JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
}
function sortKeys(v) {
	if (Array.isArray(v)) return v.map(sortKeys);
	if (!isObject(v)) return v;
	return Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]));
}

// Block name → responsiveSettings default from its block.json.
async function loadDefaults() {
	const defaults = new Map();
	async function walk(dir) {
		for (const entry of await readdir(dir, { withFileTypes: true })) {
			if (entry.name === 'node_modules' || entry.name === 'build') continue;
			const p = join(dir, entry.name);
			if (entry.isDirectory()) await walk(p);
			else if (entry.name === 'block.json') {
				try {
					const meta = JSON.parse(await readFile(p, 'utf8'));
					const def = meta?.attributes?.responsiveSettings?.default;
					if (meta?.name && def) defaults.set(meta.name, def);
				} catch (e) {
					/* not a block.json we can read; skip */
				}
			}
		}
	}
	await walk(BLOCKS_DIR);
	return defaults;
}

/**
 * @return {{ settings: object|undefined, removed: object }}
 */
function rules12(rs, blockDefault, counts) {
	if (!isObject(rs)) return { settings: rs };
	const out = {};
	for (const [tierName, tier] of Object.entries(rs)) {
		if (!isObject(tier)) {
			out[tierName] = tier;
			continue;
		}
		const isBase = tierName === 'base';
		const enabled = isBase || !!tier.enabled;

		// Rule 1: disabled tier → { enabled: false } plus the keys the block's
		// default seeds into this tier, with their stored values.
		if (!enabled) {
			const seeded = isObject(blockDefault?.[tierName]) ? Object.keys(blockDefault[tierName]) : [];
			const collapsed = { enabled: false };
			for (const k of seeded) {
				if (k === 'enabled' || !(k in tier)) continue;
				const v = tier[k];
				if (isEmptyLeaf(v) || isEmptyObject(v)) continue;
				collapsed[k] = v;
			}
			const dropped = Object.keys(tier).length - Object.keys(collapsed).length;
			if (dropped > 0) counts.disabledTierKeys += dropped;
			out[tierName] = collapsed;
			continue;
		}

		const kept = {};
		for (const [k, v] of Object.entries(tier)) {
			if (isEmptyLeaf(v) || isEmptyObject(v)) { counts.emptyValues++; continue; } // Rule 2
			if (zeros && ZERO_KEYS.has(k) && isAllZero(v)) { counts.zeros++; continue; } // --zeros
			kept[k] = v;
		}
		out[tierName] = kept;
	}

	return { settings: out };
}

// Rules 1–2, then Rule 3 against the default normalized the same way.
function normalize(rs, blockDefault, counts) {
	const { settings } = rules12(rs, blockDefault, counts);
	if (isObject(settings) && isObject(blockDefault)) {
		const scratch = { disabledTierKeys: 0, emptyValues: 0 };
		const normalizedDefault = rules12(blockDefault, blockDefault, scratch).settings;
		if (deepEqual(settings, normalizedDefault)) {
			counts.droppedAttribute++;
			return { settings: undefined };
		}
	}
	return { settings };
}

const DELIM_RE = /<!-- wp:(method\/[a-z0-9-]+) (\{[^\n]*?\}) (\/?)-->/g;

function processMarkup(markup, defaults, counts) {
	let blocks = 0;
	const result = markup.replace(DELIM_RE, (match, name, json, selfClose) => {
		let attrs;
		try {
			attrs = JSON.parse(json);
		} catch (e) {
			counts.unparsed++;
			return match;
		}
		if (!('responsiveSettings' in attrs)) return match;
		const before = JSON.stringify(attrs.responsiveSettings);
		const { settings } = normalize(attrs.responsiveSettings, defaults.get(name), counts);
		if (settings === undefined) delete attrs.responsiveSettings;
		else attrs.responsiveSettings = settings;
		if (settings !== undefined && JSON.stringify(settings) === before) return match;
		blocks++;
		const serialized = Object.keys(attrs).length ? ' ' + serializeAttributes(attrs) : '';
		return `<!-- wp:${name}${serialized} ${selfClose}-->`;
	});
	return { result, blocks };
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

const defaults = await loadDefaults();
const totals = { files: 0, blocks: 0, disabledTierKeys: 0, emptyValues: 0, zeros: 0, droppedAttribute: 0, unparsed: 0 };
let totalBytesBefore = 0;
let totalBytesAfter = 0;

for (const file of targets) {
	const before = await readFile(file, 'utf8');
	const counts = { disabledTierKeys: 0, emptyValues: 0, zeros: 0, droppedAttribute: 0, unparsed: 0 };
	const { result, blocks } = processMarkup(before, defaults, counts);
	if (!blocks) continue;
	totals.files++;
	totals.blocks += blocks;
	for (const k of Object.keys(counts)) totals[k] += counts[k];
	totalBytesBefore += before.length;
	totalBytesAfter += result.length;
	console.log(`${file}: ${blocks} block(s), ${before.length} → ${result.length} chars${dry ? ' (dry run)' : ''}`);
	if (!dry) await writeFile(file, result, 'utf8');
}

console.log('');
console.log(`${totals.blocks} block(s) in ${totals.files} file(s)${dry ? ' would be' : ''} rewritten; ${totalBytesBefore} → ${totalBytesAfter} chars in those files.`);
console.log(`  disabled-tier keys dropped: ${totals.disabledTierKeys}`);
console.log(`  empty values dropped:       ${totals.emptyValues} (incl. the old custom* flags, all false)`);
console.log(`  responsiveSettings removed (equal to block default): ${totals.droppedAttribute}`);
console.log(`  all-zero spacing dropped (--zeros): ${zeros ? totals.zeros : 'off'}`);
if (totals.unparsed) console.log(`  ! ${totals.unparsed} delimiter(s) left alone: attribute JSON did not parse`);
if (!zeros) {
	// Count what --zeros would touch, so the decision can be made with numbers.
	let candidates = 0;
	for (const file of targets) {
		const markup = await readFile(file, 'utf8');
		for (const m of markup.matchAll(DELIM_RE)) {
			let attrs;
			try { attrs = JSON.parse(m[2]); } catch (e) { continue; }
			const rs = attrs.responsiveSettings;
			if (!isObject(rs)) continue;
			for (const t of TIERS) {
				const tier = rs[t];
				if (!isObject(tier) || (t !== 'base' && !tier.enabled)) continue;
				for (const k of ZERO_KEYS) if (isAllZero(tier[k])) candidates++;
			}
		}
	}
	console.log(`  (--zeros would additionally drop ${candidates} all-zero margin/padding/borderRadius value(s) from enabled tiers — a rendering change)`);
}
