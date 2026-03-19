/**
 * Method Scrollspy — Frontend
 *
 * Hydrates each .method-scrollspy nav on page load:
 *   1. Discovers headings in the target container.
 *   2. Injects anchor IDs where missing.
 *   3. Builds a nested <ol> table of contents.
 *   4. Uses IntersectionObserver to highlight the active heading.
 *   5. CSS `position: sticky` handles the fixed-while-scrolling behavior
 *      (no JS positioning needed).
 */

( function () {
	'use strict';

	/**
	 * Generate a URL-safe slug from a string, deduplicating against a Set.
	 *
	 * @param {string} text
	 * @param {Set}    usedIds
	 * @return {string}
	 */
	function generateId( text, usedIds ) {
		let base = text
			.toLowerCase()
			.replace( /[^a-z0-9]+/g, '-' )
			.replace( /(^-|-$)/g, '' );

		// Fallback for empty strings (emoji-only headings, etc.)
		if ( ! base ) {
			base = 'section';
		}

		let id = base;
		let counter = 1;

		while ( usedIds.has( id ) ) {
			id = `${ base }-${ counter++ }`;
		}

		usedIds.add( id );
		return id;
	}

	/**
	 * Build a single list item for a heading.
	 *
	 * @param {HTMLElement} heading
	 * @param {string}      levelClass  BEM modifier class.
	 * @return {HTMLLIElement}
	 */
	function createTocItem( heading, levelClass ) {
		const li = document.createElement( 'li' );
		li.className = `method-scrollspy__item${ levelClass }`;

		const a = document.createElement( 'a' );
		a.href = `#${ heading.id }`;
		a.textContent = heading.textContent;
		a.className = 'method-scrollspy__link';

		li.appendChild( a );
		return li;
	}

	/**
	 * Initialise a single scrollspy instance.
	 *
	 * @param {HTMLElement} nav  The <nav class="method-scrollspy"> element.
	 */
	function init( nav ) {
		const targetSelector = nav.dataset.target;
		const levels         = ( nav.dataset.levels || 'h2,h3' ).split( ',' );
		const stickyOffset   = parseInt( nav.dataset.stickyOffset, 10 ) || 0;
		const stickyAt       = nav.dataset.stickyAt || '';

		// ── Sticky breakpoint toggle ─────────────────────────────
		// Toggle an `is-sticky` class based on the minimum viewport
		// width. CSS should gate `position: sticky` on this class.
		if ( stickyAt ) {
			const mql = window.matchMedia( `(min-width: ${ stickyAt })` );
			nav.classList.toggle( 'is-sticky', mql.matches );
			mql.addEventListener( 'change', ( e ) => {
				nav.classList.toggle( 'is-sticky', e.matches );
			} );
		} else {
			nav.classList.add( 'is-sticky' );
		}

		const target = document.querySelector( targetSelector );

		if ( ! target ) {
			// Silently bail — the target container might not exist on this page.
			return;
		}

		const selector = levels.join( ', ' );
		const headings = target.querySelectorAll( selector );

		if ( ! headings.length ) {
			nav.hidden = true;
			return;
		}

		// Apply sticky offset as a CSS custom property so the stylesheet can use it.
		if ( stickyOffset ) {
			nav.style.setProperty( '--scrollspy-offset', `${ stickyOffset }px` );
		}

		const list    = nav.querySelector( '.method-scrollspy__list' );
		const usedIds = new Set();

		// Determine the "base" level (highest rank) to compute depth.
		const baseLevelNum = Math.min(
			...levels.map( ( l ) => parseInt( l.replace( 'h', '' ), 10 ) )
		);

		// ── Build TOC & inject anchors ──────────────────────────────────
		const headingElements = [];

		headings.forEach( ( heading ) => {
			// Inject an ID if one doesn't already exist.
			if ( ! heading.id ) {
				heading.id = generateId( heading.textContent, usedIds );
			} else {
				usedIds.add( heading.id );
			}

			const levelNum = parseInt( heading.tagName.replace( 'H', '' ), 10 );
			const depth    = levelNum - baseLevelNum; // 0 = top, 1 = sub, 2 = deep

			let modifier = '';
			if ( depth === 1 ) modifier = ' method-scrollspy__item--sub';
			if ( depth >= 2 ) modifier = ' method-scrollspy__item--deep';

			list.appendChild( createTocItem( heading, modifier ) );
			headingElements.push( heading );
		} );

		// ── Intersection Observer for active state ──────────────────────
		//
		// Strategy: track which heading is currently "in view" near the top
		// of the viewport.  rootMargin crops the observation area to just the
		// top ~30% of the screen so we switch early, which feels natural when
		// scrolling down through long content.

		let activeLink = null;

		const setActive = ( id ) => {
			if ( activeLink ) {
				activeLink.classList.remove( 'is-active' );
				activeLink.closest( '.method-scrollspy__item' )?.classList.remove( 'is-active' );
			}

			const next = list.querySelector( `a[href="#${ id }"]` );

			if ( next ) {
				next.classList.add( 'is-active' );
				next.closest( '.method-scrollspy__item' )?.classList.add( 'is-active' );
				activeLink = next;

				// Scroll the active link into view within the scrollspy if it overflows.
				const scrollContainer = nav.querySelector( '.method-scrollspy__inner' );
				if ( scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight ) {
					const containerRect = scrollContainer.getBoundingClientRect();
					const linkRect = next.getBoundingClientRect();
					if ( linkRect.top < containerRect.top || linkRect.bottom > containerRect.bottom ) {
						scrollContainer.scrollTo( {
							top: scrollContainer.scrollTop + ( linkRect.top - containerRect.top ) - containerRect.height / 2,
							behavior: 'smooth',
						} );
					}
				}
			}
		};

		// We keep an ordered map of heading → isIntersecting so we can always
		// derive the "topmost visible heading" on each callback.
		const visibilityMap = new Map();
		headingElements.forEach( ( h ) => visibilityMap.set( h, false ) );

		const observer = new IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					visibilityMap.set( entry.target, entry.isIntersecting );
				} );

				// Find the first (topmost in DOM order) heading that's visible.
				for ( const [ heading, visible ] of visibilityMap ) {
					if ( visible ) {
						setActive( heading.id );
						return;
					}
				}

				// If nothing is intersecting (user scrolled past all headings),
				// keep the last active item highlighted.
			},
			{
				// Observe an area from the top of the viewport down to 30%.
				// This means a heading becomes "active" the moment it enters
				// the top 30% of the screen.
				rootMargin: `${ stickyOffset * -1 }px 0px -70% 0px`,
				threshold: 0,
			}
		);

		headingElements.forEach( ( heading ) => observer.observe( heading ) );

		// ── Smooth scroll on click ──────────────────────────────────────
		list.addEventListener( 'click', ( e ) => {
			const link = e.target.closest( 'a' );
			if ( ! link ) return;

			e.preventDefault();

			const targetEl = document.querySelector( link.getAttribute( 'href' ) );
			if ( ! targetEl ) return;

			const top =
				targetEl.getBoundingClientRect().top +
				window.scrollY -
				stickyOffset -
				16; // extra breathing room

			window.scrollTo( { top, behavior: 'smooth' } );

			// Update the URL hash without jumping.
			history.pushState( null, '', link.getAttribute( 'href' ) );
		} );

		// ── Handle initial hash on page load ────────────────────────────
		if ( window.location.hash ) {
			const hashTarget = document.querySelector( window.location.hash );
			if ( hashTarget && visibilityMap.has( hashTarget ) ) {
				// Small delay so the browser's native scroll-to-hash doesn't
				// fight with our smooth scroll.
				requestAnimationFrame( () => setActive( hashTarget.id ) );
			}
		}
	}

	// ── Boot ────────────────────────────────────────────────────────────
	// Wait for DOMContentLoaded in case this script loads in <head>.
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}

	function boot() {
		document.querySelectorAll( '.method-scrollspy' ).forEach( init );
	}
} )();
