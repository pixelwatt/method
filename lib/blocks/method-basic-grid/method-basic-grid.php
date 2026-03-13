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
    $methodId = uniqid( 'method-' );
    
    
    $outerClasses = array( 'method-layout-' . method_get_responsive_setting( $block_attributes, 'base', 'gridCols', 3 ) );
    $breakpoints = array( 'mobile', 'tablet', 'wide' );
    foreach ( $breakpoints as $breakpoint ) {
        if ( method_get_responsive_setting( $block_attributes, $breakpoint, 'enabled' ) ) {
            if ( method_get_responsive_setting( $block_attributes, $breakpoint, 'gridCols' ) ) {
                $outerClasses[] = 'method-layout-' . $breakpoint . '-' . method_get_responsive_setting( $block_attributes, $breakpoint, 'gridCols' );
            }
        }
    }
    
    $output = '<div ' . get_block_wrapper_attributes( ['class' => 'method-basic-grid ' . implode( ' ', $outerClasses), 'id' => $methodId] ) . '>' . do_blocks( $content ) . '</div>';

    $cssargs = array(
        '#' . $methodId => array( 'margin-top', 'margin-bottom' ),
        '#' . $methodId . ' > .method-inner-blocks' => array( 'gapAsVars', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'alignItems', 'justifyContent' )
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);
    return $output;
}

function render_method_basic_grid_item_block( $block_attributes, $content, $block ) {
    $methodId = uniqid( 'method-' );
    $output = '<div ' . get_block_wrapper_attributes( ['class' => 'method-grid-item-component', 'id' => $methodId] ) . '>' . do_blocks( $content ) . '</div>';
    $cssargs = array(
        '#' . $methodId . ' > .method-inner-blocks' => array( 'padding-left', 'padding-right', 'padding-top', 'padding-bottom' )
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);
    return $output;
}