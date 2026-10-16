/**
 * Method Code — Frontend
 *
 * Highlights every `.method-code` printed by method-code.php and wires its
 * copy button. The language comes from the `language-…` class on the
 * <code>, so the PHP render and this script share one contract; the
 * grammars and the highlighting itself live in lib/blocks/utils/highlight.js,
 * which the editor uses too.
 *
 * Blocks added to the page later (a modal's content, an AJAX-loaded
 * section) can be picked up by dispatching `method:code-refresh` on
 * document, or by calling `window.methodCode.init(container)`.
 */
import { highlightElement } from '../../utils/highlight';

const SELECTOR = '.method-code:not([data-code-ready])';
const COPIED_FOR = 2000;

/**
 * The copy button writes the sample to the clipboard and shows "Copied" for
 * a moment. The sample is read from the <code>'s text, so it is exactly what
 * the page shows, entities decoded, highlighting spans ignored.
 *
 * @param {HTMLElement} block
 */
function wireCopy(block) {
	const button = block.querySelector('.method-code__copy');
	const code = block.querySelector('.method-code__code');
	if (!button || !code) return;

	if (!navigator.clipboard || !window.isSecureContext) {
		// Without the async clipboard API (http, old browsers) the button
		// would only ever fail, so it goes.
		button.remove();
		return;
	}

	const text = button.querySelector('.method-code__copy-text');
	let timer = null;

	button.addEventListener('click', async () => {
		try {
			await navigator.clipboard.writeText(code.textContent);
		} catch (e) {
			return;
		}
		block.classList.add('is-copied');
		if (text) text.textContent = button.dataset.copiedLabel || 'Copied';
		window.clearTimeout(timer);
		timer = window.setTimeout(() => {
			block.classList.remove('is-copied');
			if (text) text.textContent = button.dataset.copyLabel || 'Copy';
		}, COPIED_FOR);
	});
}

/**
 * @param {HTMLElement} block A `.method-code` wrapper.
 */
function initBlock(block) {
	if (block.hasAttribute('data-code-ready')) return;
	block.setAttribute('data-code-ready', '');
	highlightElement(block.querySelector('.method-code__code'));
	wireCopy(block);
}

/**
 * @param {ParentNode} root Where to look; the document by default.
 */
function init(root = document) {
	root.querySelectorAll(SELECTOR).forEach(initBlock);
}

function boot() {
	init();
	document.addEventListener('method:code-refresh', () => init());
}

window.methodCode = { init };

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', boot);
} else {
	boot();
}
