<?php

add_action( 'enqueue_block_editor_assets', function() {
    // Register a placeholder script to attach localization to
    wp_register_script(
        'method-global-data',
        get_template_directory_uri() . '/assets/js/method-global-data.js', // Can be blank
        [],
        null,
        true
    );

    // Localize the breakpoints
    wp_localize_script( 'method-global-data', 'methodGlobalData', [
        'breakpoints' => method_get_block_breakpoints()
    ]);

    // Enqueue the script (editor only)
    wp_enqueue_script( 'method-global-data' );
});

//-----------------------------------------------------
// Register stylesheets for a 24 column Bootstrap grid
// and Method's blocks.
//-----------------------------------------------------

function method_block_assets() {
    wp_enqueue_style( 'method-global', get_stylesheet_directory_uri() . '/assets/css/global.css', ( ! is_admin() ? array('wp-block-library', 'wp-block-library-theme', 'global-styles') : '' ), METHOD_VERSION );
    wp_enqueue_style( 'method-bs-grid', get_stylesheet_directory_uri() . '/assets/css/bootstrap-grid.css', ( ! is_admin() ? array('wp-block-library', 'wp-block-library-theme', 'global-styles') : '' ), METHOD_VERSION );
}

add_action( 'enqueue_block_assets', 'method_block_assets' );

function mytheme_editor_styles() {
    add_editor_style( 'editor-style.css' ); // optional, if using classic style sheet

    wp_enqueue_style(
        'mytheme-editor-style',
        get_template_directory_uri() . '/editor-style.css',
        array( 'wp-edit-blocks' ), // Important!
        filemtime( get_template_directory() . '/editor-style.css' )
    );
}
add_action( 'enqueue_block_editor_assets', 'mytheme_editor_styles' );



add_theme_support( 'editor-styles' );
add_theme_support( 'wp-block-styles' );
add_theme_support( 'editor-color-palette' ); // Optional, legacy
add_theme_support( 'experimental-link-color' ); // If needed


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

	$new_category = array(
        'slug'  => 'method-container-blocks',
        'title' => 'Method Container Blocks'
    );

    // Prepend the new category to the beginning of the array.
    array_unshift( $categories, $new_category );

    return $categories;

} );


//-----------------------------------------------------
// Load Method's custom blocks.
//-----------------------------------------------------

require_once('blocks/method-advanced-grid/method-advanced-grid.php');
require_once('blocks/method-button/method-button.php');
require_once('blocks/method-buttons/method-buttons.php');
require_once('blocks/method-container-full/method-container-full.php');
require_once('blocks/method-grid/method-grid.php');
require_once('blocks/method-grid-item/method-grid-item.php');


//-----------------------------------------------------
// This function generates inline CSS for our PHP
// render functions.
//-----------------------------------------------------


function method_get_block_inline_styles( $block_attributes, $set_margins = true ) {
	if ( ! method_check_array_key( $block_attributes, 'style' ) ) {
		$block_attributes['style'] = [];
	}

	//echo '<pre>' . print_r( $block_attributes, true ) . '</pre>';

	// Set margins based off built-in controls
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
		$block_attributes['style']['color']['text'] = method_sanitize_theme_color( $block_attributes['textColor'] );
	}
	
    $blockcss = wp_style_engine_get_styles( $block_attributes['style'] );
	if ( ! method_check_array_key( $blockcss, 'css' ) ) {
		$blockcss['css'] = '';
	}
	if ( method_check_array_key( $block_attributes, 'style' ) ) {
		if ( method_check_array_key( $block_attributes['style'], 'spacing' ) ) {
			if ( method_check_array_key( $block_attributes['style']['spacing'], 'blockGap' ) ) {
				$blockcss['css'] .= 'gap:' . $block_attributes['style']['spacing']['blockGap'] . ';';
			}
		}
	}
	if ( method_check_array_key( $block_attributes, 'layout' ) ) {
		if ( method_check_array_key( $block_attributes['layout'], 'orientation' ) ) {
			$blockcss['css'] .= 'flex-direction:' . ( 'vertical' == $block_attributes['layout']['orientation'] ? 'column' : 'row' ) . ';';
		}
		if ( method_check_array_key( $block_attributes['layout'], 'justifyContent' ) ) {
			$blockcss['css'] .= 'justify-content:' . method_sanitize_flex_align( $block_attributes['layout']['justifyContent'] ) . ';';
		}
		if ( method_check_array_key( $block_attributes['layout'], 'verticalAlignment' ) ) {
			$blockcss['css'] .= 'align-items:' . method_sanitize_flex_align( $block_attributes['layout']['verticalAlignment'] ) . ';';
		}
	}

	//echo '<pre>' . print_r( $blockcss, true ) . '</pre>';

	return ' style="' . $blockcss['css'] . '"';
}

// Method's inline styles
function method_get_block_css_declarations( $block_attributes, $context = 'base', $cssprops = array(), $prioritize = false ) {
	$output = '';
	$suffix = ( $prioritize ? ' !important' : '' );
	if ( 0 === count( $cssprops ) ) {
		$cssprops = array(
			'padding-top',
			'padding-bottom',
			'padding-left',
			'padding-right',
			'margin-top',
			'margin-bottom',
			'margin-left',
			'margin-right',
			'gap',
			'gapAsVars',
			'font-size',
			'line-height',
			'color'
		);
	}
	$declarations = array();
	foreach( $cssprops as $cssprop ) {
		// Background Color
		if ( 'background-color' == $cssprop ) {
			if ( method_check_array_key( $block_attributes, 'backgroundColor' ) ) {
				$declarations['background-color'] = method_sanitize_theme_color( $block_attributes["backgroundColor"] ) . $suffix;
			}
		}

		// Color
		if ( 'color' == $cssprop ) {
			//$declarations['padding-top'] = '0' . $suffix;
			if ( method_check_array_key( $block_attributes, 'style' ) ) {
				if ( method_check_array_key( $block_attributes['style'], 'color' ) ) {
					if ( method_check_array_key( $block_attributes['style']['color'], 'text' ) ) {
				$declarations['color'] = method_sanitize_theme_color( $block_attributes['style']['color']['text'] ) . $suffix;
					}
				}
			}
		}

		// Line Height
		if ( 'line-height' == $cssprop ) {
			//$declarations['padding-top'] = '0' . $suffix;
			if ( method_check_array_key( $block_attributes, $context . 'LineHeight' ) ) {
				$declarations['line-height'] = $block_attributes["{$context}LineHeight"] . $suffix;
			}
		}

		// Font Size
		if ( 'font-size' == $cssprop ) {
			//$declarations['padding-top'] = '0' . $suffix;
			if ( method_check_array_key( $block_attributes, $context . 'FontSize' ) ) {
				$declarations['font-size'] = $block_attributes["{$context}FontSize"] . $suffix;
			}
		}

		// Padding Top
		if ( 'padding-top' == $cssprop ) {
			$declarations['padding-top'] = '0' . $suffix;
			if ( method_check_array_key( $block_attributes, $context . 'Padding' ) ) {
				if ( method_check_array_key( $block_attributes["{$context}Padding"], 'top' ) ) {
					$declarations['padding-top'] = $block_attributes["{$context}Padding"]['top'] . $suffix;
				}
			}
		}

		// Padding Bottom
		if ( 'padding-bottom' == $cssprop ) {
			$declarations['padding-bottom'] = '0' . $suffix;
			if ( method_check_array_key( $block_attributes, $context . 'Padding' ) ) {
				if ( method_check_array_key( $block_attributes["{$context}Padding"], 'bottom' ) ) {
					$declarations['padding-bottom'] = $block_attributes["{$context}Padding"]['bottom'] . $suffix;
				}
			}
		}

		// Padding Left
		if ( 'padding-left' == $cssprop ) {
			$declarations['padding-left'] = '0' . $suffix;
			if ( method_check_array_key( $block_attributes, $context . 'Padding' ) ) {
				if ( method_check_array_key( $block_attributes["{$context}Padding"], 'left' ) ) {
					$declarations['padding-left'] = $block_attributes["{$context}Padding"]['left'] . $suffix;
				}
			}
		}

		// Padding Right
		if ( 'padding-right' == $cssprop ) {
			$declarations['padding-right'] = '0' . $suffix;
			if ( method_check_array_key( $block_attributes, $context . 'Padding' ) ) {
				if ( method_check_array_key( $block_attributes["{$context}Padding"], 'right' ) ) {
					$declarations['padding-right'] = $block_attributes["{$context}Padding"]['right'] . $suffix;
				}
			}
		}

		// Margin Top
		if ( 'margin-top' == $cssprop ) {
			$declarations['margin-top'] = '0' . $suffix;
			if ( method_check_array_key( $block_attributes, $context . 'Margin' ) ) {
				if ( method_check_array_key( $block_attributes["{$context}Margin"], 'top' ) ) {
					$declarations['margin-top'] = $block_attributes["{$context}Margin"]['top'] . $suffix;
				}
			}
		}

		// Margin Bottom
		if ( 'margin-bottom' == $cssprop ) {
			$declarations['margin-bottom'] = '0' . $suffix;
			if ( method_check_array_key( $block_attributes, $context . 'Margin' ) ) {
				if ( method_check_array_key( $block_attributes["{$context}Margin"], 'bottom' ) ) {
					$declarations['margin-bottom'] = $block_attributes["{$context}Margin"]['bottom'] . $suffix;
				}
			}
		}

		// Margin Left
		if ( 'margin-left' == $cssprop ) {
			$declarations['margin-left'] = '0' . $suffix;
			if ( method_check_array_key( $block_attributes, $context . 'Margin' ) ) {
				if ( method_check_array_key( $block_attributes["{$context}Margin"], 'left' ) ) {
					$declarations['margin-left'] = $block_attributes["{$context}Margin"]['left'] . $suffix;
				}
			}
		}

		// Margin Right
		if ( 'margin-right' == $cssprop ) {
			$declarations['margin-right'] = '0' . $suffix;
			if ( method_check_array_key( $block_attributes, $context . 'Margin' ) ) {
				if ( method_check_array_key( $block_attributes["{$context}Margin"], 'right' ) ) {
					$declarations['margin-right'] = $block_attributes["{$context}Margin"]['right'] . $suffix;
				}
			}
		}

		// Gap
		if ( 'gap' == $cssprop ) {
			$declarations['gap'] = '0' . $suffix;
			if ( method_check_array_key( $block_attributes, $context . 'Gap' ) ) {
				$gapy = '0';
				$gapx = '0';
				if ( method_check_array_key( $block_attributes["{$context}Gap"], 'top' ) ) {
					$gapy = $block_attributes["{$context}Gap"]['top'];
				}
				if ( method_check_array_key( $block_attributes["{$context}Gap"], 'left' ) ) {
					$gapx = $block_attributes["{$context}Gap"]['left'];
				}
				$declarations['gap'] = $gapy . ' ' . $gapx . $suffix;
			}
		}

		// Gap alt
		if ( 'gapAsVars' == $cssprop ) {
			if ( method_check_array_key( $block_attributes, $context . 'Gap' ) ) {
				$declarations['--bs-gutter-x'] = '1.5rem' . $suffix;
				if ( method_check_array_key( $block_attributes["{$context}Gap"], 'left' ) ) {
					$declarations['--bs-gutter-x'] = $block_attributes["{$context}Gap"]['left'] . $suffix;
				}
				$declarations['--bs-gutter-y'] = '0' . $suffix;
				if ( method_check_array_key( $block_attributes["{$context}Gap"], 'top' ) ) {
					$declarations['--bs-gutter-y'] = $block_attributes["{$context}Gap"]['top'] . $suffix;
				}
			} else {
				$declarations['--bs-gutter-x'] = '1.5rem' . $suffix;
				$declarations['--bs-gutter-y'] = '0' . $suffix;
			}
		}

	}
	foreach( $declarations as $key => $value ) {
		$output .= $key . ':' . $value . ';';
	}
	return $output;
}

function method_get_block_media_query_declarations( $block_attributes, $context = '', $cssprops = array(), $cssSelector ) {
	$output = '';
	
	if ( ( 'mobile' == $context ) || ( 'tablet' == $context ) || ( 'wide' == $context ) ) {
		$output .= $cssSelector . ' {' . method_get_block_css_declarations( $block_attributes, $context, $cssprops, true ) . '} ';
	}
	
	return $output;
}


function method_get_block_responsive_styles( $block_attributes, $selectors = array() ) {
	$output = '';
	$ranges = array( 'mobile', 'tablet', 'wide' );
	if ( is_array( $selectors ) ) {
		if ( 0 < count( $selectors ) ) {
			$bps = method_get_block_breakpoints();
			$output = '<style>';
			foreach( $ranges as $range ) {
				if ( method_check_array_key( $block_attributes, 'custom' . ucfirst( $range ) ) ) {
					$output .= '/* ' . $range . ' */ ';
					if ( 'mobile' == $range ) {
						$output .= ' @media (max-width:' . $bps['mobile_max'] . ') { ';
					}
					if ( 'tablet' == $range ) {
						$output .= ' @media (min-width:' . $bps['tablet_min'] . ') and (max-width:' . $bps['tablet_max'] . ') { ';
					}
					if ( 'wide' == $range ) {
						$output .= ' @media (min-width:' . $bps['wide_min'] . ') { ';
					}
					foreach ( $selectors as $key => $value ) {
						$output .= method_get_block_media_query_declarations( $block_attributes, $range, $value, $key );
					}
					$output .= '} ';
				}
			}
			$output .= '</style>';
		}
	}
	return $output;
}

//-----------------------------------------------------
// This function ensures that all colors returned in
// inline CSS are in hex form instead of color slugs.
//-----------------------------------------------------

function method_sanitize_theme_color( $color ) {
	// These should match colors declared in theme.json
	$theme = array(
		'method-cabaret' => '#D94A64',
		'method-fuchsia' => '#865EBF',
		'method-orange' => '#F28729',
		'method-pomegranate' => '#F24C27',
		'method-cocoa' => '#592222',
		'light' => '#ffffff',
		'dark' => '#25282A'
	);
	if ( method_check_array_key( $theme, $color ) ) {
		$color = $theme["{$color}"];
	}
	return $color;
}

function method_sanitize_flex_align( $align ) {
	$alignments = array(
		'left' => 'flex-start',
		'right' => 'flex-end',
		'top' => 'flex-start',
		'bottom' => 'flex-end',
	);
	if ( method_check_array_key( $alignments, $align ) ) {
		$align = $alignments["{$align}"];
	}
	return $align;
}