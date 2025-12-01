<?php

// Block registrations

function register_method_basic_grid_block() {
	register_block_type( __DIR__ . '/build/grid', [
        'render_callback' => 'render_method_basic_grid_block'
    ]);
}
add_action( 'init', 'register_method_basic_grid_block' );

function register_method_basic_grid_item_block() {
	register_block_type( __DIR__ . '/build/item', [
        'render_callback' => 'render_method_basic_grid_item_block'
    ]);
}
add_action( 'init', 'register_method_basic_grid_item_block' );


function render_method_basic_grid_block( $block_attributes, $content, $block ) {
    $output = do_blocks( $content );
    return $output;
}

function render_method_basic_grid_item_block( $block_attributes, $content, $block ) {
    $output = do_blocks( $content );
    return $output;
}