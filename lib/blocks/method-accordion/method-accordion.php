<?php

// Block registrations

function register_method_accordion_block() {
	register_block_type( __DIR__ . '/build/accordion', [
        'render_callback' => 'render_method_accordion_block'
    ]);
}
add_action( 'init', 'register_method_accordion_block' );

function register_method_accordion_item_block() {
	register_block_type( __DIR__ . '/build/item', [
        'render_callback' => 'render_method_accordion_item_block'
    ]);
}
add_action( 'init', 'register_method_accordion_item_block' );

function register_method_accordion_body_block() {
	register_block_type( __DIR__ . '/build/body', [
        'render_callback' => 'render_method_accordion_body_block'
    ]);
}
add_action( 'init', 'register_method_accordion_body_block' );

function render_method_accordion_block( $block_attributes, $content, $block ) {

}

function render_method_accordion_item_block( $block_attributes, $content, $block ) {

}

function render_method_accordion_body_block( $block_attributes, $content, $block ) {

}