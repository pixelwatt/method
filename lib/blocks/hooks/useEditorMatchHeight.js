// useEditorMatchHeight.js
//
// Mirrors the frontend jQuery matchHeight behaviour inside the block editor.
//
// On the frontend, jquery.matchHeight.js (bundled into assets/js/scripts.js)
// scans for `[data-mh]` on DOM ready and equalises the heights of every element
// sharing a group id, re-running on window load / resize. None of those events
// fire for block content in the editor, so this hook does the equivalent work
// for a single block:
//
//   - the block's edit component renders `data-mh="<group>"` on its content
//     element, the same element the PHP render callback puts it on;
//   - anything that can change the block's natural height (inner block edits,
//     images / fonts finishing loading, canvas or column width changes)
//     schedules one refresh per animation frame for that group;
//   - the refresh collects every `[data-mh="<group>"]` element in the canvas
//     document and applies matchHeight to them, exactly like the plugin's own
//     `_applyDataApi()` does on the frontend (byRow, height property). A group
//     left with a single member has its pinned height cleared by the plugin.
//
// Block editor scripts run in the top admin window while the block markup
// lives in the canvas iframe, so this uses the admin window's jQuery and
// matchHeight (enqueued by the blocks via enqueue_block_editor_assets, handle
// 'method-matchheight') and operates on the canvas elements cross-document.
// jQuery resolves offsets and computed styles against each element's own
// document, which is what makes that work. Observers are created from the
// canvas window so they watch the right document.
import { useEffect } from '@wordpress/element';

const RETRY_DELAY = 150;
const MAX_RETRIES = 20;

/**
 * The MatchHeight Group a block has opted into, or '' when the option is off
 * or has no value. Only the base breakpoint carries the group (see
 * MethodDimensionControls), matching method_get_responsive_setting( ..., 'base', 'mh' ).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Group id as entered (untrimmed, so it matches the frontend attribute), or ''.
 */
export function getMatchHeightGroup(attributes) {
	const mh = attributes?.responsiveSettings?.base?.mh;
	return typeof mh === 'string' && mh.trim() !== '' ? mh : '';
}

function getMatchHeight() {
	const $ = window.jQuery;
	return $ && typeof $.fn?.matchHeight?._apply === 'function' ? $ : null;
}

function domDepth(el) {
	let depth = 0;
	for (let node = el; node; node = node.parentElement) depth++;
	return depth;
}

/**
 * Apply matchHeight to the given groups within a document. Deepest groups go
 * first so nested groups settle before the groups that contain them.
 *
 * @param {Document}    doc      Canvas document.
 * @param {Set<string>} groupIds Groups to refresh.
 * @return {boolean} False when jQuery matchHeight isn't available yet.
 */
function applyGroups(doc, groupIds) {
	const $ = getMatchHeight();
	if (!$) return false;

	const groups = new Map();
	doc.querySelectorAll('[data-mh]').forEach((el) => {
		const id = el.getAttribute('data-mh');
		if (!id || !groupIds.has(id)) return;
		if (!groups.has(id)) groups.set(id, []);
		groups.get(id).push(el);
	});

	[...groups.values()]
		.sort(
			(a, b) =>
				Math.max(...b.map(domDepth)) - Math.max(...a.map(domDepth))
		)
		.forEach((elements) => {
			$.fn.matchHeight._apply(elements, { byRow: true });
		});

	return true;
}

/** @type {WeakMap<Document, {groups: Set<string>, retries: number}>} */
const pendingByDoc = new WeakMap();

/**
 * Queue a matchHeight refresh for one group in a canvas document. Requests
 * made within the same frame are merged into a single pass.
 *
 * @param {Document} doc     Canvas document the group lives in.
 * @param {string}   groupId MatchHeight group id.
 */
export function scheduleMatchHeightRefresh(doc, groupId) {
	if (!doc?.defaultView || !groupId) return;

	let pending = pendingByDoc.get(doc);
	if (pending) {
		pending.groups.add(groupId);
		return;
	}
	pending = { groups: new Set([groupId]), retries: 0 };
	pendingByDoc.set(doc, pending);

	const run = () => {
		// The canvas iframe was torn down (e.g. switching to the code editor).
		if (!doc.defaultView) {
			pendingByDoc.delete(doc);
			return;
		}
		if (applyGroups(doc, pending.groups)) {
			pendingByDoc.delete(doc);
		} else if (pending.retries < MAX_RETRIES) {
			// jQuery matchHeight hasn't loaded yet; try again shortly.
			pending.retries++;
			setTimeout(run, RETRY_DELAY);
		} else {
			pendingByDoc.delete(doc);
		}
	};

	window.requestAnimationFrame(run);
}

/**
 * Keep a block's content element height-matched with the other members of
 * its MatchHeight Group while editing.
 *
 * @param {Object} wrapperRef      Ref to the block wrapper (the element useBlockProps is spread on).
 * @param {string} groupId         Group id from getMatchHeightGroup(); '' disables the hook.
 * @param {string} contentSelector Selector, relative to the wrapper, for the element carrying data-mh.
 * @param {Array}  deps            Extra dependencies that remount the content element (e.g. parallax toggles).
 */
export default function useEditorMatchHeight(
	wrapperRef,
	groupId,
	contentSelector,
	deps = []
) {
	const group = typeof groupId === 'string' && groupId.trim() !== '' ? groupId : '';

	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!group || !wrapper) return undefined;

		const doc = wrapper.ownerDocument;
		const win = doc?.defaultView;
		const content = wrapper.querySelector(contentSelector);
		if (!win || !content) return undefined;

		const refresh = () => scheduleMatchHeightRefresh(doc, group);
		refresh();

		// Changes to the matched element's own box: canvas / device preview
		// width, sidebar toggles, column resizing, window resize.
		const resizeObserver = win.ResizeObserver
			? new win.ResizeObserver(refresh)
			: null;
		resizeObserver?.observe(content);

		// Edits inside the block: typing, adding / removing inner blocks, and
		// the block's own <style> tag updating. Attributes are deliberately not
		// observed because matchHeight itself writes inline styles.
		const mutationObserver = new win.MutationObserver(refresh);
		mutationObserver.observe(wrapper, {
			childList: true,
			characterData: true,
			subtree: true,
		});

		// Media inside the block finishing loading. `load` doesn't bubble, so
		// listen in the capture phase.
		wrapper.addEventListener('load', refresh, true);
		doc.fonts?.ready?.then(refresh, () => {});

		return () => {
			resizeObserver?.disconnect();
			mutationObserver.disconnect();
			wrapper.removeEventListener('load', refresh, true);
			// Drop the pinned height so the element measures naturally if it
			// re-joins a group, then let the group it is leaving re-settle.
			content.style.height = '';
			refresh();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [group, contentSelector, ...deps]);
}
