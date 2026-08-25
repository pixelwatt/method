<?php

// Block registrations

function register_method_looping_alert_block() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_looping_alert_block'
    ]);
}
add_action( 'init', 'register_method_looping_alert_block' );


function render_method_looping_alert_block( $block_attributes, $block ) {
    return '<pre>' . print_r( $block_attributes, true ) . '</pre>';
}