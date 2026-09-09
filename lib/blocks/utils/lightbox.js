/**
 * Method image lightbox.
 *
 * Shared by the Fitted Image block (single image) and the Swiper Gallery
 * block (every slide image). Each block's view script imports and calls
 * `initMethodLightbox()`; the first call installs the behaviour and later
 * calls are no-ops, so any combination of blocks on a page shares one dialog.
 *
 * The PHP render marks a trigger with `data-method-lightbox` on an <a> that
 * points at the full-size, uncropped image (see method_get_lightbox_attributes()
 * in lib/blocks.php), so without this script (or without <dialog>) the
 * trigger is simply a link to the image. This script intercepts those clicks
 * and shows the image in a single shared native <dialog> opened with
 * showModal(), which provides focus trapping, Escape-to-close, inert page
 * content and focus restoration.
 */

const TRIGGER_SELECTOR = '[data-method-lightbox]';

export function initMethodLightbox() {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return;
	}
	if (window.methodLightboxLoaded) {
		return;
	}
	if (typeof HTMLDialogElement === 'undefined') {
		// No <dialog> support: leave the links alone so they open the image.
		return;
	}
	window.methodLightboxLoaded = true;

	let dialog = null;
	let closeButton = null;
	let image = null;
	let activeTrigger = null;

	function build() {
		dialog = document.createElement('dialog');
		dialog.className = 'method-lightbox';
		dialog.setAttribute('aria-label', 'Image viewer');

		closeButton = document.createElement('button');
		closeButton.type = 'button';
		closeButton.className = 'method-lightbox-close';
		closeButton.setAttribute('aria-label', 'Close image viewer');
		closeButton.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">' +
			'<path d="M6 6l12 12M18 6L6 18"/>' +
			'</svg>';

		const figure = document.createElement('figure');
		figure.className = 'method-lightbox-figure';

		image = document.createElement('img');
		image.className = 'method-lightbox-img';
		image.decoding = 'async';

		figure.appendChild(image);
		dialog.appendChild(closeButton);
		dialog.appendChild(figure);
		document.body.appendChild(dialog);

		image.addEventListener('load', onImageSettled);
		image.addEventListener('error', onImageSettled);
		closeButton.addEventListener('click', close);
		// Anything that isn't the image itself (the dark surround, the empty
		// figure area) acts as a backdrop click.
		dialog.addEventListener('click', function (event) {
			if (event.target !== image) {
				close();
			}
		});
		// Covers closes we didn't initiate, e.g. Escape (the `cancel` path).
		dialog.addEventListener('close', onClosed);
	}

	function onImageSettled() {
		if (dialog) {
			dialog.classList.remove('is-loading');
		}
	}

	function open(trigger) {
		const src =
			trigger.getAttribute('data-method-lightbox-src') ||
			trigger.getAttribute('href');

		if (!src) {
			return false;
		}

		if (!dialog) {
			build();
		}

		if (dialog.open) {
			return false;
		}

		activeTrigger = trigger;

		const width = trigger.getAttribute('data-method-lightbox-width');
		const height = trigger.getAttribute('data-method-lightbox-height');
		const srcset = trigger.getAttribute('data-method-lightbox-srcset');

		dialog.classList.add('is-loading');

		image.alt = trigger.getAttribute('data-method-lightbox-alt') || '';

		if (width && height) {
			image.setAttribute('width', width);
			image.setAttribute('height', height);
		} else {
			image.removeAttribute('width');
			image.removeAttribute('height');
		}

		// `sizes` must be in place before `srcset` so the browser picks a
		// candidate for the full viewport rather than the default 100vw guess
		// made against a not-yet-laid-out image.
		if (srcset) {
			image.setAttribute('sizes', '100vw');
			image.setAttribute('srcset', srcset);
		} else {
			image.removeAttribute('sizes');
			image.removeAttribute('srcset');
		}

		image.src = src;

		// An image the browser already holds (the block's own <img> may use the
		// same file) is available synchronously; don't flash the spinner for it.
		if (image.complete && image.naturalWidth > 0) {
			dialog.classList.remove('is-loading');
		}

		document.documentElement.classList.add('method-lightbox-open');
		dialog.showModal();
		closeButton.focus({ preventScroll: true });

		return true;
	}

	/**
	 * Reset page + dialog state after the dialog has closed. Idempotent, so it
	 * is safe to run both from close() and from the (async) `close` event.
	 */
	function teardown() {
		document.documentElement.classList.remove('method-lightbox-open');
		dialog.classList.remove('is-loading');

		// Drop the source so the previous image never flashes on the next open
		// and so re-opening the same image always fires a fresh load event.
		image.removeAttribute('srcset');
		image.removeAttribute('sizes');
		image.removeAttribute('src');

		const trigger = activeTrigger;
		activeTrigger = null;
		if (trigger && typeof trigger.focus === 'function') {
			trigger.focus({ preventScroll: true });
		}
	}

	function close() {
		if (dialog && dialog.open) {
			dialog.close();
			// The dialog's `close` event is dispatched asynchronously; don't
			// leave the page scroll-locked until it arrives.
			teardown();
		}
	}

	function onClosed() {
		// If the lightbox was re-opened before this async event arrived, open()
		// has already set everything up for the new image — leave it alone.
		if (dialog.open) {
			return;
		}
		teardown();
	}

	document.addEventListener('click', function (event) {
		// Swiper cancels clicks that end a drag (preventClicks), so a swipe
		// across a gallery image never opens the lightbox.
		if (event.defaultPrevented) {
			return;
		}

		// Modifier / middle clicks keep their native behaviour (open the
		// full image in a new tab/window).
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

		const trigger = event.target.closest(TRIGGER_SELECTOR);

		if (!trigger) {
			return;
		}

		if (open(trigger)) {
			event.preventDefault();
		}
	});
}
