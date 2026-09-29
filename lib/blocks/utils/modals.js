/**
 * Method modals.
 *
 * Opens the modals printed by the modal registry (lib/class-method-modals.php)
 * from any link on the page that points at `#<modal id>`: a button block, a
 * link in a paragraph, a navigation item. Nothing has to be added to the link
 * itself.
 *
 * The Modal block's view script imports and calls `initMethodModals()`; the
 * first call installs the behaviour and later calls are no-ops. The modals
 * themselves are Bootstrap modals (`window.bootstrap.Modal`, from the theme's
 * script bundle). Without it, or without this script, the links are left
 * alone and behave as ordinary anchors.
 *
 * Only `.method-modal` elements are ever opened, so a heading anchor or
 * another plugin's modal that happens to share an id is not affected.
 */

const MODAL_SELECTOR = '.method-modal';
const TRIGGER_ATTRIBUTE = 'data-method-modal-trigger';
const ACTIVE_CLASS = 'method-modal-active';

// Embeds that keep playing after their modal has closed.
const MEDIA_EMBED_PATTERN =
	/(youtube(-nocookie)?\.com|youtu\.be|vimeo\.com|wistia\.(com|net)|dailymotion\.com|soundcloud\.com|spotify\.com)/i;

export function initMethodModals() {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return undefined;
	}
	if (window.methodModals) {
		return window.methodModals;
	}

	// Modal element => element that gets focus back when the modal closes.
	const origins = new WeakMap();
	// The modal opened from the URL hash, whose hash is cleared on close.
	let hashModal = null;
	// Set while one modal is being swapped for another: { from, to, trigger, retry }.
	let pending = null;

	function getBootstrapModal() {
		return window.bootstrap && window.bootstrap.Modal;
	}

	function getModalById(id) {
		if (!id) {
			return null;
		}
		if (window.CSS && typeof window.CSS.escape === 'function') {
			return document.querySelector(
				MODAL_SELECTOR + '#' + window.CSS.escape(id)
			);
		}
		const element = document.getElementById(id);
		return element && element.matches(MODAL_SELECTOR) ? element : null;
	}

	function decodeHash(hash) {
		const id = hash.replace(/^#/, '');
		try {
			return decodeURIComponent(id);
		} catch (error) {
			return id;
		}
	}

	function stripTrailingSlash(path) {
		return path.replace(/\/+$/, '');
	}

	/**
	 * The modal a link points at, if it points at one on this page. `#id` and
	 * `/this-page/#id` both count; a link to another page does not.
	 *
	 * @param {Element} link
	 * @return {Element|null} Modal element.
	 */
	function getModalForLink(link) {
		const href = link.getAttribute('href');
		if (!href || href.indexOf('#') === -1) {
			return null;
		}
		if (href.charAt(0) === '#') {
			return getModalById(decodeHash(href));
		}

		let url;
		try {
			url = new URL(href, document.baseURI);
		} catch (error) {
			return null;
		}

		// Host rather than origin: a site can be stored as http:// and served
		// over https://, and links in content carry the stored scheme.
		if (
			url.hash.length < 2 ||
			url.host !== window.location.host ||
			stripTrailingSlash(url.pathname) !==
				stripTrailingSlash(window.location.pathname) ||
			(url.search !== '' && url.search !== window.location.search)
		) {
			return null;
		}

		return getModalById(decodeHash(url.hash));
	}

	function show(modal, trigger) {
		getBootstrapModal().getOrCreateInstance(modal).show(trigger || undefined);
	}

	/**
	 * @param {Element}      modal
	 * @param {Element|null} trigger Element that asked for the modal, if any.
	 * @return {boolean} Whether the modal is open or opening.
	 */
	function open(modal, trigger) {
		const Modal = getBootstrapModal();
		if (!modal || !Modal) {
			return false;
		}
		if (modal.classList.contains('show')) {
			return true;
		}

		const current = document.querySelector('.modal.show');

		if (!current) {
			if (trigger) {
				origins.set(modal, trigger);
			}
			show(modal, trigger);
			return true;
		}

		// A link inside one modal opens another. Bootstrap shows one modal at
		// a time, and showing the next before the first has finished closing
		// lets the first one's cleanup unlock page scroll under the second,
		// so the next one is shown from the first one's `hidden` event.
		const instance = Modal.getOrCreateInstance(current);
		// hide() is ignored while the modal is still animating in.
		const retry = function () {
			instance.hide();
		};
		if (pending) {
			pending.from.removeEventListener('shown.bs.modal', pending.retry);
		}
		pending = { from: current, to: modal, trigger, retry };
		current.addEventListener('shown.bs.modal', retry, { once: true });
		instance.hide();

		return true;
	}

	/**
	 * Marks the links that open a modal, for assistive technology and for
	 * theme styles. Safe to call again after content has been added.
	 *
	 * @param {ParentNode} [root]
	 */
	function decorate(root) {
		(root || document).querySelectorAll('a[href*="#"]').forEach(function (link) {
			if (link.hasAttribute(TRIGGER_ATTRIBUTE)) {
				return;
			}
			const modal = getModalForLink(link);
			if (!modal) {
				return;
			}
			link.setAttribute(TRIGGER_ATTRIBUTE, '');
			link.setAttribute('aria-haspopup', 'dialog');
			link.setAttribute('aria-controls', modal.id);
			if (!link.hasAttribute('role')) {
				link.setAttribute('role', 'button');
			}
		});
	}

	function openFromHash() {
		if (window.location.hash.length < 2) {
			return;
		}
		const modal = getModalById(decodeHash(window.location.hash));
		if (modal && open(modal, null)) {
			hashModal = modal;
		}
	}

	function stopMedia(modal) {
		modal.querySelectorAll('video, audio').forEach(function (media) {
			if (typeof media.pause === 'function') {
				media.pause();
			}
		});
		modal.querySelectorAll('iframe[src]').forEach(function (frame) {
			const src = frame.getAttribute('src');
			if (MEDIA_EMBED_PATTERN.test(src)) {
				// Reloading the embed is the only way to stop it without
				// each provider's player API.
				frame.setAttribute('src', src);
			}
		});
	}

	document.addEventListener('click', function (event) {
		// Swiper cancels clicks that end a drag, and another handler may
		// already have claimed the link.
		if (event.defaultPrevented) {
			return;
		}

		// Modifier / middle clicks keep their native behaviour (a new tab,
		// where the hash opens the modal on load).
		if (
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		) {
			return;
		}

		if (!(event.target instanceof Element)) {
			return;
		}

		const link = event.target.closest('a[href], area[href]');

		// Links with Bootstrap's own data API are Bootstrap's to handle.
		if (
			!link ||
			link.hasAttribute('download') ||
			link.hasAttribute('data-bs-toggle')
		) {
			return;
		}

		if (open(getModalForLink(link), link)) {
			event.preventDefault();
		}
	});

	// A link with role="button" is expected to respond to Space as well.
	document.addEventListener('keydown', function (event) {
		if (event.key !== ' ' || event.defaultPrevented) {
			return;
		}
		if (
			event.target instanceof Element &&
			event.target.matches('a[' + TRIGGER_ATTRIBUTE + '][role="button"]')
		) {
			event.preventDefault();
			event.target.click();
		}
	});

	// Bootstrap's modal events bubble. `show` is dispatched before the
	// backdrop is created, so the backdrop is styled from its first frame.
	document.addEventListener('show.bs.modal', function (event) {
		if (event.target.matches(MODAL_SELECTOR)) {
			document.documentElement.classList.add(ACTIVE_CLASS);
		}
	});

	document.addEventListener('shown.bs.modal', function (event) {
		const modal = event.target;
		if (!modal.matches(MODAL_SELECTOR)) {
			return;
		}
		// Anything that measured itself while the modal was display:none.
		modal.querySelectorAll('.swiper').forEach(function (element) {
			if (element.swiper && typeof element.swiper.update === 'function') {
				element.swiper.update();
			}
		});
		window.dispatchEvent(new Event('resize'));
	});

	document.addEventListener('hidden.bs.modal', function (event) {
		const modal = event.target;
		const origin = origins.get(modal);
		origins.delete(modal);

		if (modal.matches(MODAL_SELECTOR)) {
			document.documentElement.classList.remove(ACTIVE_CLASS);
			stopMedia(modal);

			if (hashModal === modal) {
				hashModal = null;
				// Otherwise a reload, or a shared link, reopens the modal.
				if (decodeHash(window.location.hash) === modal.id) {
					window.history.replaceState(
						window.history.state,
						'',
						window.location.pathname + window.location.search
					);
					if (window.methodSwiperRuntime) {
						window.methodSwiperRuntime.update();
					}
				}
			}
		}

		if (pending && pending.from === modal) {
			const next = pending;
			pending = null;
			modal.removeEventListener('shown.bs.modal', next.retry);
			// The link that asked for the next modal is hidden by now, so
			// focus eventually returns to whatever opened the first one.
			if (origin) {
				origins.set(next.to, origin);
			}
			show(next.to, next.trigger);
			return;
		}

		// Bootstrap only returns focus for its own data-API triggers.
		if (
			modal.matches(MODAL_SELECTOR) &&
			origin &&
			origin.isConnected &&
			typeof origin.focus === 'function'
		) {
			origin.focus({ preventScroll: true });
		}
	});

	window.addEventListener('hashchange', openFromHash);

	function ready() {
		decorate();
		openFromHash();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', ready);
	} else {
		ready();
	}

	window.methodModals = {
		/**
		 * @param {string|Element} modal     Modal id or element.
		 * @param {Element}        [trigger] Element to return focus to.
		 * @return {boolean} Whether the modal is open or opening.
		 */
		open(modal, trigger) {
			return open(
				typeof modal === 'string' ? getModalById(modal) : modal,
				trigger || null
			);
		},
		decorate,
	};

	return window.methodModals;
}
