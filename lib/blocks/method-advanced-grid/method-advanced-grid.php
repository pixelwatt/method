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

//-----------------------------------------------------
// Advanced Grid Container
//-----------------------------------------------------

function render_method_advanced_grid_block( $block_attributes, $content, $block ) {
    $methodId = uniqid( 'method-' );
    $cssargs = array(
        '#' . $methodId => array( 'margin-top', 'margin-bottom', 'marginLeftNonZero', 'marginRightNonZero', 'padding-top', 'padding-bottom', 'font-size', 'line-height' ),
        '#' . $methodId . ' > .row > .col-24 > .method-advanced-grid-rows' => array( 'padding-left', 'padding-right', 'gapAsVars' )
    );

    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);

    return '<div ' . get_block_wrapper_attributes( ['class' => 'method-advanced-grid', 'id' => $methodId] ) . '>' . do_blocks( $content ) . '</div>';
}

//-----------------------------------------------------
// Advanced Grid Row
//-----------------------------------------------------

function render_method_advanced_grid_row_block( $block_attributes, $content, $block ) {
    $methodId = uniqid( 'method-' );
    $cssargs = array(
        '#' . $methodId => array( 'margin-top', 'margin-bottom', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'font-size', 'line-height' ),
        '#' . $methodId . ' > .method-advanced-grid-row' => array( 'gapAsVars' )
    );

    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);

    return '<div ' . get_block_wrapper_attributes( ['class' => 'method-advanced-grid-row-wrap', 'id' => $methodId] ) . '>' . do_blocks( $content ) . '</div>';
}

//-----------------------------------------------------
// Advanced Grid Column
//-----------------------------------------------------

function render_method_advanced_grid_col_block( $block_attributes, $content, $block ) {
    $methodId = uniqid( 'method-' );

    $breakpoints = method_get_breakpoint_class_prefixes();
    $baseCols = method_get_responsive_setting( $block_attributes, 'base', 'gridCols', 8 );
    $baseOffset = method_get_responsive_setting( $block_attributes, 'base', 'offset', 0 );
    $colClasses = array();
    foreach( $breakpoints as $key => $value ) {
        $prefix = ( 'mobile' !== $key ? $value . '-' : '' );
        if ( ( 'base' !== $key ) && ( method_get_responsive_setting( $block_attributes, $key, 'enabled' ) ) ) {
            $breakpointCols = method_get_responsive_setting( $block_attributes, $key, 'gridCols', $baseCols );
            $breakpointOffset = method_get_responsive_setting( $block_attributes, $key, 'offset', $baseOffset );
        } else {
            $breakpointCols = $baseCols;
            $breakpointOffset = $baseOffset;
        }
        $colClasses[] = 'col-' . $prefix . $breakpointCols;
        $colClasses[] = 'offset-' . $prefix . $breakpointOffset;
    }

    $cssargs = array(
        '#' . $methodId => array( 'order' ),
        '#' . $methodId . ' > .method-advanced-grid-col-content' => array( 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'font-size', 'line-height', 'color' ),
        '#' . $methodId . ' > .method-advanced-grid-col-content a' => array( 'linkColor' )
    );

    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);

    // And now, profit.
    return '<div ' . get_block_wrapper_attributes( ['class' => implode( ' ', $colClasses ), 'id' => $methodId] ) . '>' . do_blocks( $content ) . '</div>';
}