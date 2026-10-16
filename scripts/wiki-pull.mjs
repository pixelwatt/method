#!/usr/bin/env node
// wiki-pull.mjs — snapshot raw block markup from method.wiki into docs/wiki/
//
// Usage (Node 18+, no dependencies):
//   WP_APP_USER=claude-docs WP_APP_PASS='xxxx xxxx xxxx xxxx xxxx xxxx' node scripts/wiki-pull.mjs
//
// Optional env:
//   WP_SITE   default https://method.wiki
//   WIKI_DIR  default docs/wiki
//   WP_TYPES  comma-separated REST bases, default "pages,guides"
//
// Output:
//   docs/wiki/<url-path>.html        post_content exactly as stored (content.raw)
//   docs/wiki/_drafts/<type>-<id>-<slug>.html   non-published items (no pretty permalink)
//   docs/wiki/wiki-map.json          metadata sidecar keyed by path

import { mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const SITE  = (process.env.WP_SITE ?? 'https://method.wiki').replace(/\/$/, '');
const OUT   = process.env.WIKI_DIR ?? 'docs/wiki';
const TYPES = (process.env.WP_TYPES ?? 'pages,guides').split(',').map(s => s.trim()).filter(Boolean);

const { WP_APP_USER, WP_APP_PASS } = process.env;
if (!WP_APP_USER || !WP_APP_PASS) {
  console.error('Set WP_APP_USER and WP_APP_PASS (application password).');
  process.exit(1);
}
const AUTH = 'Basic ' + Buffer.from(`${WP_APP_USER}:${WP_APP_PASS}`).toString('base64');

// context=edit is what unlocks content.raw and title.raw.
const FIELDS = 'id,slug,link,title,parent,status,modified_gmt,menu_order,template,type,content';
const STATUSES = 'publish,draft,pending,private,future';

async function fetchAll(restBase) {
  const items = [];
  for (let page = 1; ; page++) {
    const url = `${SITE}/wp-json/wp/v2/${restBase}`
      + `?context=edit&status=${STATUSES}&per_page=100&page=${page}&_fields=${FIELDS}`;
    const res = await fetch(url, { headers: { Authorization: AUTH } });
    if (!res.ok) {
      throw new Error(`${restBase} page ${page}: HTTP ${res.status}\n${await res.text()}`);
    }
    items.push(...(await res.json()));
    const totalPages = Number(res.headers.get('x-wp-totalpages') ?? 1);
    if (page >= totalPages) break;
  }
  return items;
}

function relPath(p) {
  if (p.status !== 'publish') {
    return join('_drafts', `${p.type}-${p.id}-${p.slug || 'untitled'}.html`);
  }
  const path = new URL(p.link).pathname.replace(/^\/+|\/+$/g, '');
  return (path || 'home') + '.html';
}

// Start clean so deleted pages don't linger as stale files.
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const map = [];
for (const base of TYPES) {
  const items = await fetchAll(base);
  for (const p of items) {
    const path = relPath(p);
    const file = join(OUT, path);
    await mkdir(dirname(file), { recursive: true });
    // Write exactly what WordPress stores; trailing newline added so diffs stay clean.
    await writeFile(file, (p.content?.raw ?? '') + '\n', 'utf8');
    map.push({
      path,
      id: p.id,
      type: p.type,
      rest_base: base,
      slug: p.slug,
      title: p.title?.raw ?? '',
      parent: p.parent ?? 0,
      status: p.status,
      menu_order: p.menu_order ?? 0,
      template: p.template ?? '',
      modified_gmt: p.modified_gmt,
      link: p.link,
    });
  }
  console.log(`${base}: ${items.length} items`);
}

map.sort((a, b) => a.path.localeCompare(b.path));
await writeFile(join(OUT, 'wiki-map.json'), JSON.stringify(map, null, 2) + '\n', 'utf8');
console.log(`Wrote ${map.length} files + wiki-map.json to ${OUT}/`);
