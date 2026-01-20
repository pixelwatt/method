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
    return '<div ' . get_block_wrapper_attributes( ['class' => 'method-accordion' ] ) . '>' . do_blocks( $content ) . '</div>';
}

function render_method_accordion_item_block( $block_attributes, $content, $block ) {
    $itemIndex = $block_attributes['itemIndex'];
    return '
        <h2 class="accordion-header"><button class="accordion-button' . ( 1 == $itemIndex ? '' : ' collapsed' ) . '" type="button" aria-expanded="' . ( 1 == $itemIndex ? 'true' : 'false' ) . '" aria-controls="collapse' . $itemIndex . '" data-bs-toggle="collapse" data-bs-target="#collapse' . $itemIndex . '">' . ( method_check_array_key( $block_attributes, 'headline' ) ? $block_attributes['headline'] : 'Accordion Item' ) . '</button></h2>
        <div ' . get_block_wrapper_attributes( ['class' => 'accordion-item' ] ) . '>
            ' . do_blocks( $content ) . '
        </div>
    ';
}

function render_method_accordion_body_block( $block_attributes, $content, $block ) {
    return '<div ' . get_block_wrapper_attributes( ['class' => 'accordion-body' ] ) . '>' . do_blocks( $content ) . '</div>';
}