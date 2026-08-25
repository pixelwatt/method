/**
 * Method Looping Alert — Frontend
 *
 * The PHP render outputs a single "text + separator" unit inside one group.
 * This script:
 *   1. Measures that unit and the visible container.
 *   2. Clones the unit enough times to fill the container (plus one).
 *   3. Duplicates the whole group (aria-hidden) so the CSS animation
 *      (translateX(-50%)) loops seamlessly.
 *   4. Sets --method-alert-duration from the `speed` attribute so the
 *      scroll speed is a consistent px/s regardless of text length.
 *
 * Re-runs on container resize and once web fonts finish loading.
 */
import { getDurationSeconds, getRepeatCount } from './marquee';

( function () {
	'use strict';

	function init( alert ) {
		const inner = alert.querySelector( '.method-looping-alert-inner' );
		const track = alert.querySelector( '.method-looping-alert-track' );
		const group = track && track.querySelector( '.method-looping-alert-group' );
		const unit = group && group.querySelector( '.method-looping-alert-unit' );

		if ( ! inner || ! track || ! group || ! unit ) {
			return;
		}

		const speed = alert.dataset.speed;
		const unitTemplate = unit.cloneNode( true );
		let clone = null;
		let lastKey = '';

		function layout() {
			// Measure against a single unit so results are independent of
			// whatever repeat count was rendered previously.
			group.replaceChildren( unitTemplate.cloneNode( true ) );

			const unitWidth = group.firstElementChild.getBoundingClientRect().width;
			const containerWidth = inner.clientWidth;
			const repeat = getRepeatCount( unitWidth, containerWidth );

			for ( let i = 1; i < repeat; i++ ) {
				group.appendChild( unitTemplate.cloneNode( true ) );
			}

			const groupWidth = group.getBoundingClientRect().width;

			if ( clone ) {
				clone.remove();
			}
			clone = group.cloneNode( true );
			clone.setAttribute( 'aria-hidden', 'true' );
			track.appendChild( clone );

			const duration = getDurationSeconds( groupWidth, speed );
			track.style.setProperty( '--method-alert-duration', `${ duration }s` );
			track.classList.toggle( 'is-paused', duration <= 0 );
			track.classList.add( 'is-ready' );

			lastKey = `${ containerWidth }|${ unitWidth }`;
		}

		function maybeLayout() {
			// Cheap pre-check so we don't rebuild the DOM when nothing that
			// affects the layout has actually changed.
			const probe = unitTemplate.cloneNode( true );
			group.appendChild( probe );
			const unitWidth = probe.getBoundingClientRect().width;
			probe.remove();
			const key = `${ inner.clientWidth }|${ unitWidth }`;
			if ( key !== lastKey ) {
				layout();
			}
		}

		layout();

		if ( 'ResizeObserver' in window ) {
			new ResizeObserver( maybeLayout ).observe( inner );
		} else {
			window.addEventListener( 'resize', maybeLayout );
		}

		if ( document.fonts && document.fonts.ready ) {
			document.fonts.ready.then( maybeLayout );
		}
	}

	function boot() {
		document.querySelectorAll( '.method-looping-alert' ).forEach( init );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}
} )();
