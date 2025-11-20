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
    $methodId = ( method_check_array_key( $block_attributes, 'methodId' ) ? $block_attributes['methodId'] : uniqid( 'method-' ) );
    $cssargs = array(
        '#' . $methodId => array( 'margin-top', 'margin-bottom', 'marginLeftNonZero', 'marginRightNonZero', 'padding-top', 'padding-bottom', 'font-size', 'line-height' ),
        '#' . $methodId . ' > .row > .col-24 > .method-advanced-grid-rows' => array( 'padding-left', 'padding-right', 'gapAsVars' )
    );

    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ) );

    return '<div ' . get_block_wrapper_attributes( ['class' => 'method-advanced-grid', 'id' => $methodId] ) . '>' . do_blocks( $content ) . '</div>' . $responsive;
}

//-----------------------------------------------------
// Advanced Grid Row
//-----------------------------------------------------

function render_method_advanced_grid_row_block( $block_attributes, $content, $block ) {
    $methodId = ( method_check_array_key( $block_attributes, 'methodId' ) ? $block_attributes['methodId'] : uniqid( 'method-' ) );
    $cssargs = array(
        '#' . $methodId => array( 'margin-top', 'margin-bottom', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'font-size', 'line-height' ),
        '#' . $methodId . ' > .method-advanced-grid-row.row' => array( 'gapAsVars' )
    );

    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ) );

    return '<div ' . get_block_wrapper_attributes( ['class' => 'method-advanced-grid-row-wrap', 'id' => $methodId] ) . '>' . do_blocks( $content ) . '</div>' . $responsive;
}

//-----------------------------------------------------
// Advanced Grid Column
//-----------------------------------------------------

function render_method_advanced_grid_col_block( $block_attributes, $content, $block ) {
    $methodId = ( method_check_array_key( $block_attributes, 'methodId' ) ? $block_attributes['methodId'] : uniqid( 'method-' ) );

    // Since column classes are (and need to be) applied to the outermost container, we'll need to rebuild the classlist first
    $baseCols = 8;
    if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
        if ( method_check_array_key( $block_attributes['responsiveSettings'], 'base' ) ) {
            if ( method_check_array_key( $block_attributes['responsiveSettings']['base'], 'gridCols' ) ) {
                $baseCols = $block_attributes['responsiveSettings']['base']['gridCols'];
            }
        }
    }

    $colClasses = 'col-' . $baseCols . ' col-xl-' . $baseCols;
    if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
        if ( method_check_array_key( $block_attributes['responsiveSettings'], 'mobile' ) ) {
            if ( method_check_array_key( $block_attributes['responsiveSettings']['mobile'], 'enabled' ) ) {
                $colClasses = 'col-' . $block_attributes['responsiveSettings']['mobile']['gridCols'] . ' col-xl-' . $baseCols;
            }
        }
        if ( method_check_array_key( $block_attributes['responsiveSettings'], 'tablet' ) ) {
            if ( method_check_array_key( $block_attributes['responsiveSettings']['tablet'], 'enabled' ) ) {
                $colClasses .= ' col-md-' . $block_attributes['responsiveSettings']['tablet']['gridCols'];
            }
        }
        if ( method_check_array_key( $block_attributes['responsiveSettings'], 'wide' ) ) {
            if ( method_check_array_key( $block_attributes['responsiveSettings']['wide'], 'enabled' ) ) {
                $colClasses .= ' col-xxl-' . $block_attributes['responsiveSettings']['wide']['gridCols'];
            }
        }
    }

    // And now, profit.
    return '<div ' . get_block_wrapper_attributes( ['class' => $colClasses, 'id' => $methodId] ) . '>' . do_blocks( $content ) . '</div>';
}