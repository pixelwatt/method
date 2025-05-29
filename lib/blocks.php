<?php

//-----------------------------------------------------
// Register stylesheets for a 24 column Bootstrap grid
// and Method's blocks.
//-----------------------------------------------------

function method_block_assets() {
     wp_enqueue_style( 'method-global', get_stylesheet_directory_uri() . '/lib/blocks/global/global.css', ( ! is_admin() ? array('wp-block-library', 'wp-block-library-theme', 'global-styles') : '' ), METHOD_VERSION );
     wp_enqueue_style( 'method-bs-grid', get_stylesheet_directory_uri() . '/lib/blocks/global/bootstrap-grid.css', ( ! is_admin() ? array('wp-block-library', 'wp-block-library-theme', 'global-styles') : '' ), METHOD_VERSION );
}

add_action( 'enqueue_block_assets', 'method_block_assets' );


//-----------------------------------------------------
// Add block categories for Method's bloclks to the top 
// of the block sidebar.
//-----------------------------------------------------

add_filter( 'block_categories_all' , function( $categories ) {

    $new_category = array(
        'slug'  => 'method-page-blocks',
        'title' => 'Method Page Blocks'
    );

    // Prepend the new category to the beginning of the array.
    array_unshift( $categories, $new_category );

    $new_category = array(
        'slug'  => 'method-component-blocks',
        'title' => 'Method Component Blocks'
    );

    // Prepend the new category to the beginning of the array.
    array_unshift( $categories, $new_category );

    $new_category = array(
        'slug'  => 'method-layout-blocks',
        'title' => 'Method Layout Blocks'
    );

    // Prepend the new category to the beginning of the array.
    array_unshift( $categories, $new_category );

    return $categories;

} );


//-----------------------------------------------------
// Load Method's custom blocks.
//-----------------------------------------------------




//-----------------------------------------------------
// This function generates inline CSS for our PHP
// render functions.
//-----------------------------------------------------


function method_get_block_inline_styles( $block_attributes, $set_margins = true ) {
	if ( ! method_check_array_key( $block_attributes, 'style' ) ) {
		$block_attributes['style'] = [];
	}
	if ( $set_margins ) {
		
		if ( ! isset( $block_attributes['style']['spacing'] ) || ! is_array( $block_attributes['style']['spacing'] ) ) {
			$block_attributes['style']['spacing'] = [];
		}
		if ( ! isset( $block_attributes['style']['spacing']['margin'] ) || ! is_array( $block_attributes['style']['spacing']['margin'] ) ) {
			$block_attributes['style']['spacing']['margin'] = [];
		}
		if ( ! isset( $block_attributes['style']['spacing']['margin']['top'] ) ) {
			$block_attributes['style']['spacing']['margin']['top'] = '0';
		}
		if ( ! isset( $block_attributes['style']['spacing']['margin']['bottom'] ) ) {
			$block_attributes['style']['spacing']['margin']['bottom'] = '0';
		}
	}
	if ( method_check_array_key( $block_attributes, 'backgroundColor' ) ) {
		$block_attributes['style']['color']['background'] = method_sanitize_theme_color( $block_attributes['backgroundColor'] );
	}
	if ( method_check_array_key( $block_attributes, 'textColor' ) ) {
		if ( 'light' == $block_attributes['textColor'] ) {
			$block_attributes['textColor'] = '#ffffff';
		}
		if ( 'dark' == $block_attributes['textColor'] ) {
			$block_attributes['textColor'] = '#25282A';
		}
		$block_attributes['style']['color']['text'] = method_sanitize_theme_color( $block_attributes['textColor'] );
	}
    $blockcss = wp_style_engine_get_styles( $block_attributes['style'] );
	if ( ! method_check_array_key( $blockcss, 'css' ) ) {
		$blockcss['css'] = '';
	}

	return ' style="' . $blockcss['css'] . '"';
}

//-----------------------------------------------------
// This function ensures that all colors returned in
// inline CSS are in hex form instead of color slugs.
//-----------------------------------------------------

function method_sanitize_theme_color( $color ) {
	// These should match colors declared in theme.json
	$theme = array(
		'orange' => '#FD6110',
		'teal' => '#009CA6',
		'green' => '#78B320',
		'purple' => '#981D97',
		'blue' => '#0072CE',
		'darkblue' => '#13294B',
	);
	if ( method_check_array_key( $theme, $color ) ) {
		$color = $theme["{$color}"];
	}
	return $color;
}