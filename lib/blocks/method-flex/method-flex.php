<?php

// Block registrations

function register_method_flex_block() {
	register_block_type( __DIR__ . '/build/flex', [
        'render_callback' => 'render_method_flex_block'
    ]);
}
add_action( 'init', 'register_method_flex_block' );

function register_method_flex_item_block() {
	register_block_type( __DIR__ . '/build/item', [
        'render_callback' => 'render_method_flex_item_block'
    ]);
}
add_action( 'init', 'register_method_flex_item_block' );

function render_method_flex_block( $block_attributes, $content, $block ) {
    $methodId = uniqid( 'method-' );
    $cssargs = array(
        '#' . $methodId => array( 'margin-top', 'margin-bottom' ),
        '#' . $methodId . ' > .method-flex-inner-blocks' => array( 'gap', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'justifyContent', 'alignItems', 'flexDirection' ),
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);


    $output = '
        <div ' . get_block_wrapper_attributes( ['class' => 'method-flex', 'id' => $methodId] ) . '>
            ' . do_blocks( $content ) . '
        </div>
    ';
    return $output;
}

function render_method_flex_item_block( $block_attributes, $content, $block ) {
    $methodId = uniqid( 'method-' );
    $cssargs = array(
        '#' . $methodId => array( 'flexGrow', 'flexShrink', 'flexBasis', 'order', 'hide' ),
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);
    $output = '
        <div ' . get_block_wrapper_attributes( ['class' => 'method-flex-item', 'id' => $methodId] ) . '>
            ' . do_blocks( $content ) . '
        </div>
    ';
    return $output;
}