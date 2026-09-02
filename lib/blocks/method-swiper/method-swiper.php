<?php

/**
 * Min-width (px) at which the swiper's tablet and desktop tiers kick in.
 *
 * Derived from the theme breakpoints (method_get_block_breakpoints()) so the
 * frontend matches the editor, which resolves the same tiers from
 * methodGlobalData.breakpoints: tablet from tablet_min, desktop just above
 * tablet_max. Falls back to the lib/config.php defaults.
 */
function method_swiper_get_breakpoints() {
	$bp = function_exists( 'method_get_block_breakpoints' ) ? method_get_block_breakpoints() : array();

	return array(
		'tablet'  => isset( $bp['tablet_min'] ) ? (int) $bp['tablet_min'] : 768,
		'desktop' => isset( $bp['tablet_max'] ) ? (int) $bp['tablet_max'] + 1 : 1200,
	);
}

function register_method_swiper_block() {
	register_block_type( __DIR__ . '/build/swiper', [
    'render_callback' => function( $attributes, $content ) {
		$methodId = uniqid( 'method' );
		$methodIcons = method_get_theme_icons();

		$cssargs = array(
        	'#' . $methodId . ' .method-swiper-button-prev, #' . $methodId . ' .method-swiper-button-next' => array( 'textColor' ),
			'#' . $methodId . ' .swiper-pagination' => array( 'linkColor' ),
    	);

		$responsive = method_get_block_responsive_styles( $attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    	method_collect_css( $responsive, '#' . $methodId, 10);

		$show_navigation = ! isset( $attributes['showNavigation'] ) || $attributes['showNavigation'];
		$show_pagination = ! isset( $attributes['showPagination'] ) || $attributes['showPagination'];
		$alt_pagination = ! isset( $attributes['altPagination'] ) || $attributes['altPagination'];
		$fade_effect     = isset( $attributes['fadeEffect'] ) && $attributes['fadeEffect'];
		$hash_navigation = isset( $attributes['hashNavigation'] ) && $attributes['hashNavigation'];
		$scroll_to_slide = $hash_navigation && isset( $attributes['scrollToSlideStart'] ) && $attributes['scrollToSlideStart'];

		// Mobile-first base values; the tablet and desktop tiers override via
		// Swiper breakpoints at the theme's breakpoint widths.
		$breakpoints            = method_swiper_get_breakpoints();
		$slides_per_view        = isset( $attributes['slidesPerView'] ) ? intval( $attributes['slidesPerView'] ) : 3;
		$slides_per_view_tablet = isset( $attributes['slidesPerViewTablet'] ) ? intval( $attributes['slidesPerViewTablet'] ) : 2;
		$slides_per_view_mobile = isset( $attributes['slidesPerViewMobile'] ) ? intval( $attributes['slidesPerViewMobile'] ) : 1;
		$space_between          = isset( $attributes['spaceBetween'] ) ? intval( $attributes['spaceBetween'] ) : 24;
		$space_between_tablet   = isset( $attributes['spaceBetweenTablet'] ) ? intval( $attributes['spaceBetweenTablet'] ) : 24;
		$space_between_mobile   = isset( $attributes['spaceBetweenMobile'] ) ? intval( $attributes['spaceBetweenMobile'] ) : 24;

		$leftArrow = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="method-default-prev-icon method-default-icon" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" /></svg>';
		$rightArrow = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="method-default-next-icon method-default-icon" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" /></svg>';

		if ( ( is_array( $methodIcons ) ) && ( method_check_array_key( $attributes, 'prevIcon' ) ) ) {
        	if ( method_check_array_key( $methodIcons, $attributes['prevIcon'] ) ) {
				$leftArrow = $methodIcons["{$attributes['prevIcon']}"]['svg'];
			}
		}
		if ( ( is_array( $methodIcons ) ) && ( method_check_array_key( $attributes, 'nextIcon' ) ) ) {
        	if ( method_check_array_key( $methodIcons, $attributes['nextIcon'] ) ) {
				$rightArrow = $methodIcons["{$attributes['nextIcon']}"]['svg'];
			}
		}

		$pagination_markup = $show_pagination ? '<div class="' . ( $alt_pagination ? 'method-swiper-pagination ' : '' ) . 'swiper-pagination"> </div>' : '';
		$navigation_markup = $show_navigation
			? '<div class="method-swiper-button-prev"><span class="method-swiper-icon method-swiper-icon-prev">' . $leftArrow . '</span><span class="visually-hidden">Previous</span></div>
			   <div class="method-swiper-button-next"><span class="method-swiper-icon method-swiper-icon-next">' . $rightArrow . '</span><span class="visually-hidden">Next</span></div>'
			: '';

		$pagination_config = $show_pagination
			? 'pagination: { el: \'#' . $methodId . ' .' . ( $alt_pagination ? 'method-' : '' ) . 'swiper-pagination\', clickable: true },'
			: '';
		$navigation_config = $show_navigation
			? 'navigation: { nextEl: \'#' . $methodId . ' .method-swiper-button-next\', prevEl: \'#' . $methodId . ' .method-swiper-button-prev\' },'
			: '';
		$hash_config = $hash_navigation
			? 'hashNavigation: { watchState: true, replaceState: true },'
			: '';

		// Bound after init (below) so the initial hash jump doesn't trigger a scroll —
		// only genuine navigation does. Scrolls to the top of the slider so taller/
		// shorter slides always start from the top.
		$scroll_binding = $scroll_to_slide
			? 'var ' . $methodId . 'LastIndex = ' . $methodId . 'Swiper.realIndex;
			   ' . $methodId . 'Swiper.on(\'slideChange\', function () {
			       if ( ' . $methodId . 'Swiper.realIndex === ' . $methodId . 'LastIndex ) return;
			       ' . $methodId . 'LastIndex = ' . $methodId . 'Swiper.realIndex;
			       document.getElementById(\'' . $methodId . '\').scrollIntoView({ behavior: \'instant\', block: \'start\' });
			   });'
			: '';

		// Fade shows a single, stacked slide and crossfades between them, so
		// per-view counts, spacing and breakpoints don't apply.
		$effect_config = $fade_effect
			? "slidesPerView: 1,
                        spaceBetween: 0,
                        effect: 'fade',
                        fadeEffect: { crossFade: true },"
			: "slidesPerView: $slides_per_view_mobile,
                        spaceBetween: $space_between_mobile,
                        breakpoints: {
                            {$breakpoints['tablet']}: { slidesPerView: $slides_per_view_tablet, spaceBetween: $space_between_tablet },
                            {$breakpoints['desktop']}: { slidesPerView: $slides_per_view, spaceBetween: $space_between }
                        },";

        $hash_tracking = '
			// Store this swiper in a global registry for hash tracking
			if (!window.methodSwipers) window.methodSwipers = {};
			window.methodSwipers[\'' . $methodId . '\'] = ' . $methodId . 'Swiper;
			';

        $global_tracking_script = '
			<script>
			if (!window.methodHashTrackingLoaded) {
				window.methodHashTrackingLoaded = true;
				(function () {
					var attachedSwipers = new Set();

					function getActiveHashFromSwipers() {
						if (!window.methodSwipers) return window.location.hash.slice(1);

						for (var swiperId in window.methodSwipers) {
							var swiper = window.methodSwipers[swiperId];
							if (swiper && swiper.slides && swiper.activeIndex !== undefined) {
								var activeSlide = swiper.slides[swiper.activeIndex];
								if (activeSlide) {
									var dataHash = activeSlide.getAttribute("data-hash");
									if (dataHash) return dataHash;
								}
							}
						}

						return window.location.hash.slice(1);
					}

					function updateHashActiveLinks() {
						const activeHash = getActiveHashFromSwipers();
						const hashLinks = document.querySelectorAll("a[href^=\"#\"]");

						hashLinks.forEach(function (link) {
							const linkHash = link.getAttribute("href").slice(1);
							if (linkHash === activeHash && activeHash !== "") {
								link.classList.add("method-hash-active");
							} else {
								link.classList.remove("method-hash-active");
							}
						});
					}

					function attachSwiperListeners() {
						if (!window.methodSwipers) return;

						Object.entries(window.methodSwipers).forEach(function (entry) {
							var swiperId = entry[0];
							var swiper = entry[1];

							if (attachedSwipers.has(swiperId) || !swiper) return;
							attachedSwipers.add(swiperId);

							if (typeof swiper.on === "function") {
								swiper.on("slideChange", updateHashActiveLinks);
								swiper.on("init", updateHashActiveLinks);
							}
						});
					}

					if (document.readyState === "loading") {
						document.addEventListener("DOMContentLoaded", function () {
							updateHashActiveLinks();
							setTimeout(attachSwiperListeners, 100);
						});
					} else {
						updateHashActiveLinks();
						setTimeout(attachSwiperListeners, 100);
					}

					window.addEventListener("hashchange", updateHashActiveLinks);
					setInterval(attachSwiperListeners, 500);
				})();
			}
			</script>
		';

        return '
            <div ' . get_block_wrapper_attributes( ['class' => 'method-swiper', 'id' => $methodId] ) . '>
                <div class="swiper-outer">
                    <div class="swiper-outer-wrap">
                        <div class="swiper-outer-wrap-inner">
                            <div class="swiper swiper-container">
                                    ' . do_blocks( $content ) . '
                                    ' . ( ! $alt_pagination ? $pagination_markup : '' ) . '
                            </div>
                        </div>
                    </div>
				    ' . $navigation_markup . '
					' . ( $alt_pagination ? $pagination_markup : '' ) . '
                </div>
			</div>
			<script>
                document.addEventListener(\'DOMContentLoaded\', function () {
                    const ' . $methodId . 'Swiper = new Swiper(\'#' . $methodId . ' .swiper-container\', {
                        ' . $effect_config . '
                        loop: false,
                        autoHeight: true,
                        ' . $pagination_config . '
                        ' . $navigation_config . '
                        ' . $hash_config . '
                    });
                    ' . $scroll_binding . '
                    ' . $hash_tracking . '
                });
			</script>
			' . $global_tracking_script . '
		';
    },
] );
}
add_action( 'init', 'register_method_swiper_block' );

function register_method_swiper_slide_block() {
	register_block_type( __DIR__ . '/build/swiper-slide', [
    'render_callback' => function( $attributes, $content ) {
        $methodId = uniqid( 'method-' );

		// Swiper's hash navigation reads this `data-hash` off each slide. Output the
		// value as-is (get_block_wrapper_attributes escapes it) so it matches the
		// editor exactly. get_block_wrapper_attributes() runs esc_attr() on values.
		$wrapper_atts = [ 'class' => 'swiper-slide', 'id' => $methodId ];
		if ( ! empty( $attributes['hash'] ) ) {
			$wrapper_atts['data-hash'] = $attributes['hash'];
		}

		return '
		<div ' . get_block_wrapper_attributes( $wrapper_atts ) . '>
			<div class="method-swiper-slide">
                <div class="method-swiper-slide-inner">
                    ' . do_blocks( $content ) . '
                </div>
            </div>
		</div>';
    },
] );
}
add_action( 'init', 'register_method_swiper_slide_block' );