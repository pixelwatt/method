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

Block vocabulary inside the column — copy these from a sibling page rather
than typing them from memory:

- `<!-- wp:heading --><h2 class="wp-block-heading">…</h2>` (`{"level":3}` for h3)
- `<!-- wp:paragraph --><p>…</p>`; parameters are written as
  `<p><code>$name</code> <em>(type)</em> : <br>Description.</p>`
- `<!-- wp:list --><ul class="wp-block-list"><!-- wp:list-item --><li>…</li><!-- /wp:list-item --></ul>`
- `<!-- wp:table {"backgroundColor":"cl-light"} --><figure class="wp-block-table"><table class="has-cl-light-background-color has-background has-fixed-layout"><thead>…</thead><tbody>…</tbody></table></figure>`
- `<!-- wp:method/code {"code":"…","language":"php"} /-->` — code samples.
  `code` holds the plain text (no HTML entities); `language` is one of
  php, php-template, html, css, scss, javascript, typescript, json, bash,
  markdown, plaintext (omit for php). Optional `label` for a file-name pill.
  Attribute JSON is escaped the way the editor does it: `--` → `--`,
  `<` `>` `&` → `<` `>` `&`, `"` inside strings → `"`,
  newlines → `\n`. Copy the escaping from an existing block when unsure.

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
| core block extensions (`lib/blocks/method-core-extensions/`) | `core-extensions.html`, one page, a section per extension |
| guides | `docs/wiki/guides/*.html` — hand-written; only touched when asked |

A new page is created with `wiki-create.mjs` as a draft, `--from` the nearest
sibling page so the chrome and section order are right, then edited and
pushed like any other file; it goes live only when Rob publishes it. Index
pages (`documentation.html`, `method-blocks.html`, `components.html`,
`php-function-class-reference.html`, `filters-actions-reference.html`) are
card grids: a `method/fitted-image` with an uploaded SVG icon and a
`method/theme-button` linking the child. The card needs an icon from the
media library, which is Rob's call — report it, don't improvise.

### Current coverage gaps (Oct 2026) — a work queue, not an instruction to fill them all

- Pages with no Changelog section yet: all 15 component pages, all 11 block pages, core-extensions, and 10 of the 29 function/class pages (`grep -L 'wp-block-heading">Changelog' docs/wiki/documentation/**/*.html`). A backfill is a legitimate one-off task: derive each Introduced row from git as above.
- Blocks with no page: code, scrollspy, swiper, modal, mapbox-map, looping-alert, fluid-video (navbar and bootstrap-tabs are commented out in blocks.php — don't document).
- Components/hooks with no page: MethodBackdropControls, MethodBreakpointSelect, MethodFeaturedImage/MethodUseFeaturedImage, MethodFlexControls, MethodSwiperControls, MethodSwiperNav, useCanvasViewport, usePersistentId. (`MethodResponsive.js` is documented as `methodresponsivetabs`.)
- Hooks with no page: every `method/*` hook (modals, plugin dependencies, responsive editing), plus `method_code_languages`, `method_core_extensions_config`, `method_mapbox_*`, `method_theme_icons`, `method_utility_*`.
- Functions with no page: ~26 in `lib/*.php`, most of them setup/enqueue internals (`method_scripts`, `method_inject_gtag`, `method_register_*_metabox`…) that probably shouldn't have one. Public-API candidates: `method_get_lightbox_attributes`, `method_get_modal_sizes`, `method_register_modal`, `method_get_theme_icons`, `method_parse_video_url`, `method_build_embed_url`.

Whether a symbol deserves a page is Rob's decision. The release sync reports
new public symbols; it does not create pages for them unless the task says
which ones to create.

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

### Worked example — 2.0.0-beta30, breakpoint colors (real, and still open)

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
