/**
 * Method Mapbox Map — Frontend
 *
 * Creates a map in every `.method-mapbox-map[data-map]` printed by
 * method-mapbox-map.php, using the shared runtime in
 * lib/blocks/utils/mapbox.js (the editor preview uses the same module).
 * Mapbox GL JS is a dependency of this script, so `mapboxgl` is normally
 * defined already; its script tag is waited for otherwise.
 *
 * A map only initializes once it comes near the viewport: every map created
 * counts as a map load with Mapbox, so one far below the fold that nobody
 * scrolls to is never created.
 *
 * Once a map is created, a `method:mapbox-map` event is dispatched on its
 * container (bubbling) with the runtime instance ({ map, marker, mapboxgl, … })
 * as `detail`, for scripts that want to add to the map.
 */
import { createMethodMap } from '../../utils/mapbox';

const SELECTOR = '.method-mapbox-map[data-map]:not([data-map-ready])';

function initMap(el) {
	if (el.hasAttribute('data-map-ready')) return;
	let config;
	try {
		config = JSON.parse(el.getAttribute('data-map'));
	} catch (e) {
		return;
	}
	el.setAttribute('data-map-ready', '');
	const container = el.querySelector('.method-mapbox-map-canvas') || el;
	createMethodMap(window.mapboxgl, container, config);
}

function initMaps() {
	if (typeof window.mapboxgl === 'undefined') return false;

	const maps = document.querySelectorAll(SELECTOR);
	if (!maps.length) return true;

	if (!('IntersectionObserver' in window)) {
		maps.forEach(initMap);
		return true;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				observer.unobserve(entry.target);
				initMap(entry.target);
			});
		},
		{ rootMargin: '200px 0px' }
	);
	maps.forEach((el) => observer.observe(el));
	return true;
}

function boot() {
	if (initMaps()) return;
	// `mapbox-gl-js` is the id WordPress gives the enqueued library.
	const tag = document.getElementById('mapbox-gl-js');
	if (tag) {
		tag.addEventListener('load', initMaps, { once: true });
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', boot);
} else {
	boot();
}
