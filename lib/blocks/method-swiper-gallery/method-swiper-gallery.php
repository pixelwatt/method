<?php

// Block registrations

function register_method_swiper_gallery_block() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_swiper_gallery_block'
    ]);
}
add_action( 'init', 'register_method_swiper_gallery_block' );

function method_swiper_gallery_enqueue_assets() {
    wp_enqueue_script('swiper', get_template_directory_uri() . '/inc/swiper/swiper-bundle.min.js', [], null, true);
    wp_enqueue_style('swiper', get_template_directory_uri() . '/inc/swiper/swiper-bundle.min.css');
}
add_action('enqueue_block_assets', 'method_swiper_gallery_enqueue_assets');


function render_method_swiper_gallery_block( $block_attributes, $block ) {
    $methodId = uniqid( 'method-' );

    $aspectClass = '';
    $outerClass = 'method-fit-img-container';
    $imgClass = 'method-fit-img';

    if ( 'ratio' == method_get_responsive_setting( $block_attributes, 'base', 'aspectUses', '' ) ) {
        $aspectClass = ' method-ratio method-ratio' . method_get_responsive_setting( $block_attributes, 'base', 'aspectRatio', '-1-1' );
    } elseif ( empty( method_get_responsive_setting( $block_attributes, 'base', 'aspectUses', '' ) ) ) {
        $outerClass = 'method-swiper-img-container';
        $imgClass = 'method-fluid-img';
    }

    $slides = '';
    if ( method_check_array_key( $block_attributes, 'images' ) ) {
        if ( is_array( $block_attributes['images'] ) ) {
            if ( 0 < count( $block_attributes['images'] ) ) {
                foreach ( $block_attributes['images'] as $item ) {
                    $slides .= '
                        <div class="swiper-slide">
                            <div class="' . $outerClass . $aspectClass . '">
                                <div class="method-img-shade">&nbsp;</div>
                                ' . wp_get_attachment_image( $item['id'], 'method_hd', false, array( 'class' => $imgClass ) ) . '
                            </div>
                        </div>
                    ';
                }
            }
        }
    }

    $output = '
        <div ' . get_block_wrapper_attributes( ['class' => 'method-swiper-gallery', 'id' => $methodId] ) . '>
            <div class="swiper">
                <div class="swiper-wrapper">
                    ' . $slides . '
                </div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>    
        <script>
        document.addEventListener(\'DOMContentLoaded\', function() {
            const swiper = new Swiper(\'#' . $methodId . ' .swiper\', {
                // Optional parameters
                loop: true,
                slidesPerView: 1,

                // If we need pagination
                pagination: {
                    el: \'#' . $methodId . ' .swiper-pagination\',
                },

                // Navigation arrows
                navigation: {
                    nextEl: \'#' . $methodId . ' .swiper-button-next\',
                    prevEl: \'#' . $methodId . ' .swiper-button-prev\',
                },
            });
        });
        </script>
    ';
    return $output;
}