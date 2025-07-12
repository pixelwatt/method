<?php

// Block registrations

function register_method_advanced_grid_block() {
	register_block_type( __DIR__ . '/build/grid', [
        'render_callback' => 'render_method_advanced_grid_block'
    ]);
}
add_action( 'init', 'register_method_advanced_grid_block' );

function register_method_advanced_grid_row_block() {
	register_block_type( __DIR__ . '/build/row', [
        'render_callback' => 'render_method_advanced_grid_row_block'
    ]);
}
add_action( 'init', 'register_method_advanced_grid_row_block' );

function register_method_advanced_grid_col_block() {
	register_block_type( __DIR__ . '/build/col', [
        'render_callback' => 'render_method_advanced_grid_col_block'
    ]);
}
add_action( 'init', 'register_method_advanced_grid_col_block' );


// Frontend rendering callbacks

function render_method_advanced_grid_block( $block_attributes, $content, $block ) {

}

function render_method_advanced_grid_row_block( $block_attributes, $content, $block ) {
    
}

function render_method_advanced_grid_col_block( $block_attributes, $content, $block ) {
    
}