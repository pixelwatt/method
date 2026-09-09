/**
 * Shared Swiper runtime for the Swiper (method/swiper) and Swiper Gallery
 * (method/swiper-gallery) blocks.
 *
 * Two layers live here:
 *
 * 1. Pure helpers (`getVisibleSlideRange`, `getCenterSlideIndexes`,
 *    `attachCenterSlideTracking`) that work against any Swiper instance. They
 *    are used by the frontend runtime below AND by the Swiper Gallery editor
 *    preview, so the editor and the frontend agree on which slides count as
 *    visible / centered.
 *
 * 2. The frontend runtime (`initSwiperRuntime`), bundled into each block's
 *    view script. It keeps a page-wide registry of Swiper instances so that
 *    links pointing at a hash of a currently-visible slide get the
 *    `method-hash-active` class, and it wires up center-slide tracking for
 *    swipers that ask for it.
 *
 * Blocks register their instances from their inline init script with:
 *
 *     (window.methodSwiperQueue = window.methodSwiperQueue || []).push({
 *         id: 'method…', swiper: swiperInstance, centerClass: '…' // optional
 *     });
 *
 * The queue is a plain array until the runtime loads, at which point it is
 * drained and replaced with an object whose `push` registers immediately, so
 * the registration works no matter which script happens to run first.
 */

export const CENTER_CLASS = 'method-swiper-gallery-center';
export const HASH_ACTIVE_CLASS = 'method-hash-active';

/**
 * Number of slides Swiper is currently showing at once, taking the active
 * breakpoint into account (Swiper copies the matching breakpoint's params
 * into `swiper.params` whenever a breakpoint changes).
 *
 * @param {Object} swiper Swiper instance.
 * @return {number} Visible slide count, capped at the total number of slides.
 */
export function getVisibleSlideCount(swiper) {
	const total = swiper?.slides?.length || 0;
	if (!total) return 0;

	let perView = swiper.params?.slidesPerView;
	if (perView === 'auto' || !Number.isFinite(perView)) {
		perView =
			typeof swiper.slidesPerViewDynamic === 'function'
				? swiper.slidesPerViewDynamic()
				: 1;
	}
	perView = Math.max(1, Math.round(perView));

	return Math.min(perView, total);
}

/**
 * Inclusive index range of the slides visible for the current active index.
 * Based on `activeIndex` (the slide Swiper is moving TO) rather than on
 * Swiper's progress-based visibility, so it is already correct when the
 * `slideChange` event fires at the start of a transition.
 *
 * @param {Object} swiper Swiper instance.
 * @return {{start: number, end: number, count: number}}
 */
export function getVisibleSlideRange(swiper) {
	const total = swiper?.slides?.length || 0;
	const count = getVisibleSlideCount(swiper);
	if (!count) return { start: 0, end: -1, count: 0 };

	// Swiper never lets the track end short, so the last active index is
	// total - count; clamp defensively in case of rounding.
	const maxStart = Math.max(0, total - count);
	const start = Math.min(Math.max(0, swiper.activeIndex || 0), maxStart);

	return { start, end: start + count - 1, count };
}

/**
 * Which of the visible slides count as "center". Nothing when two or fewer
 * are visible; the single middle slide for an odd count; the two middle
 * slides for an even count.
 *
 * @param {number} start First visible slide index.
 * @param {number} count Number of visible slides.
 * @return {number[]} Slide indexes that should carry the center class.
 */
export function getCenterSlideIndexes(start, count) {
	if (count <= 2) return [];
	const mid = start + Math.floor(count / 2);
	return count % 2 ? [mid] : [mid - 1, mid];
}

/**
 * Keep `className` on the center slide(s) of a swiper, re-evaluating at the
 * start of every slide move and whenever the layout / breakpoint changes.
 *
 * @param {Object} swiper    Swiper instance (already initialised).
 * @param {string} className Class to apply; defaults to CENTER_CLASS.
 * @return {Function} Cleanup that detaches the listeners and removes the class.
 */
export function attachCenterSlideTracking(swiper, className = CENTER_CLASS) {
	if (!swiper || typeof swiper.on !== 'function') return () => {};

	const apply = () => {
		const slides = swiper.slides || [];
		const { start, count } = getVisibleSlideRange(swiper);
		const centers = getCenterSlideIndexes(start, count);
		slides.forEach((slide, index) => {
			slide.classList.toggle(className, centers.includes(index));
		});
	};

	// `slideChange` fires as soon as the active index changes — i.e. at the
	// beginning of the move, before the transition plays out.
	const events = [
		'slideChange',
		'breakpoint',
		'resize',
		'update',
		'slidesLengthChange',
	];
	events.forEach((event) => swiper.on(event, apply));
	apply();

	return () => {
		events.forEach((event) => swiper.off(event, apply));
		(swiper.slides || []).forEach((slide) =>
			slide.classList.remove(className)
		);
	};
}

/**
 * Hashes (without the leading #) of every slide currently visible in any
 * registered swiper.
 *
 * @param {Object<string, Object>} registry id => Swiper instance.
 * @return {Set<string>}
 */
export function collectVisibleSlideHashes(registry) {
	const hashes = new Set();
	Object.keys(registry || {}).forEach((id) => {
		const swiper = registry[id];
		if (!swiper || swiper.destroyed || !swiper.slides) return;
		const { start, end } = getVisibleSlideRange(swiper);
		for (let i = start; i <= end; i += 1) {
			const hash = swiper.slides[i]?.getAttribute?.('data-hash');
			if (hash) hashes.add(hash);
		}
	});
	return hashes;
}

/**
 * Frontend runtime. Idempotent: the first view script to run installs it and
 * later ones reuse it.
 *
 * @return {Object|undefined} The runtime API (`register`, `update`, `swipers`).
 */
export function initSwiperRuntime() {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return undefined;
	}
	if (window.methodSwiperRuntime) return window.methodSwiperRuntime;

	// Kept under the same global as the original inline implementation.
	const registry = (window.methodSwipers = window.methodSwipers || {});
	const centerCleanups = {};

	function updateHashActiveLinks() {
		let active = collectVisibleSlideHashes(registry);
		if (!active.size) {
			// No swiper is contributing a hash: fall back to the URL hash so
			// ordinary in-page anchors still get an active state.
			active = new Set([window.location.hash.slice(1)]);
		}

		document.querySelectorAll('a[href^="#"]').forEach((link) => {
			const hash = link.getAttribute('href').slice(1);
			link.classList.toggle(
				HASH_ACTIVE_CLASS,
				hash !== '' && active.has(hash)
			);
		});
	}

	function register(entry) {
		if (!entry) return;
		const { id, swiper, centerClass } = entry;
		if (!id || !swiper || typeof swiper.on !== 'function') return;

		// Re-registering an id (e.g. a swiper re-initialised in place)
		// replaces the previous instance.
		if (centerCleanups[id]) {
			centerCleanups[id]();
			delete centerCleanups[id];
		}
		registry[id] = swiper;

		swiper.on('slideChange', updateHashActiveLinks);
		swiper.on('breakpoint', updateHashActiveLinks);
		swiper.on('destroy', () => {
			if (registry[id] === swiper) delete registry[id];
			if (centerCleanups[id]) {
				centerCleanups[id]();
				delete centerCleanups[id];
			}
		});

		if (centerClass) {
			centerCleanups[id] = attachCenterSlideTracking(swiper, centerClass);
		}

		updateHashActiveLinks();
	}

	// Drain anything queued before this script ran, then take over the queue
	// so later pushes register immediately.
	const queued = Array.isArray(window.methodSwiperQueue)
		? window.methodSwiperQueue.slice()
		: [];
	window.methodSwiperQueue = { push: register };
	queued.forEach(register);

	window.addEventListener('hashchange', updateHashActiveLinks);
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', updateHashActiveLinks);
	} else {
		updateHashActiveLinks();
	}

	window.methodSwiperRuntime = {
		register,
		update: updateHashActiveLinks,
		swipers: registry,
	};

	return window.methodSwiperRuntime;
}
