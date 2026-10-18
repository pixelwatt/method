#!/usr/bin/env node
// wiki-create.mjs — create a new wiki page as a DRAFT and register it in
// docs/wiki/wiki-map.json so wiki-push.mjs can update it afterwards.
//
// Usage (Node 18+, no dependencies):
//   WP_APP_USER=claudedocs WP_APP_PASS='…' node scripts/wiki-create.mjs \
//       --parent documentation/method-blocks --slug code --title "Code" [--type pages] [--from <file>]
//
//   --parent   the parent page's path as listed in wiki-map.json (no .html), or its numeric id
//   --slug     URL slug of the new page
//   --title    page title
//   --type     REST base: pages (default) or guides
//   --from     a file whose contents become the initial post_content (e.g. a sibling
//              page copied as a template); otherwise the page is created empty
//
// The page is created with status "draft": it is not on the live site until
// published from wp-admin, which is the review step for a new page. The file
// lands at docs/wiki/_drafts/<type>-<id>-<slug>.html — the same place the pull
// puts drafts — and a map entry is appended, so from here on it is edited and
// pushed like any other page. Once published, the next pull moves the file to
// its URL path.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const SITE = (process.env.WP_SITE ?? 'https://method.wiki').replace(/\/$/, '');
const WIKI_DIR = process.env.WIKI_DIR ?? 'docs/wiki';
const MAP_FILE = `${WIKI_DIR}/wiki-map.json`;

const args = process.argv.slice(2);
const opt = (name, def) => {
	const i = args.indexOf(`--${name}`);
	return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : def;
};
const parentArg = opt('parent');
const slug = opt('slug');
const title = opt('title');
const type = opt('type', 'pages');
const from = opt('from');
if (!parentArg || !slug || !title) {
	console.error('Usage: node scripts/wiki-create.mjs --parent <path|id> --slug <slug> --title "<title>" [--type pages|guides] [--from <file>]');
	process.exit(1);
}
const { WP_APP_USER, WP_APP_PASS } = process.env;
if (!WP_APP_USER || !WP_APP_PASS) {
	console.error('Set WP_APP_USER and WP_APP_PASS (application password).');
	process.exit(1);
}
const AUTH = 'Basic ' + Buffer.from(`${WP_APP_USER}:${WP_APP_PASS}`).toString('base64');
const headers = { Authorization: AUTH, 'Content-Type': 'application/json' };

const map = JSON.parse(await readFile(MAP_FILE, 'utf8'));
let parentId = Number(parentArg);
if (!Number.isInteger(parentId)) {
	const entry = map.find((e) => e.path === `${parentArg.replace(/\.html$/, '')}.html`);
	if (!entry) {
		console.error(`Parent "${parentArg}" is not in ${MAP_FILE}. Run wiki-pull.mjs, or pass the numeric id.`);
		process.exit(1);
	}
	parentId = entry.id;
}
if (map.some((e) => e.slug === slug && e.parent === parentId)) {
	console.error(`A page with slug "${slug}" under parent #${parentId} already exists in the map.`);
	process.exit(1);
}

const content = from ? (await readFile(from, 'utf8')).replace(/\n$/, '') : '';

const res = await fetch(`${SITE}/wp-json/wp/v2/${type}`, {
	method: 'POST',
	headers,
	body: JSON.stringify({ title, slug, parent: parentId, status: 'draft', content }),
});
if (!res.ok) {
	console.error(`POST /wp-json/wp/v2/${type}: HTTP ${res.status}\n${await res.text()}`);
	process.exit(1);
}
const created = await res.json();

const path = `_drafts/${created.type}-${created.id}-${created.slug || slug}.html`;
await mkdir(join(WIKI_DIR, '_drafts'), { recursive: true });
await writeFile(join(WIKI_DIR, path), (created.content?.raw ?? content) + '\n', 'utf8');

map.push({
	path,
	id: created.id,
	type: created.type,
	rest_base: type,
	slug: created.slug || slug,
	title,
	parent: parentId,
	status: created.status,
	menu_order: created.menu_order ?? 0,
	template: created.template ?? '',
	modified_gmt: created.modified_gmt,
	link: created.link,
});
map.sort((a, b) => a.path.localeCompare(b.path));
await writeFile(MAP_FILE, JSON.stringify(map, null, 2) + '\n', 'utf8');

console.log(`Created ${created.type} #${created.id} "${title}" as a draft under #${parentId}.`);
console.log(`Edit ${join(WIKI_DIR, path)} and push it with wiki-push.mjs; publish from wp-admin when it's ready.`);
