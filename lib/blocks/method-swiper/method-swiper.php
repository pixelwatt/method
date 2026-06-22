<?php

function register_method_swiper_block() {
	register_block_type( __DIR__ . '/build/swiper', [
    'render_callback' => function( $attributes, $content ) {
		$methodId = uniqid( 'method' );

		$show_navigation = ! isset( $attributes['showNavigation'] ) || $attributes['showNavigation'];
		$show_pagination = ! isset( $attributes['showPagination'] ) || $attributes['showPagination'];
		$fade_effect     = isset( $attributes['fadeEffect'] ) && $attributes['fadeEffect'];
		$hash_navigation = isset( $attributes['hashNavigation'] ) && $attributes['hashNavigation'];
		$scroll_to_slide = $hash_navigation && isset( $attributes['scrollToSlideStart'] ) && $attributes['scrollToSlideStart'];

		// Mobile-first base values; tablet (768px) and desktop (1024px) tiers
		// override via breakpoints, matching the editor's Swiper config.
		$slides_per_view        = isset( $attributes['slidesPerView'] ) ? intval( $attributes['slidesPerView'] ) : 3;
		$slides_per_view_tablet = isset( $attributes['slidesPerViewTablet'] ) ? intval( $attributes['slidesPerViewTablet'] ) : 2;
		$slides_per_view_mobile = isset( $attributes['slidesPerViewMobile'] ) ? intval( $attributes['slidesPerViewMobile'] ) : 1;
		$space_between          = isset( $attributes['spaceBetween'] ) ? intval( $attributes['spaceBetween'] ) : 24;
		$space_between_tablet   = isset( $attributes['spaceBetweenTablet'] ) ? intval( $attributes['spaceBetweenTablet'] ) : 24;
		$space_between_mobile   = isset( $attributes['spaceBetweenMobile'] ) ? intval( $attributes['spaceBetweenMobile'] ) : 24;

		$pagination_markup = $show_pagination ? '<div class="swiper-pagination"> </div>' : '';
		$navigation_markup = $show_navigation
			? '<div class="method-swiper-button-prev"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" /></svg><span class="visually-hidden">Previous</span></div>
			   <div class="method-swiper-button-next"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" /></svg><span class="visually-hidden">Next</span></div>'
			: '';

		$pagination_config = $show_pagination
			? 'pagination: { el: \'#' . $methodId . ' .swiper-pagination\', clickable: true },'
			: '';
		$navigation_config = $show_navigation
			? 'navigation: { nextEl: \'#' . $methodId . ' .method-swiper-button-next\', prevEl: \'#' . $methodId . ' .method-swiper-button-prev\' },'
			: '';
		$hash_config = $hash_navigation
			? 'hashNavigation: { watchState: true },'
			: '';

		// Bound after init (below) so the initial hash jump doesn't trigger a scroll —
		// only genuine navigation does. Scrolls to the top of the slider so taller/
		// shorter slides always start from the top.
		$scroll_binding = $scroll_to_slide
			? $methodId . 'Swiper.on(\'slideChange\', function () { document.getElementById(\'' . $methodId . '\').scrollIntoView({ behavior: \'smooth\', block: \'start\' }); });'
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
                            768: { slidesPerView: $slides_per_view_tablet, spaceBetween: $space_between_tablet },
                            1024: { slidesPerView: $slides_per_view, spaceBetween: $space_between }
                        },";

        return '
            <div ' . get_block_wrapper_attributes( ['class' => 'method-swiper', 'id' => $methodId] ) . '>
                <div class="swiper-outer">
                    <div class="swiper-outer-wrap">
                        <div class="swiper-outer-wrap-inner">
                            <div class="swiper swiper-container">
                                    ' . do_blocks( $content ) . '
                                    ' . $pagination_markup . '
                            </div>
                        </div>
                    </div>
				    ' . $navigation_markup . '
                </div>
			</div>
			<script>
                document.addEventListener(\'DOMContentLoaded\', function () {
                    const ' . $methodId . 'Swiper = new Swiper(\'#' . $methodId . ' .swiper-container\', {
                        ' . $effect_config . '
                        loop: true,
                        autoHeight: true,
                        ' . $pagination_config . '
                        ' . $navigation_config . '
                        ' . $hash_config . '
                    });
                    ' . $scroll_binding . '
                });
			</script>
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

function enqueue_method_swiper_assets() {
	if ( is_admin() ) {
	wp_add_inline_script( 'swiper', "
		document.addEventListener('DOMContentLoaded', function () {
			document.querySelectorAll('.method-swiper .swiper-container').forEach(function (el) {
				new Swiper(el, {
					slidesPerView: parseInt(el.dataset.slidesPerView) || 1,
					loop: true,
                    autoHeight: true,
					pagination: {
						el: el.querySelector('.swiper-pagination'),
						clickable: true
					}
				});
			});
		});
	" );
	}
}
//add_action( 'enqueue_block_assets', 'enqueue_method_swiper_assets' );