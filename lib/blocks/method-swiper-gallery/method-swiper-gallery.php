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
    return;
}