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
//   3. Writes the live content to docs/wiki-backups/ first — a local copy
//      of what the page held, independent of the host's revision settings
//      (beside docs/wiki, which wiki-pull.mjs wipes on every run).
//   4. Sends the file as `content` and nothing else. The page's status is
//      untouched (a published page stays published; `status: pending` on a
//      published page would UNPUBLISH it, which is why this script never
//      sends a status). WordPress records a revision, which is the rollback.
//   5. Records the new modified_gmt in wiki-map.json so the next push of this
//      page passes the check.
//
// The pull script appends one newline to every file; this strips it again so
// the stored content is byte-for-byte what was in the file before the pull.

import { readFile, writeFile, mkdtemp, mkdir, rm } from 'node:fs/promises';
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

// 1. The live page, for the no-op check, the drift check and the diff.
const liveRes = await fetch(`${endpoint}?context=edit&_fields=id,modified_gmt,status,link,content`, { headers });
if (!liveRes.ok) {
	console.error(`GET ${endpoint}: HTTP ${liveRes.status}\n${await liveRes.text()}`);
	process.exit(1);
}
const live = await liveRes.json();
const liveContent = live.content?.raw ?? '';

// 2. The content, minus the newline the pull added. A file that already
//    equals the live page can't clobber anything, so that is settled before
//    the drift check — a page pushed earlier and then saved in the editor
//    is simply "nothing to push", not a refusal.
const content = (await readFile(file, 'utf8')).replace(/\n$/, '');

console.log(`${relPath} → ${entry.type} #${entry.id} (${live.status}) ${entry.link}`);
if (content === liveContent) {
	if (live.modified_gmt !== entry.modified_gmt) {
		entry.modified_gmt = live.modified_gmt;
		await writeFile(MAP_FILE, JSON.stringify(map, null, 2) + '\n', 'utf8');
	}
	console.log('File matches the live content; nothing to push.');
	process.exit(0);
}

// 2b. Drift check: refuse if the live page changed since the pull.
if (live.modified_gmt !== entry.modified_gmt) {
	const msg = `live page modified ${live.modified_gmt}, snapshot is from ${entry.modified_gmt}`;
	if (!force) {
		console.error(`Refusing to push: ${msg}.\nRe-run wiki-pull.mjs, re-apply your change, and push again — or pass --force to overwrite.`);
		process.exit(2);
	}
	console.warn(`Warning: ${msg}; pushing anyway (--force).`);
}

// 2a. The review: live content vs the file, as git shows it. `--no-index`
//     diffs two paths outside version control, so docs/wiki need not be
//     tracked.
if (showDiff) {
	const dir = await mkdtemp(join(tmpdir(), 'wiki-push-'));
	const livePath = join(dir, 'live.html');
	const nextPath = join(dir, 'next.html');
	await writeFile(livePath, liveContent + '\n', 'utf8');
	await writeFile(nextPath, content + '\n', 'utf8');
	spawnSync('git', ['--no-pager', 'diff', '--no-index', '--color=always', livePath, nextPath], { stdio: 'inherit' });
	await rm(dir, { recursive: true, force: true });
	console.log('');
}

console.log(`${content.length} characters (live: ${liveContent.length})${dry ? ' — dry run, nothing sent' : ''}`);
if (dry) process.exit(0);

// 3. Keep what the page held before this push, locally, whatever the host's
//    revision settings are. Beside docs/wiki (which the pull wipes) and
//    outside version control: once the push goes through this is the copy.
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = `${WIKI_DIR.replace(/\/$/, '')}-backups`;
await mkdir(backupDir, { recursive: true });
const backupPath = join(backupDir, `${entry.type}-${entry.id}-${stamp}.html`);
await writeFile(backupPath, liveContent + '\n', 'utf8');

// 4. Push. Only `content`; status and everything else stay as they are.
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

// 5. Keep the map in step so the next push passes the drift check.
entry.modified_gmt = updated.modified_gmt;
await writeFile(MAP_FILE, JSON.stringify(map, null, 2) + '\n', 'utf8');

console.log(`Pushed at ${updated.modified_gmt}; previous content kept at ${backupPath}; wiki-map.json updated.`);
console.log(`Check: ${updated.link}`);
