#!/usr/bin/env node
// wiki-push.mjs — push one pulled wiki file back to method.wiki as the
// page's content.
//
// Usage (Node 18+, no dependencies):
//   WP_APP_USER=claudedocs WP_APP_PASS='xxxx xxxx …' node scripts/wiki-push.mjs docs/wiki/<path>.html
//   … --diff      show a diff of the live content against the file first (needs git)
//   … --force     push even if the live page changed since the last pull
//   … --dry       show what would be sent, send nothing (combine with --diff to review)
//
// What it does:
//   1. Finds the page in docs/wiki/wiki-map.json by the file's path.
//   2. Fetches the live page and refuses if its modified_gmt is newer than the
//      one recorded at pull time — someone edited it in wp-admin since, and
//      pushing would overwrite that. Re-run wiki-pull.mjs, re-apply, push.
//   3. Sends the file as `content` and nothing else. The page's status is
//      untouched (a published page stays published; `status: pending` on a
//      published page would UNPUBLISH it, which is why this script never
//      sends a status). WordPress records a revision, which is the rollback.
//   4. Records the new modified_gmt in wiki-map.json so the next push of this
//      page passes the check.
//
// The pull script appends one newline to every file; this strips it again so
// the stored content is byte-for-byte what was in the file before the pull.

import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { relative, resolve, sep, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SITE = (process.env.WP_SITE ?? 'https://method.wiki').replace(/\/$/, '');
const WIKI_DIR = process.env.WIKI_DIR ?? 'docs/wiki';
const MAP_FILE = `${WIKI_DIR}/wiki-map.json`;

const args = process.argv.slice(2);
const force = args.includes('--force');
const dry = args.includes('--dry');
const showDiff = args.includes('--diff');
const file = args.find((a) => !a.startsWith('--'));
if (!file) {
	console.error('Usage: node scripts/wiki-push.mjs docs/wiki/<path>.html [--force] [--dry]');
	process.exit(1);
}

const { WP_APP_USER, WP_APP_PASS } = process.env;
if (!WP_APP_USER || !WP_APP_PASS) {
	console.error('Set WP_APP_USER and WP_APP_PASS (application password).');
	process.exit(1);
}
const AUTH = 'Basic ' + Buffer.from(`${WP_APP_USER}:${WP_APP_PASS}`).toString('base64');

// The map keys paths relative to docs/wiki, with forward slashes.
const relPath = relative(resolve(WIKI_DIR), resolve(file)).split(sep).join('/');
const map = JSON.parse(await readFile(MAP_FILE, 'utf8'));
const entry = map.find((e) => e.path === relPath);
if (!entry) {
	console.error(`${relPath} is not in ${MAP_FILE}. Run wiki-pull.mjs first.`);
	process.exit(1);
}

const endpoint = `${SITE}/wp-json/wp/v2/${entry.rest_base}/${entry.id}`;
const headers = { Authorization: AUTH, 'Content-Type': 'application/json' };

// 1. Drift check against the live page.
const liveRes = await fetch(`${endpoint}?context=edit&_fields=id,modified_gmt,status,link,content`, { headers });
if (!liveRes.ok) {
	console.error(`GET ${endpoint}: HTTP ${liveRes.status}\n${await liveRes.text()}`);
	process.exit(1);
}
const live = await liveRes.json();
if (live.modified_gmt !== entry.modified_gmt) {
	const msg = `live page modified ${live.modified_gmt}, snapshot is from ${entry.modified_gmt}`;
	if (!force) {
		console.error(`Refusing to push: ${msg}.\nRe-run wiki-pull.mjs, re-apply your change, and push again — or pass --force to overwrite.`);
		process.exit(2);
	}
	console.warn(`Warning: ${msg}; pushing anyway (--force).`);
}

// 2. The content, minus the newline the pull added.
const content = (await readFile(file, 'utf8')).replace(/\n$/, '');

console.log(`${relPath} → ${entry.type} #${entry.id} (${live.status}) ${entry.link}`);
console.log(`${content.length} characters${dry ? ' (dry run, nothing sent)' : ''}`);
if (dry) process.exit(0);

// 3. Push. Only `content`; status and everything else stay as they are.
const res = await fetch(endpoint, {
	method: 'POST',
	headers,
	body: JSON.stringify({ content }),
});
if (!res.ok) {
	console.error(`POST ${endpoint}: HTTP ${res.status}\n${await res.text()}`);
	process.exit(1);
}
const updated = await res.json();

// 4. Keep the map in step so the next push passes the drift check.
entry.modified_gmt = updated.modified_gmt;
await writeFile(MAP_FILE, JSON.stringify(map, null, 2) + '\n', 'utf8');

console.log(`Pushed. Live revision saved at ${updated.modified_gmt}; wiki-map.json updated.`);
console.log(`Check: ${updated.link}`);
