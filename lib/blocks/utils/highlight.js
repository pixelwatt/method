/* eslint-disable prettier/prettier */
/**
 * Code block highlighting, shared by the block's view script
 * (method-code/src/frontend.js) and its editor (method-code/src/edit.js), so
 * a sample is tokenised the same on the page and in the canvas.
 *
 * highlight.js core with only the grammars the block offers registered. The
 * LANGUAGES list below is the block's Language option and the only place a
 * grammar is wired up; the PHP side (method_code_get_languages() in
 * method-code.php) mirrors the value => label pairs for the header pill and
 * for sanitising the stored value, so the two lists are kept in step.
 *
 * Highlighting adds `hljs-*` classes only; the colors come from global.scss
 * (".method-code" theme section), where a child theme can retheme them
 * through the --method-code-* custom properties.
 */
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import phpTemplate from 'highlight.js/lib/languages/php-template';
import plaintext from 'highlight.js/lib/languages/plaintext';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

// Order matters only for the aliases: html points at xml.
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('php', php);
hljs.registerLanguage('php-template', phpTemplate);
hljs.registerLanguage('plaintext', plaintext);

// "html" is the one stored value that is not a grammar's own name.
hljs.registerAliases(['html'], { languageName: 'xml' });

/**
 * Other names a language may be stored under (what another block, or a
 * person, would call it), mapped to the value the block uses. Mirrors
 * method_code_get_language_aliases() in method-code.php.
 */
export const ALIASES = {
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

/**
 * The Language option, in menu order. `value` is what the block stores and
 * what highlight.js is asked for; `label` is the header pill's text when the
 * block has no label of its own.
 */
export const LANGUAGES = [
	{ value: 'php', label: 'PHP' },
	{ value: 'php-template', label: 'PHP + HTML' },
	{ value: 'html', label: 'HTML' },
	{ value: 'css', label: 'CSS' },
	{ value: 'scss', label: 'SCSS' },
	{ value: 'javascript', label: 'JavaScript' },
	{ value: 'typescript', label: 'TypeScript' },
	{ value: 'json', label: 'JSON' },
	{ value: 'bash', label: 'Shell' },
	{ value: 'markdown', label: 'Markdown' },
	{ value: 'plaintext', label: 'Plain text' },
];

export const DEFAULT_LANGUAGE = 'php';
export const FALLBACK_LANGUAGE = 'plaintext';

/**
 * A stored language value, resolved to one of LANGUAGES: aliases first,
 * then the list, then plain text. Mirrors method_code_sanitize_language()
 * in method-code.php.
 *
 * @param {string} language
 * @return {string}
 */
export function resolveLanguage(language) {
	let value = (language || '').trim().toLowerCase();
	if (ALIASES[value]) value = ALIASES[value];
	return LANGUAGES.some((l) => l.value === value) ? value : FALLBACK_LANGUAGE;
}

/**
 * The pill label for a language value.
 *
 * @param {string} language
 * @return {string}
 */
export function getLanguageLabel(language) {
	const value = resolveLanguage(language);
	const entry = LANGUAGES.find((l) => l.value === value);
	return entry ? entry.label : value;
}

/**
 * The sample as highlight.js markup (escaped text in `hljs-*` spans).
 *
 * @param {string} code
 * @param {string} language
 * @return {string} HTML
 */
export function highlightCode(code, language) {
	return hljs.highlight(code || '', {
		language: resolveLanguage(language),
		ignoreIllegals: true,
	}).value;
}

/**
 * Highlights a rendered `<code class="language-…">` in place. The language
 * is read from that class, as method-code.php prints it; an unknown one
 * falls back to plain text rather than highlight.js's auto-detection.
 *
 * @param {HTMLElement} codeEl
 */
export function highlightElement(codeEl) {
	if (!codeEl || codeEl.dataset.highlighted === 'yes') return;
	const match = /\blanguage-([\w+-]+)/.exec(codeEl.className || '');
	const language = resolveLanguage(match ? match[1] : '');
	codeEl.innerHTML = highlightCode(codeEl.textContent, language);
	codeEl.classList.add('hljs');
	codeEl.dataset.highlighted = 'yes';
}

export default hljs;
