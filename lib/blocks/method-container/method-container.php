<?php

// Block registrations

function register_method_container_block() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_container_block'
    ]);
}
add_action( 'init', 'register_method_container_block' );



function render_method_container_block( $block_attributes, $content, $block ) {

}