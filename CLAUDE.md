# CLAUDE.md — Method

Method is an FSE WordPress parent theme framework (Bootstrap 5 grid, CMB2
options, a family of dynamic blocks with a shared responsive-settings
system). This repo is the source of truth for the framework and the working
copy for its public documentation at https://method.wiki, which lives in a
WordPress multisite (subsite 3, child theme Cortlandt) and is edited through
the REST API by the scripts in `scripts/`.

Two kinds of work happen here: normal development on Method, and keeping the
wiki in step with it after a release. Everything below was verified against
the repo at 2.0.0-beta30; treat it as current until something contradicts it,
then fix this file.

---

## Repo map

```
functions.php                    requires lib/*.php in a fixed order (see its header comment)
lib/config.php                   METHOD_OPTIONS defaults (breakpoints, breakpoint-colors, typography presets…); a child theme overrides
lib/theme-setup.php              enqueues, theme supports, plugin dependencies (vendor/ wp-dependency-installer, wp-dependencies.json)
lib/theme-options.php            CMB2 options pages
lib/blocks.php                   block registration hub + the responsive CSS engine:
                                   method_get_block_css_declarations(), method_get_block_media_query_declarations(),
                                   method_get_block_responsive_styles(), method_get_responsive_setting(),
                                   method_get_block_inline_styles(), method_sanitize_theme_color(), method_get_theme_icons()…
lib/helper-functions.php         method_check_array_key() and the other method_* helpers
lib/class-method-utility.php     Method_Utility (options/meta access)
lib/class-method-css-collector.php  Method_CSS_Collector — method_collect_css() output, printed once per page
lib/class-method-bs-accordion.php   MethodBSAccordion
lib/class-method-modals.php      Method_Modals registry (method/* hooks)
lib/admin-customization.php
lib/blocks/<method-name>/        one folder per block:
    <method-name>.php              register_block_type( __DIR__ . '/build', [ 'render_callback' => … ] ) + render
    src/block.json                 attributes incl. responsiveSettings default; editorScript + viewScript file: refs
    src/index.js                   registerBlockType(metadata.name, { …metadata, icon, edit }) — and save() for wrapper blocks
    src/edit.js | editor.js        inspector controls + canvas
    src/frontend.js                view script (progressive enhancement; boots on DOMContentLoaded)
    build/                         committed; what WordPress loads
lib/blocks/components/           shared editor controls: Method{Spacing,Border,Typography,Dimension,Color,Background,
                                 Alignment,Addt,Shadow,Flex,Swiper}Controls, MethodOptInControl, MethodResponsive(Tabs),
                                 MethodBreakpointSelect, MethodStyleTag, MethodLinkToolbar, MethodAspectRatio…
lib/blocks/hooks/                useResponsiveSetter, useCanvasViewport, usePersistentId
lib/blocks/utils/                runtime shared by editor + view script: highlight.js, mapbox.js, swiperRuntime.js, lightbox.js, modals.js…
lib/blocks/build-all.js          builds every block (or a name prefix) with wp-scripts
assets/scss/global.scss          ALL block CSS, frontend and editor, in one file; reaches the editor iframe via add_editor_style
assets/scss/editorui.scss        editor UI outside the iframe
assets/css/*.css, *.min.css      compiled, committed
inc/                             vendored libraries (bootstrap, swiper, jarallax, vegas, matchHeight, bootstrap-5-navwalker)
CHANGELOG                        release notes, newest first (format below)
style.css                        Version: header = METHOD_VERSION
scripts/                         wiki tooling (below); export-ignored from release archives, as is this file
docs/wiki/                       gitignored snapshot of the wiki, written by scripts/wiki-pull.mjs
docs/wiki-backups/               gitignored; pre-push copies written by scripts/wiki-push.mjs
```

Hooks are found with `grep -rn "apply_filters( '\|do_action( '" lib`. Two naming
styles coexist: the original `method_*` (button styles, social platforms,
options fields, theme icons, utility) and the newer `method/*` (modals,
plugin dependencies, responsive editing).

### Build

```
cd lib/blocks && npm install            # once; highlight.js is a runtime dependency
node build-all.js                        # every block
node build-all.js method-code            # one block (prefix match)
cd ../.. && npm install && npx gulp compile-global-styles   # after any global.scss change
```

ESLint via `wp-scripts lint-js` is currently broken by a `@typescript-eslint`
version clash in `lib/blocks/node_modules`; the webpack build is the syntax
check that works.

### Conventions to follow in Method code

- **Every Method block is dynamic.** Wrapper blocks (Section, Container, grids,
  Buttons) save only an inner-blocks `<div>` with a fixed class; everything
  else is attributes + `render_callback`. Never move a block to a static
  `save()`; never add a deprecation unless a wrapper's saved markup changes
  (beta28's accordion item is the one precedent).
- **Responsive settings** live in `attributes.responsiveSettings.{base,mobile,tablet,wide}`.
  The render emits a non-base tier only when its `enabled` is truthy, and
  reads every value through `method_check_array_key()` (PHP `empty()`), so
  `""`/`false`/`null` are invisible but `"0rem"` is a real value. Controls are
  opt-in (ToolsPanel): a key is absent until the author enables it.
- **PHP mirrors JS and says so.** A render that re-derives something the
  editor computes carries a `// Mirrors X in lib/blocks/utils/….js` comment,
  and vice versa (see method-swiper.php, method-mapbox-map.php, method-code.php).
- **Per-block CSS targets `#<uniqid('method-')>`** collected through
  `method_get_block_responsive_styles()` → `method_collect_css()`; the editor
  previews the same map through `MethodStyleTag` with `#block-${clientId}`.
- **Styles go in `global.scss`**, in a commented section per block, with
  `--method-<block>-*` custom properties where a child theme should be able to
  retheme. Blocks don't ship their own stylesheets.
- **Inspector controls**: `@wordpress/components` with `__nextHasNoMarginBottom`;
  shared Method components for spacing/border/typography/colors; the base tier
  rendered directly, overrides through `MethodResponsiveTabs`'s `renderControls`.
- **CHANGELOG entry per release**: `## 2.0.0-betaNN`, a `###` section per
  feature with bold-led bullets that explain mechanism (what is stored, what
  renders, what a child theme can do), then `### Housekeeping` (version bump,
  recompiled bundles/CSS). Bump `style.css` in the same commit.
- Naming: functions `method_<block>_<verb>()` or `method_get_*()`, classes
  `Method_*`, filters as above, block names `method/<slug>`, categories
  `method-{container,layout,component,page}-blocks`.

---

## The wiki

### What is where

| Scope | Where to look |
|---|---|
| Live content | method.wiki, page/guide post types; REST at `/wp-json/wp/v2/{pages,guides}`, auth as `claudedocs` with an application password in `WP_APP_USER` / `WP_APP_PASS` (never in files) |
| KSES | `claudedocs` must have `unfiltered_html` on the subsite (granted by the `method-wiki-claudedocs.php` mu-plugin on the network). Without it, multisite maps the cap to `do_not_allow`, `wp_filter_post_kses` runs on every save, and since 5.3.1 that parses each block and runs `wp_kses` over every string attribute — a bare `>` in a Code block's sample comes back as `&gt;`. Symptom: a pushed file no longer matches live on the next pull. |
| Local working copy | `docs/wiki/<url-path>.html` = `post_content` exactly as stored; `docs/wiki/wiki-map.json` = id, type, rest_base, status, parent, modified_gmt per file. Both are rebuilt by every pull and are not tracked. |
| Legacy attribute cleanup | not a script here: the Method Tools plugin's **Legacy Markup Cleaner** (`wp method-tools run legacy-markup-cleaner`) does it on the live site with revisions and run backups |

### Scripts

```
node scripts/wiki-pull.mjs                       # wipes docs/wiki and rewrites it from live; always the first step
node scripts/wiki-push.mjs <file> --diff --dry   # live-vs-file diff, nothing sent
node scripts/wiki-push.mjs <file>                # sends `content` only; copies previous live content to docs/wiki-backups/
node scripts/wiki-create.mjs --parent <path|id> --slug <slug> --title "…" [--from <sibling file>]
                                                 # new page as a DRAFT under a parent, registered in wiki-map.json; publish from wp-admin
node scripts/wiki-convert-code.mjs <file|--all>  # one-off: Code Block Pro → method/code (done for the whole site in Oct 2026)
node scripts/wiki-normalize-attrs.mjs            # one-off, superseded by the plugin tool above
```

`wiki-push.mjs` refuses a file whose live page changed since the pull
(`modified_gmt` mismatch) unless `--force`; a file identical to live is
"nothing to push". There is no staging state: a push to a published page is
live immediately. Review happens before, with `--diff --dry`; rollback is
`docs/wiki-backups/` (and WordPress revisions where the host keeps them).

### Workflow for any wiki change

1. `wiki-pull.mjs` — never edit a stale snapshot, and never pull again
   between editing and pushing (the pull discards unpushed edits).
2. Edit the file(s) under `docs/wiki/`.
3. `wiki-push.mjs <file> --diff --dry` and read the hunks.
4. `wiki-push.mjs <file>`; for several files, loop with `|| break`.
5. Open the page on method.wiki.

### Page anatomy (every documentation page)

Chrome, identical on every page and never edited:

```
method/section  → method/container → method/bc, heading{level:1}          (hero: breadcrumb + title)
method/section  → cl/lines (Cortlandt) → method/container → method/advanced-grid → row →
    advanced-grid-col {gridCols:16, className:"method-doc-content"}         ← THE CONTENT COLUMN
    advanced-grid-col {gridCols:6} → method/scrollspy {targetSelector:".method-doc-content"}
```

Everything editable sits inside the 16-column `method-doc-content` column, as
core blocks plus `method/code`. Sections are `h2` headings separated by

```html
<!-- wp:separator {"className":"is-style-wide","style":{"spacing":{"margin":{"top":"2.5rem","bottom":"2.5rem"}}}} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide" style="margin-top:2.5rem;margin-bottom:2.5rem"/>
<!-- /wp:separator -->
```

Two separators. The heavy one above divides h2 sections. A lighter one
(`"color":{"background":"#271a3b33"}` on the delimiter, `has-text-color
has-alpha-channel-opacity has-background` and the matching inline colors on the
`<hr>`) goes *before every h3* — between it and whatever precedes it in the
section, whether the previous h3 subsection or the h2's own intro paragraph or
code sample — except an h3 that directly follows its h2 heading. Never before an
h2. Copy it from any page with h3s (`components/methodbackgroundcontrols.html`,
`systems/plugin-dependencies.html`).

Block vocabulary inside the column — copy these from a sibling page rather
than typing them from memory:

- `<!-- wp:heading --><h2 class="wp-block-heading">…</h2>` (`{"level":3}` for h3)
- `<!-- wp:paragraph --><p>…</p>`; parameters are written as
  `<p><code>$name</code> <em>(type)</em> : <br>Description.</p>`
- `<!-- wp:list --><ul class="wp-block-list"><!-- wp:list-item --><li>…</li><!-- /wp:list-item --></ul>`
  (`{"ordered":true}` + `<ol>` for numbered). The editor serialises sibling
  `list-item`s with a blank line between them (`<!-- /wp:list-item -->\n\n<!-- wp:list-item -->`);
  write them that way or the first save in the editor will re-serialise the page.
- `<!-- wp:table {"backgroundColor":"cl-light"} --><figure class="wp-block-table"><table class="has-cl-light-background-color has-background has-fixed-layout"><thead>…</thead><tbody>…</tbody></table></figure>`
- `<!-- wp:method/code {"code":"…","language":"php"} /-->` — code samples.
  `code` holds the plain text (no HTML entities); `language` is one of
  php, php-template, html, css, scss, javascript, typescript, json, bash,
  markdown, plaintext (omit for php). Optional `label` for a file-name pill.
  Attribute JSON is escaped the way the editor does it: `--` → `\u002d\u002d`,
  `<` `>` `&` → `\u003c` `\u003e` `\u0026`, `"` inside strings → `\u0022`,
  a literal `\` inside strings → `\u005c`, newlines → `\n`. Copy the escaping from an existing block when unsure.

The four page templates, by section (in order):

| Page type | Sections |
|---|---|
| PHP function / class | Description · Parameters · Return · Source · Notes (list) · Changelog |
| Filter / action | Description · Parameters (code) · Source (code) · Usage (code) · Notes · Related (list of links) · Changelog |
| Block | Overview (list) · Usage · Attributes (table) › responsiveSettings Structure (json code) · Control Sets (table) › Hooks (table) · Data & Dependencies (list) · Frontend Rendering (html code) · Filters · Changelog |
| Component / hook | Overview (list) · Props (table) › defaults (json code) · Controls (h3 per control, lists) · ToolsPanel Behavior · CSS Output (table) · Usage by Blocks (table) · Changelog |

### The Changelog section

Every documentation page ends with a **Changelog** section: an h2, then a
two-column table (**Version** · **Description**), oldest row first. It is the
last section inside the content column, after the standard separator.

- **First row: the release the symbol was introduced in**, as a fact from git,
  not from memory. Find the commit that added it, then the first tag that
  contains that commit:
  `git log --reverse --format=%h -S'function method_foo' -- lib | head -1`
  (or `--diff-filter=A -- <file>` for a block/component file), then
  `git tag --contains <sha> --sort=v:refname | head -1`. Write the tag without
  its `v`: `2.0.0-alpha4`, `2.0.0-beta5`. A symbol whose first containing tag
  is a 1.x tag gets `2.0.0` with "Carried over from Method 1.x."
- **One row per change that touched the page**, in the release (tag) that
  shipped it. Describe the change in one sentence, from the diff, and link the
  evidence in parentheses at the end: the commit, and the file when a specific
  file is the subject. Repo: `https://github.com/pixelwatt/method`.
  - commit: `<a href="https://github.com/pixelwatt/method/commit/3fc99f5">3fc99f5</a>`
  - file at a tag: `<a href="https://github.com/pixelwatt/method/blob/v2.0.0-beta30/lib/config.php">lib/config.php</a>` (add `#L42-L48` for a line range)
  - a whole release: `<a href="https://github.com/pixelwatt/method/compare/v2.0.0-beta29...v2.0.0-beta30">beta29…beta30</a>`
  One commit link per row is enough; a row is a sentence, not a log.
- Row markup, exactly: `<tr><td>2.0.0-beta30</td><td>Default colors changed to #d17c28, #2b9d9a, #9b2d8c (<a href="https://github.com/pixelwatt/method/commit/3fc99f5">3fc99f5</a>).</td></tr>`
- The table block is the one in the anatomy list above
  (`{"backgroundColor":"cl-light"}`, `has-cl-light-background-color has-background has-fixed-layout`).
- **A page without a Changelog section gets one** the first time it is
  edited, with the Introduced row derived as above, placed after the page's
  last section. Pages whose first row says the generic `2.0.0 | Introduced.`
  get the real tag when they are next touched; don't mass-rewrite for that
  alone unless asked.

### Symbol → page

| In the repo | Wiki file under `docs/wiki/documentation/` |
|---|---|
| `function method_foo()` in `lib/*.php` | `php-function-class-reference/method_foo.html` |
| `class Method_CSS_Collector`, `MethodBSAccordion` | `php-function-class-reference/method_css_collector.html`, `methodbsaccordion.html` (lowercased, underscores kept) |
| `apply_filters( 'method_foo' )` / `do_action` | `filters-actions-reference/method_foo.html` — **no convention yet for `method/foo` hooks** (slash); ask |
| `lib/blocks/method-<x>/` | `method-blocks/<slug>.html` with slug exceptions: `method/bc` → `breadcrumb`, `method/flex` → `flex-container`; sub-blocks (`advanced-grid-col`, `accordion-item`, `theme-button`, `swiper-slide`…) are sections of their parent's page |
| `lib/blocks/components/MethodFoo.js`, `hooks/useFoo.js` | `components/methodfoo.html`, `components/usefoo.html` (lowercased) |
| core block extensions (`lib/blocks/method-core-extensions/`) | `systems/core-extensions.html`, one page, a section per extension |
| guides | `docs/wiki/guides/*.html` — hand-written; only touched when asked |
| Method Child (`pixelwatt/method-child`) | `method-child.html` — a top-level child of Documentation (parent 128). Source is the submodule at `~/method-generator/method-child` on Rob's Mac (its own git history and `v1.0.0-betaN` tags); commit links go to that repo |
| Method Generator (`pixelwatt/method-generator`) | `method-generator.html` — same level. Source `~/method-generator` (`v2-1.0.0-betaN` tags; `v1.x` tags are the Method 1.x generator) |

A new page is created with `wiki-create.mjs` as a draft, `--from` the nearest
sibling page so the chrome and section order are right, then edited and
pushed like any other file; it goes live only when Rob publishes it. Index
pages (`documentation.html`, `method-blocks.html`, `components.html`,
`php-function-class-reference.html`, `filters-actions-reference.html`) are
card grids: a `method/fitted-image` with an uploaded SVG icon and a
`method/theme-button` linking the child. The card needs an icon from the
media library, which is Rob's call — report it, don't improvise.

### Current coverage gaps (Oct 2026)

- Changelog state (2026-10-19): every page has a Changelog section. The 37 reference pages
  (`php-function-class-reference/`, `filters-actions-reference/`) have a git-verified first row
  with a commit link (backfill run of 2026-10-19, which also collapsed the nested `<code>` tags
  the editor had left in their signature paragraphs). Block, component and system pages written
  before this session still carry unverified first rows without commit links (`2.0.0-alpha4 |
  Introduced.` and the like); verify each one against git when the release walk touches the page.
- Release walk (beta5 → beta30) over the pre-session pages: done locally 2026-10-19 for the 11
  block pages, core-extensions, the 14 pre-session component pages and the 6 reference pages whose
  symbol changed (list in `docs/wiki-new/_walk-all.txt`, pending Rob's push). Method used: per
  symbol, not per release — for a block, `git log 0693f3a..v2.0.0-beta30 -- lib/blocks/method-<x>
  ':(exclude)lib/blocks/method-<x>/build'`; for a component, the file's log; for a PHP function
  or hook, the function body extracted at every tag and compared (string-aware brace matching —
  naive counting breaks on `' { '` literals in the CSS builders). Rows cite the commit, or the
  release compare link where a change spans many commits (beta5's responsive refactor).
  After this the walk is caught up and the per-release procedure below is the steady state.
- Everything below is a **proposal** until a box is ticked. Create only ticked pages; report the rest when a release touches them.

#### Proposed new pages

**System pages** — children of the `systems` landing page (`documentation/systems/<slug>.html`
once published): what the system is for, how it works, which blocks/functions/hooks
take part (linked), child-theme extension points, then Changelog. Template: any
published sibling, e.g. `documentation/systems/theme-options.html`. The landing page
itself is a card grid like `components.html`; a new system page needs a card there.
The landing page and all seven system pages below are published (2026-10-18);
`core-extensions` moved under it, and its card on the Documentation landing page
was replaced by a Systems card.

- [x] `modals` (published 2026-10-18) — the modal system (beta26–27): `method/modal` block, the Modals
      panel, `Method_Modals` registry, `method_register_modal()`,
      `method_get_modal_sizes()`, `method_sanitize_modal_id()`, opening a modal
      from any `#id` link, fullscreen tiers, printing at page end. Hooks table:
      `method/modal_args`, `modal_content`, `modal_duplicate`, `modal_markup`,
      `modal_registered`, `modal_script_dependencies`, `modal_sizes`,
      `method/register_modals` — documented here, not as nine pages.
- [x] `theme-icons` (published 2026-10-18) — the shared icon system (beta18): `method_register_theme_icons()`,
      `method_get_theme_icons()`, the `method_theme_icons` filter, which blocks
      consume icons (swiper arrows, social nav, theme button), how a child theme adds one.
- [x] `image-lightbox` (published 2026-10-18) — (beta23) `method_get_lightbox_attributes()`,
      `lib/blocks/utils/lightbox.js`, the shared `<dialog class="method-lightbox">`,
      which blocks use it, degradation without JS or `<dialog>`, CSS hooks.
- [x] `plugin-dependencies` (published 2026-10-18) — (beta25) `wp-dependencies.json`, WP Dependency
      Installer, `method_collect_plugin_dependencies()`, the
      `method/plugin_dependencies` filter, how a child theme adds a required plugin.
- [x] `editor-integration` (published 2026-10-18) — the Method block collection and inserter (beta22),
      breakpoint colors and tabs (`lib/config.php`, `method_get_breakpoint_colors()`),
      the responsive-editing flag (`method_configure_responsive_editing()`,
      `method/responsive_editing_enabled`, WordPress 7.1's `responsiveEditingEnabled`
      and why Method turns it off by default), `methodGlobalData`.
- [x] `responsive-embeds` (published 2026-10-18) — (beta17, opt-in) `method_maybe_enable_embed_wrap()`,
      `method_responsive_embed_wrap()` on `embed_oembed_html`; short page.
- [x] `theme-options` (published 2026-10-18) — the CMB2 options pages (`lib/theme-options.php`): every
      option, where it is read (gtag injection, social platforms, Mapbox token via
      cmb2-mapbox). There is no page for this today at all.

**Block pages** — `documentation/method-blocks/<slug>.html`, Block template.
Sub-blocks are sections of the parent (as advanced-grid-col is of advanced-grid).
Each section's pages carry a different hero image id in the chrome (blocks 6,
components 101/587, functions 607, hooks 585, systems 593), so build a block
page from a block page (`method-blocks/fitted-image.html`), never from a
system page. `method-blocks.html` is a card grid like `components.html`; a new
block page needs a card there (the icon is added by hand).

- [x] `code` (published 2026-10-18) — beta30. Attributes, languages, the plain-text storage contract,
      `method_code_languages`, theming via `--method-code-*`.
- [x] `scrollspy` (published 2026-10-18) — predates the wiki but never got a page; every wiki page uses it.
- [x] `swiper` (published 2026-10-18) — beta15/16/18/19/29; `method/swiper-slide` as a section. Effects,
      hash navigation, slide widths, theme breakpoints, `utils/swiperRuntime.js`.
- [x] `modal` (published 2026-10-18) — beta26; the block's own attributes and sizes, linking to the
      `modals` system page for the registry and hooks.
- [x] `mapbox-map` (published 2026-10-18) — beta27. Token resolution (site vs block), styles, pin,
      `method_mapbox_token`, `method_mapbox_map_styles`, `method_mapbox_map_config`.
- [x] `looping-alert` (published 2026-10-18) — beta17 (titled Marquee in the editor).
- [x] `fluid-video` (published 2026-10-18) — beta14; include `method_parse_video_url()` and
      `method_build_embed_url()` as its Data & Dependencies.
- Not proposed: navbar, bootstrap-tabs (both commented out in `blocks.php`).

**Component / hook pages** — `documentation/components/<lowercase>.html`.

- [x] `methodbackdropcontrols` (published 2026-10-18) — beta20/21 (Container and Section backdrop filters).
- [x] `methodflexcontrols` (published 2026-10-18) — flex container/item controls incl. wrap (beta24) and mobile order (beta20).
- [x] `methodswipercontrols` (published 2026-10-18) — beta15+; the `MethodSwiperNav` arrow helpers as a section, not a page.
- [x] `methodbreakpointselect` (published 2026-10-18) — small; used by Scrollspy's "sticky at".
- [x] `usecanvasviewport` (published 2026-10-18) — canvas-aware previews (Swiper, Mapbox).
- [x] `usepersistentid` (published 2026-10-18) — a generated-once id that survives copies and synced patterns; used by the Modal block only (beta26).
- Folded in (pushed 2026-10-18): `MethodFeaturedImage` + `MethodUseFeaturedImage` are a
  "Featured Image as Background" section on the existing `methodbackgroundcontrols` page (beta6),
  which also gained the `includeFeaturedImage` / `limited` props, a corrected Display Size table
  (beta21 options) and Changelog rows for beta6, beta14 and beta21.

**Function / class pages** — `documentation/php-function-class-reference/<lowercase>.html`.
Public surface only: something a child theme or plugin would call.

- [x] `method_modals` (published 2026-10-19) (class `Method_Modals`)
- [x] `method_register_modal` (published 2026-10-19)
- [x] `method_get_modal_sizes` (published 2026-10-19)
- [x] `method_sanitize_modal_id` (published 2026-10-19)
- [x] `method_get_lightbox_attributes` (published 2026-10-19)
- [x] `method_get_theme_icons` (published 2026-10-19)
- [x] `method_parse_video_url` (published 2026-10-19)
- [x] `method_build_embed_url` (published 2026-10-19)
- Not proposed (internal, hook callbacks, or covered by a system page):
  `method_scripts`, `method_admin_scripts`, `method_login_scripts`,
  `method_block_assets`, `method_enable_theme_support`,
  `method_register_custom_nav_menus`, `method_register_theme_options_metabox`,
  `method_register_breadcrumb_metabox`, `method_register_taxonomy_breadcrumb_metabox`,
  `method_inject_gtag`, `method_lower_wpseo_priority`, `method_remove_add_new_nf_button`,
  `method_custom_login_url`, `method_method_utility_option_key_callback`,
  `method_run_plugin_dependencies`, `method_collect_plugin_dependencies`,
  `method_register_theme_icons`, `method_configure_responsive_editing`,
  `method_responsive_embed_wrap`, `method_maybe_enable_embed_wrap`,
  `method_get_class`, `method_check_key` (deprecated).

**Hook pages** — `documentation/filters-actions-reference/<hook>.html`, Hook template.
The existing pattern is both: a page per hook *and* a row on the owning
block's Filters section.

- [x] `method_code_languages` (published 2026-10-19)
- [x] `method_core_extensions_config` (published 2026-10-19)
- [x] `method_mapbox_token` (published 2026-10-19)
- [x] `method_mapbox_map_styles` (published 2026-10-19)
- [x] `method_mapbox_map_config` (published 2026-10-19)
- [x] `method_theme_icons` (published 2026-10-19)
- [x] `method_utility_format_tags` (published 2026-10-19)
- [x] `method_utility_option_key` (published 2026-10-19)
- Covered by system pages, no page unless asked: the eight `method/modal_*` and
  `method/register_modals` (modals), `method/plugin_dependencies`
  (plugin-dependencies), `method/responsive_editing_enabled` (editor-integration).
- If a slash-named hook ever needs its own page, the slug replaces `/` with `-`:
  `method-modal_args.html`.

**Pages the walk changed the most** (done 2026-10-19; listed so a reviewer knows where to look):
`swiper-gallery` (rebuilt on the Swiper block in beta23, captions beta27, slide
widths beta29), `fitted-image` (lightbox and linking, beta23), `section` and
`container` (backdrop filters beta20–21, background size beta21), `core-extensions`
(typography set beta18), `flex-container` (wrap, item order, visibility),
`accordion` (panel ids beta28), `methodtypographycontrols` (beta17's additions),
`methodshadowcontrol` (beta21).

**Method Child and Method Generator pages** (generated 2026-10-19, created as
drafts from `docs/wiki-new/method-child.html` and `method-generator.html`; specs in
the harness as `blockpages/method-child.py` and `method-generator.py`). They are
reference pages for the two sibling repos, built on the Systems page chrome
(hero image 593, the same one the Documentation landing uses) until Rob picks
images for them; the breadcrumb block is dynamic so the parent decides the trail.
Sections: Method Child — what's in the theme, how it loads, `METHOD_CHILD_OPTIONS`
(a wholesale replacement for `METHOD_OPTIONS`, read by the five breakpoint/
typography getters and the options page's diagnostics), styles and the gulp build,
the commented extension points mapped to their hook pages, a version/compatibility
table (which Method release each child release's examples target), Changelog from
the child's CHANGELOG with child-repo commit links. Method Generator — the
`build-custom` task series, templated vs copied files, every `_globals.html`
variable and where it lands, the beta5 push step, versions (v2 tags track Method
Child; v1.x built Method 1.x), Changelog with generator-repo commit links. Their
Changelogs follow those repos' tags, not Method's: sync them when *those* repos
tag, by diffing the repo and the child CHANGELOG as for Method. Two facts worth
keeping: the child's `lib/config.php` is a snapshot (beta5 still has the pre-beta30
accent palette), and GitHub's auto-generated Source zip of the generator has an
empty `method-child/` — the usable download is the `method-generator.zip` asset
attached to the release.

### Hard rules for wiki edits

1. **Edit in place.** Load the file, change only the sections the code change
   affects, keep every other byte. A changed parameter touches Parameters,
   possibly Source/Usage samples, and Changelog — not Description.
2. **Chrome is untouchable.** Nothing outside the `method-doc-content` column
   changes, ever, including the Section/Container/grid attributes.
3. **Core block markup must match what the editor saves** (classes above).
   Where a core block in the file carries extra attributes (Method's core
   extensions), keep them.
4. **Every content change gets a Changelog row** on that page, in the format above, linking the commit.
5. **Samples are plain text** in `method/code`'s `code` attribute. When a
   sample must change, change `code` and nothing else about the block.
6. **Schema drift**: if a block's `block.json` attributes changed between the
   two tags, update the Attributes table on its page; the `responsiveSettings
   Structure` sample must match the current default.
7. **Never publish anything that isn't a push of a reviewed file**, never send
   a `status`, never pull between edit and push.
8. **When in doubt, report instead of write.** A table of page · section ·
   proposed change is always an acceptable result.

### Release-sync procedure

Trigger: "Method vX was tagged; sync the wiki from vY."

1. `git diff vY..vX --stat`, then the full diff for `lib/*.php`,
   `lib/blocks/*/src/block.json`, `lib/blocks/*/*.php`, `lib/blocks/components/`,
   `lib/blocks/hooks/`, `lib/blocks/utils/`, `lib/config.php`. Ignore `build/`,
   compiled CSS, CHANGELOG, tooling.
2. Read the CHANGELOG entry for vX: it is written to explain exactly these
   changes and often names the affected attribute keys and functions.
3. Classify each changed symbol and map it to a file with the table above.
   Note new symbols without a page and pages whose symbol is gone.
4. `wiki-pull.mjs`.
5. Edit affected files under the hard rules. For a removed symbol, prepend a
   paragraph "Removed in vX." under the h1 and flag it; don't delete the page.
6. `wiki-push.mjs --diff --dry` per file; push; open the page.
7. Report: page · what changed · confidence, plus unmapped symbols and
   proposed new pages.

The version written into Changelog rows is the tag being synced to (vX
without the `v`), never the `style.css` string at an intermediate commit.

### Worked example — 2.0.0-beta30, breakpoint colors (done 2026-10-18; kept as the model)

Commit `3fc99f5` changed `lib/config.php`:

```diff
 'breakpoint-colors' => array(
     'enabled' => true,
-    'mobile' => '#865EBF',
-    'tablet' => '#D94A64',
-    'wide'   => '#F28729',
+    'mobile' => '#d17c28',
+    'tablet' => '#2b9d9a',
+    'wide'   => '#9b2d8c',
 ),
```

The function that returns them, `method_get_breakpoint_colors()`, has a page
whose **Return** section shows the old values in a `method/code` sample. The
edit, in `docs/wiki/documentation/php-function-class-reference/method_get_breakpoint_colors.html`:

- In that `method/code` delimiter, replace the three hex strings inside the
  `code` attribute. Nothing else in the delimiter changes.
- Append to the Changelog table, before `</tbody>`:
  `<tr><td>2.0.0-beta30</td><td>Default colors changed to #d17c28 (mobile), #2b9d9a (tablet), #9b2d8c (wide) (<a href="https://github.com/pixelwatt/method/commit/3fc99f5">3fc99f5</a>).</td></tr>`
- Its first row says `2.0.0 | Introduced.`; the function arrived in `2e1bbd4`, first tagged `v2.0.0-alpha4`, so while the page is open that row becomes `2.0.0-alpha4`.
- Everything else byte-identical. Confidence: high — the values are in the diff.

The same release added the Code block (`method/code`) and the shared
`lib/blocks/utils/highlight.js`. Neither has a page; the report lists
"new block method/code — proposed `method-blocks/code.html` from the Block
template; index card needs an icon" and leaves it there.

---

## Things not to assume

- That a docblock is right. Prefer the implementation.
- That a page exists because the symbol does, or vice versa. Check `wiki-map.json`.
- That a refactor is documentation-worthy. No public signature or behavior
  change → "no doc impact" in the report.
- That the live wiki matches `docs/wiki/`. It matches the last pull.
