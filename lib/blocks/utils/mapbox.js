/* eslint-disable prettier/prettier */
/**
 * Mapbox Map block runtime, shared by the block's view script
 * (method-mapbox-map/src/frontend.js) and its editor preview (src/edit.js),
 * so a map looks and behaves the same on the page and in the canvas. The PHP
 * render (method-mapbox-map.php) builds the config the view script reads.
 *
 * Map config:
 *   {
 *     token:   'pk.…',                            // Mapbox access token
 *     style:   'mapbox://styles/mapbox/standard', // style URL
 *     center:  [lng, lat],
 *     zoom:    14,
 *     pin:     { lng, lat, color, scale, popup, draggable } | null,
 *     navigation: true,                           // zoom and compass buttons
 *     cooperativeGestures: true,
 *   }
 */

export const DEFAULT_STYLE_KEY = 'standard';
export const DEFAULT_STYLE = 'mapbox://styles/mapbox/standard';
export const DEFAULT_ZOOM = 14;
export const MIN_ZOOM = 0;
export const MAX_ZOOM = 22;

// A map without a pin shows the world.
export const DEFAULT_CENTER = [0, 20];
export const DEFAULT_CENTER_ZOOM = 1;

// Mapbox's default marker is 27 x 41px at scale 1; the radius of its head is
// what the popup offsets are computed from.
export const PIN_HEIGHT = 41;
export const PIN_RADIUS = 13.5;
export const DEFAULT_PIN_COLOR = '#3FB1CE';
export const MIN_PIN_SCALE = 0.5;
export const MAX_PIN_SCALE = 3;

export const GEOCODE_ENDPOINT = 'https://api.mapbox.com/search/geocode/v6/forward';

// Dispatched on a map's container once createMethodMap() has set it up, with
// the instance it returns as `detail`.
export const READY_EVENT = 'method:mapbox-map';

// Fallback matches method_mapbox_get_styles(); only used if the localized data is missing.
const DEFAULT_STYLES = {
	'standard': { label: 'Standard', url: 'mapbox://styles/mapbox/standard' },
	'standard-satellite': { label: 'Standard Satellite', url: 'mapbox://styles/mapbox/standard-satellite' },
	'streets-v12': { label: 'Streets', url: 'mapbox://styles/mapbox/streets-v12' },
	'outdoors-v12': { label: 'Outdoors', url: 'mapbox://styles/mapbox/outdoors-v12' },
	'light-v11': { label: 'Light', url: 'mapbox://styles/mapbox/light-v11' },
	'dark-v11': { label: 'Dark', url: 'mapbox://styles/mapbox/dark-v11' },
	'satellite-v9': { label: 'Satellite', url: 'mapbox://styles/mapbox/satellite-v9' },
	'satellite-streets-v12': { label: 'Satellite Streets', url: 'mapbox://styles/mapbox/satellite-streets-v12' },
	'navigation-day-v1': { label: 'Navigation Day', url: 'mapbox://styles/mapbox/navigation-day-v1' },
	'navigation-night-v1': { label: 'Navigation Night', url: 'mapbox://styles/mapbox/navigation-night-v1' },
};

export function getMapboxStyles() {
	const styles = window?.methodMapboxData?.styles;
	return styles && Object.keys(styles).length ? styles : DEFAULT_STYLES;
}

// A Mapbox Studio style URL, or an https link to a style JSON.
export function isStyleUrl(url) {
	return /^(mapbox:\/\/styles\/\S+|https:\/\/\S+)$/i.test((url || '').trim());
}

// Mirrors method_mapbox_resolve_style().
export function resolveStyle(mapStyle, customStyleUrl) {
	const styles = getMapboxStyles();
	if (mapStyle === 'custom') {
		const url = (customStyleUrl || '').trim();
		if (isStyleUrl(url)) return url;
	}
	if (styles[mapStyle]?.url) return styles[mapStyle].url;
	if (styles[DEFAULT_STYLE_KEY]?.url) return styles[DEFAULT_STYLE_KEY].url;
	const first = Object.values(styles)[0];
	return first?.url || DEFAULT_STYLE;
}

export function clampZoom(zoom) {
	const z = Number(zoom);
	if (!Number.isFinite(z)) return DEFAULT_ZOOM;
	return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
}

export function clampPinScale(scale) {
	const s = Number(scale);
	if (!Number.isFinite(s)) return 1;
	return Math.min(MAX_PIN_SCALE, Math.max(MIN_PIN_SCALE, s));
}

export function isPin(lng, lat) {
	return (
		Number.isFinite(lng) &&
		Number.isFinite(lat) &&
		Math.abs(lat) <= 90 &&
		Math.abs(lng) <= 180
	);
}

// Six decimals is about 10cm: plenty for a pin, and keeps the saved markup short.
export function roundCoordinate(value) {
	return Math.round(Number(value) * 1e6) / 1e6;
}

/**
 * Popup offsets for Mapbox's default marker at a given scale: the offsets
 * Mapbox itself computes for an unscaled marker, scaled.
 *
 * @param {number} scale
 * @return {Object} Offset per popup anchor.
 */
export function popupOffset(scale = 1) {
	const h = (PIN_HEIGHT - 5.8 / 2) * scale;
	const r = PIN_RADIUS * scale;
	const d = Math.sqrt((r * r) / 2);
	return {
		'top': [0, 0],
		'top-left': [0, 0],
		'top-right': [0, 0],
		'bottom': [0, -h],
		'bottom-left': [d, (h - r + d) * -1],
		'bottom-right': [-d, (h - r + d) * -1],
		'left': [r, (h - r) * -1],
		'right': [-r, (h - r) * -1],
	};
}

/**
 * Create a map in a container.
 *
 * @param {Object}      mapboxgl  The Mapbox GL JS namespace of the container's window.
 * @param {HTMLElement} container
 * @param {Object}      config    See the file header.
 * @param {Object}      handlers  { onPinDragEnd(lngLat) } for a draggable pin.
 * @return {Object} { mapboxgl, map, marker, navigation, setStyle, setNavigation, setPin, remove }
 */
export function createMethodMap(mapboxgl, container, config, handlers = {}) {
	const style = config.style || DEFAULT_STYLE;
	const map = new mapboxgl.Map({
		container,
		accessToken: config.token,
		style,
		center: Array.isArray(config.center) ? config.center : DEFAULT_CENTER,
		zoom: Number.isFinite(config.zoom) ? config.zoom : DEFAULT_ZOOM,
		cooperativeGestures: config.cooperativeGestures !== false,
	});

	const instance = {
		mapboxgl,
		map,
		marker: null,
		navigation: null,
		style,

		setStyle(url) {
			if (url && url !== instance.style) {
				instance.style = url;
				map.setStyle(url);
			}
		},

		setNavigation(show) {
			if (show && !instance.navigation) {
				instance.navigation = new mapboxgl.NavigationControl();
				map.addControl(instance.navigation, 'top-left');
			} else if (!show && instance.navigation) {
				map.removeControl(instance.navigation);
				instance.navigation = null;
			}
		},

		setPin(pin) {
			if (instance.marker) {
				instance.marker.remove();
				instance.marker = null;
			}
			if (!pin || !isPin(pin.lng, pin.lat)) return;

			const scale = clampPinScale(pin.scale);
			const marker = new mapboxgl.Marker({
				color: pin.color || DEFAULT_PIN_COLOR,
				scale,
				draggable: !!pin.draggable,
			}).setLngLat([pin.lng, pin.lat]);

			if (pin.popup) {
				marker.setPopup(
					new mapboxgl.Popup({ offset: popupOffset(scale) }).setText(pin.popup)
				);
			}
			if (pin.draggable && typeof handlers.onPinDragEnd === 'function') {
				marker.on('dragend', () => handlers.onPinDragEnd(marker.getLngLat()));
			}

			marker.addTo(map);
			instance.marker = marker;
		},

		remove() {
			instance.setPin(null);
			map.remove();
		},
	};

	instance.setNavigation(config.navigation !== false);
	instance.setPin(config.pin || null);

	// For scripts that want the map (bubbles, so it can be caught on the document).
	container.dispatchEvent(new CustomEvent(READY_EVENT, { bubbles: true, detail: instance }));
	return instance;
}

/* ---------------------------------------------------------------------
 * Editor: Mapbox GL JS on demand
 *
 * The editor canvas is an iframe, and a map has to be created by the GL
 * instance of the window its container lives in. The library is added to
 * that document the first time a map block needs it, so nothing loads on
 * editor screens without a map.
 * ------------------------------------------------------------------ */

const loading = new WeakMap();

function ensureStylesheet(doc, href) {
	if (!doc || !href) return;
	// `mapbox-gl-css` is the id WordPress gives the enqueued stylesheet.
	if (doc.getElementById('mapbox-gl-css') || doc.querySelector('link[data-method-mapbox-gl]')) return;
	const link = doc.createElement('link');
	link.rel = 'stylesheet';
	link.href = href;
	link.setAttribute('data-method-mapbox-gl', '');
	doc.head.appendChild(link);
}

/**
 * @param {Window} win  Window to load the library into.
 * @param {Object} urls { js, css } from methodMapboxData.gl.
 * @return {Promise<Object>} Resolves with that window's mapboxgl.
 */
export function loadMapboxGl(win, urls = {}) {
	if (!win) {
		return Promise.reject(new Error('No window to load Mapbox GL JS into.'));
	}
	if (win.mapboxgl) {
		ensureStylesheet(win.document, urls.css);
		return Promise.resolve(win.mapboxgl);
	}
	if (loading.has(win)) {
		return loading.get(win);
	}

	const doc = win.document;
	ensureStylesheet(doc, urls.css);

	const promise = new Promise((resolve, reject) => {
		// `mapbox-gl-js` is the id WordPress gives the enqueued script.
		let script = doc.getElementById('mapbox-gl-js') || doc.querySelector('script[data-method-mapbox-gl]');
		if (!script) {
			if (!urls.js) {
				reject(new Error('The Mapbox GL JS URL is unknown.'));
				return;
			}
			script = doc.createElement('script');
			script.src = urls.js;
			script.async = true;
			script.setAttribute('data-method-mapbox-gl', '');
			doc.head.appendChild(script);
		}
		script.addEventListener(
			'load',
			() => (win.mapboxgl ? resolve(win.mapboxgl) : reject(new Error('Mapbox GL JS did not initialize.'))),
			{ once: true }
		);
		script.addEventListener('error', () => reject(new Error('Mapbox GL JS could not be loaded.')), { once: true });
	});

	loading.set(win, promise);
	// A failed load may be retried.
	promise.catch(() => loading.delete(win));
	return promise;
}

/* ---------------------------------------------------------------------
 * Editor: geocoding (Mapbox Geocoding API v6)
 * ------------------------------------------------------------------ */

/**
 * @param {string} query
 * @param {string} token
 * @param {number} limit
 * @return {Promise<Array<{lng: number, lat: number, label: string}>>} Best
 *   matches first. Rejects with an Error whose `code` is 'network', 'token'
 *   or 'http' (with `status`).
 */
export async function geocodeAddress(query, token, limit = 5) {
	const url = new URL(GEOCODE_ENDPOINT);
	url.searchParams.set('q', query);
	url.searchParams.set('limit', String(limit));
	url.searchParams.set('access_token', token);

	let response;
	try {
		response = await fetch(url.toString());
	} catch (e) {
		const error = new Error('The geocoding request failed.');
		error.code = 'network';
		throw error;
	}
	if (!response.ok) {
		const error = new Error(`Mapbox returned ${response.status}.`);
		error.code = response.status === 401 || response.status === 403 ? 'token' : 'http';
		error.status = response.status;
		throw error;
	}

	const data = await response.json();
	return (data.features || [])
		.map((feature) => {
			const coords = feature?.geometry?.coordinates || [];
			const props = feature?.properties || {};
			return {
				lng: Number(coords[0]),
				lat: Number(coords[1]),
				label: props.full_address || props.place_formatted || props.name || '',
			};
		})
		.filter((result) => isPin(result.lng, result.lat));
}
