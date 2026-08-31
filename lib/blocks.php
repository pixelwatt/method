<?php

add_action( 'enqueue_block_assets', function() {
    // Register a placeholder script to attach localization to
	if ( ! is_admin() ) {
        return;
    }
    wp_register_script(
        'method-global-data',
        get_template_directory_uri() . '/assets/js/method-global-data.js', // Can be blank
        [],
        null,
        true
    );

    // Localize the breakpoints
    wp_localize_script( 'method-global-data', 'methodGlobalData', [
		'breakpointPrefixes' => method_get_breakpoint_class_prefixes(),
        'breakpoints' => method_get_block_breakpoints(),
		'breakpointColors' => method_get_breakpoint_colors(),
		'fontSizePresets' => method_get_font_size_presets(),
		'bsBreakpoints' => method_get_all_bs_breakpoint_options(),
		'socialNavItems' => method_build_social_nav_items(),
		'icons' => method_get_theme_icons(),
    ]);

    // Enqueue the script (editor only)
    wp_enqueue_script( 'method-global-data' );
});


add_theme_support( 'editor-styles' );
add_theme_support( 'wp-block-styles' );
add_theme_support( 'editor-color-palette' ); // Optional, legacy
add_theme_support( 'experimental-link-color' ); // If needed


//-----------------------------------------------------
// Register stylesheets for a 24 column Bootstrap grid
// and Method's blocks.
//-----------------------------------------------------

function method_block_assets() {
	if ( ! is_admin() ) {
    	wp_enqueue_style( 'method-global', get_template_directory_uri() . '/assets/css/global.min.css', array('wp-block-library', 'wp-block-library-theme', 'global-styles'), METHOD_VERSION );
    	wp_enqueue_style( 'method-bs-grid', get_template_directory_uri() . '/assets/css/bootstrap-grid.css', array('wp-block-library', 'wp-block-library-theme', 'global-styles'), METHOD_VERSION );
	} else {
		// Even though global styles are now being loaded via add_editor_style, we still need to
		// load styles for editor UI that falls outside of the iFrame, which is done below.
		wp_enqueue_style( 'method-editorui', get_template_directory_uri() . '/assets/css/editorui.min.css', array(), METHOD_VERSION );
	}
}

add_action( 'enqueue_block_assets', 'method_block_assets' );


add_action('after_setup_theme', function() {
    add_editor_style( get_parent_theme_file_uri( 'assets/css/global.min.css' ) );
	add_editor_style( get_parent_theme_file_uri( 'assets/css/bootstrap-grid.css' ) );
});


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

require_once('blocks/method-accordion/method-accordion.php');
require_once('blocks/method-advanced-grid/method-advanced-grid.php');
require_once('blocks/method-basic-grid/method-basic-grid.php');
require_once('blocks/method-bc/method-bc.php');
//require_once('blocks/method-bootstrap-tabs/method-bootstrap-tabs.php');
require_once('blocks/method-buttons/method-buttons.php');
require_once('blocks/method-container/method-container.php');
require_once('blocks/method-core-extensions/method-core-extensions.php');
require_once('blocks/method-fitted-image/method-fitted-image.php');
require_once('blocks/method-flex/method-flex.php');
require_once('blocks/method-fluid-video/method-fluid-video.php');
require_once('blocks/method-looping-alert/method-looping-alert.php');
//require_once('blocks/method-navbar/method-navbar.php');
require_once('blocks/method-scrollspy/method-scrollspy.php');
require_once('blocks/method-section/method-section.php');
require_once('blocks/method-social-nav/method-social-nav.php');
require_once('blocks/method-swiper/method-swiper.php');
require_once('blocks/method-swiper-gallery/method-swiper-gallery.php');


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

// This function will be refactored in the very near future. Its nightmarish existence
// in its current form is the result of tight deadlines and a lot, and I mean a lot, of
// sleep deprivation.
function method_get_block_css_declarations( $block_attributes, $context = 'base', $cssprops = array(), $prioritize = false, $post_id = false ) {
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
	// Check to see if certain declations should be generated for this breakpoint
	$customBg = false;
	if ( 'base' == $context ) {
		$customBg = true;
	} elseif ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
		if ( method_check_array_key( $block_attributes["responsiveSettings"][$context], 'customBg' ) ) {
			$customBg = true;
		}
	}

	$declarations = array();
	foreach( $cssprops as $cssprop ) {
		if ( 'base' == $context ) {
			if ( 'aspectRatio' == $cssprop ) {
				$aspectUses = method_get_responsive_setting( $block_attributes, 'base', 'aspectUses' );
				if ( $aspectUses ) {
					if ( 'height' === $aspectUses ) {
						$aspectHeight = method_get_responsive_setting( $block_attributes, 'base', 'height', '0px' );
						$declarations['height'] = $aspectHeight . $suffix;
						$declarations['padding-top'] = '0' . $suffix;
					}
					if ( 'percentage' === $aspectUses ) {
						$aspectPercentage = method_get_responsive_setting( $block_attributes, 'base', 'aspectPercentage', '0%' );
						$declarations['height'] = '0' . $suffix;
						$declarations['padding-top'] = $aspectPercentage . $suffix;
					}
				}
			}
		}
		// Background Color
		if ( 'boxShadow' == $cssprop ) {
			if ( 'base' == $context ) {
				$shadows = method_get_responsive_setting( $block_attributes, 'base', 'shadows' );
				if ( $shadows && is_array( $shadows ) && count( $shadows ) > 0 ) {
					$shadow_parts = array();
					foreach ( $shadows as $shadow ) {
						$defaults = array(
							'x' => 0,
							'y' => 0,
							'blur' => 0,
							'spread' => 0,
							'color' => 'rgba(0,0,0,0)',
							'inset' => false,
						);
						$shadow = wp_parse_args( $shadow, $defaults );
						$inset = ( ! empty( $shadow['inset'] ) ? 'inset ' : '' );
						$shadow_parts[] = $inset . $shadow['x'] . 'px ' . $shadow['y'] . 'px ' . $shadow['blur'] . 'px ' . $shadow['spread'] . 'px ' . $shadow['color'];
					}
					$declarations['box-shadow'] = implode( ', ', $shadow_parts );
				}
			}
		}
		if ( 'bgColor' == $cssprop ) {
			$bgColor = '';
			if ( method_check_array_key( $block_attributes, 'bgGradient' ) ) {
				$bgColor = $block_attributes['bgGradient'];
			} elseif ( method_check_array_key( $block_attributes, 'bgColor' ) ) {
				$bgColor = $block_attributes['bgColor'];
			}
			if ( ! empty( $bgColor ) ) {
				$declarations['background'] = method_sanitize_theme_color( $bgColor ) . $suffix;
			}
		}

		// Background Shade
		if ( 'bgShade' == $cssprop ) {
			$bgColor = '';
			if ( method_check_array_key( $block_attributes, 'bgShadeGradient' ) ) {
				$bgColor = $block_attributes['bgShadeGradient'];
			} elseif ( method_check_array_key( $block_attributes, 'bgShadeColor' ) ) {
				$bgColor = $block_attributes['bgShadeColor'];
			}
			if ( ! empty( $bgColor ) ) {
				$declarations['background'] = method_sanitize_theme_color( $bgColor ) . $suffix;
			}
		}

		// Background Alignment
		if ( 'bgAlign' == $cssprop ) {
			if ( method_check_array_key( $block_attributes, 'bgImgAlign' ) ) {
				$position = $block_attributes['bgImgAlign'];
				$position_array = explode( ' ', $position );
				$position_array = array_reverse( $position_array );
				$position = implode( ' ', $position_array );
				$declarations['object-position'] = $position . $suffix;
			}
		}

		// Color
		if ( ( 'color' == $cssprop ) || ( 'textColor' == $cssprop ) ) {
			if ( method_check_array_key( $block_attributes, 'textColor' ) ) {
				$declarations['color'] = method_sanitize_theme_color( $block_attributes['textColor'] ) . $suffix;
			}
		}

		// Link Color
		if ( 'linkColor' == $cssprop ) {
			if ( method_check_array_key( $block_attributes, 'linkColor' ) ) {
				$declarations['color'] = method_sanitize_theme_color( $block_attributes['linkColor'] ) . $suffix;
			}
		}

		// Link Color (Hover)
		if ( 'linkHoverColor' == $cssprop ) {
			if ( method_check_array_key( $block_attributes, 'linkHoverColor' ) ) {
				$declarations['color'] = method_sanitize_theme_color( $block_attributes['linkHoverColor'] ) . $suffix;
			}
		}

		// Link Color (Hover)
		if ( 'linkActiveColor' == $cssprop ) {
			if ( method_check_array_key( $block_attributes, 'linkActiveColor' ) ) {
				$declarations['color'] = method_sanitize_theme_color( $block_attributes['linkActiveColor'] ) . $suffix;
			}
		}

		if ( 'aspectRatioDimension' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'aspectRatioX' ) && method_get_responsive_setting( $block_attributes, $context, 'aspectRatioY' ) ) {
				$declarations['aspect-ratio'] = method_get_responsive_setting( $block_attributes, $context, 'aspectRatioX' ) . '/' . method_get_responsive_setting( $block_attributes, $context, 'aspectRatioY' ) . $suffix;
			}
		}

		if ( $customBg ) {

			if ( 'bgPosition' == $cssprop ) {
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'bgImgAlign' ) ) {
						$pos_values = array();
						$pos = explode( ' ', $block_attributes["responsiveSettings"]["{$context}"]['bgImgAlign'] );
						$pos_values[] = $pos[1];
						if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'bgOffsetX' ) ) {
							$pos_values[] = $block_attributes["responsiveSettings"]["{$context}"]['bgOffsetX'];
						}
						$pos_values[] = $pos[0];
						if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'bgOffsetY' ) ) {
							$pos_values[] = $block_attributes["responsiveSettings"]["{$context}"]['bgOffsetY'];
						}
						$declarations['background-position'] = implode( ' ', $pos_values );
					} else {
						$declarations['background-position'] = 'center center';
					}
				}
			}

			if ( 'bgImg' == $cssprop ) {
				if ( method_check_array_key( $block_attributes, 'useFeaturedImage' ) ) {
					$chosenSize = method_get_responsive_setting( $block_attributes, $context, 'featuredImageSize', 'full' );
					$chosenImg = get_the_post_thumbnail_url( $post_id, $chosenSize );
					if ( $chosenImg ) {
						$declarations['background-image'] = ' url("' . $chosenImg . '")';
					}
				} elseif ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'bgImgSize' ) ) {
						$csize = $block_attributes["responsiveSettings"]["{$context}"]['bgImgSize'];
						if ( method_check_array_key( $block_attributes, 'bgImg' ) ) {
							if ( method_check_array_key( $block_attributes['bgImg'], $csize ) ) {
								if ( method_check_array_key( $block_attributes['bgImg']["{$csize}"], 'url' ) ) {
									$declarations['background-image'] = ' url("' . $block_attributes['bgImg']["{$csize}"]['url'] . '")';
								}
							}
						}
					}
				}
			}

			if ( 'bgSize' == $cssprop ) {
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'bgDisplaySize' ) ) {
						$dsize = $block_attributes["responsiveSettings"]["{$context}"]['bgDisplaySize'];
						if ( ( 'cover' == $dsize ) || ( 'contain' == $dsize ) ) {
							$declarations['background-size'] = $dsize;
						} elseif ( 'custom' == $dsize ) {
							if ( ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'bgWidth' ) ) && ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'bgHeight' ) ) ) {
								if ( ( ! str_starts_with( $block_attributes["responsiveSettings"]["{$context}"]['bgWidth'], '0' ) ) && ( ! str_starts_with( $block_attributes["responsiveSettings"]["{$context}"]['bgHeight'], '0' ) ) ) {
									$declarations['background-size'] = $block_attributes["responsiveSettings"]["{$context}"]['bgWidth'] . ' ' . $block_attributes["responsiveSettings"]["{$context}"]['bgHeight'];
								}
							}
						}
					}
				}
			}

			if ( 'bgRepeat' == $cssprop ) {
				$declarations['background-repeat'] = 'no-repeat';
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'bgRepeat' ) ) {
						$declarations['background-repeat'] = $block_attributes["responsiveSettings"]["{$context}"]['bgRepeat'];
					}
				}
			}

		}

		if ( 'borderRadius' == $cssprop ) {
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'borderRadius' ) ) {
						if ( is_string( $block_attributes["responsiveSettings"]["{$context}"]['borderRadius'] ) ) {
							if ( ! str_starts_with( $block_attributes["responsiveSettings"]["{$context}"]['borderRadius'], '0' ) ) {
								$declarations['border-radius'] = $block_attributes["responsiveSettings"]["{$context}"]['borderRadius'];
							}
						}
						if ( is_array( $block_attributes["responsiveSettings"]["{$context}"]['borderRadius'] ) ) {
							if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"]['borderRadius'], 'topLeft' ) ) {
								$corners = array();
								foreach ( $block_attributes["responsiveSettings"]["{$context}"]['borderRadius'] as $key => $value ) {
									$corners["{$key}"] = ( ! str_starts_with( $value, '0' ) ? $value : 'inherit' );
								}
								$declarations['border-top-left-radius'] = $corners['topLeft'];
								$declarations['border-top-right-radius'] = $corners['topRight'];
								$declarations['border-bottom-left-radius'] = $corners['bottomLeft'];
								$declarations['border-bottom-right-radius'] = $corners['bottomRight'];
							}
						}
					}
				}
			}

		if ( 'border' == $cssprop ) {
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'border' ) ) {
						$border = $block_attributes["responsiveSettings"]["{$context}"]['border'];
						if ( method_check_array_key( $border, 'width' ) ) {
							if ( ! str_starts_with( $border['width'], '0' ) ) {
								$declarations['border'] = $border['width'] . ' ' . ( method_check_array_key( $border, 'style' ) ? $border['style'] : 'solid' ) . ' ' . ( method_check_array_key( $border, 'color' ) ? $border['color'] : 'rgba(0,0,0,0)' );
							}
						} elseif ( ( method_check_array_key( $border, 'top' ) ) || ( method_check_array_key( $border, 'bottom' ) ) || ( method_check_array_key( $border, 'left' ) ) || ( method_check_array_key( $border, 'right' ) ) ) {
							foreach ( $border as $key => $value ) {
								if ( ! str_starts_with( $value["width"], '0' ) ) {
									$declarations["border-{$key}"] = $value["width"] . ' ' . ( method_check_array_key( $value, 'style' ) ? $value['style'] : 'solid' ) . ' ' . ( method_check_array_key( $value, 'color' ) ? $value['color'] : 'rgba(0,0,0,0)' );
								}
							}
						}
					}
				}
			}

		if ( 'flexDirection' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'flexDirection', 'row' ) ) {
				$declarations['flex-direction'] = method_get_responsive_setting( $block_attributes, $context, 'flexDirection' ) . $suffix;
			}
		}

		if ( 'alignItems' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'alignItems' ) ) {
				$declarations['align-items'] = method_get_responsive_setting( $block_attributes, $context, 'alignItems' ) . $suffix;
			}
		}

		if ( 'justifyContent' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'justifyContent' ) ) {
				$declarations['justify-content'] = method_get_responsive_setting( $block_attributes, $context, 'justifyContent' ) . $suffix;
			}
		}

		if ( 'overflow' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'overflow' ) ) {
				$declarations['overflow'] = method_get_responsive_setting( $block_attributes, $context, 'overflow' ) . $suffix;
			}
		}

		if ( 'zeroHeight' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'zeroHeight' ) ) {
				$declarations['height'] = '0px' . $suffix;
				$declarations['overflow'] = 'visible' . $suffix;
			} elseif ( ( 'base' != $context ) && ( isset( $block_attributes['responsiveSettings']['base']['zeroHeight'] ) ) && ( isset( $block_attributes['responsiveSettings']["{$context}"]['zeroHeight'] ) ) ) {
				if ( ( true === $block_attributes['responsiveSettings']['base']['zeroHeight'] ) && ( false === $block_attributes['responsiveSettings']["{$context}"]['zeroHeight'] ) ) {
					$declarations['height'] = 'unset' . $suffix;
					$declarations['overflow'] = 'unset' . $suffix;
				}
			}
		}

		if ( 'hide' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'hide' ) ) {
				$declarations['display'] = 'none' . $suffix;
				$declarations['visibility'] = 'hidden' . $suffix;
			}
		}

		if ( 'zIndex' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'zIndex' ) ) {
				$declarations['z-index'] = method_get_responsive_setting( $block_attributes, $context, 'zIndex' ) . $suffix;
			}
		}

		if ( 'flexGrow' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'flexGrow' ) ) {
				$declarations['flex-grow'] = method_get_responsive_setting( $block_attributes, $context, 'flexGrow' ) . $suffix;
			}
		}

		if ( 'flexShrink' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'flexShrink' ) ) {
				$declarations['flex-shrink'] = method_get_responsive_setting( $block_attributes, $context, 'flexShrink' ) . $suffix;
			}
		}

		if ( 'flexBasis' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'flexBasis' ) ) {
				$declarations['flex-basis'] = method_get_responsive_setting( $block_attributes, $context, 'flexBasis' ) . $suffix;
			}
		}

		if ( 'order' == $cssprop ) {
			if ( ( ! empty ( method_get_responsive_setting( $block_attributes, $context, 'order' ) ) ) && ( '0' != method_get_responsive_setting( $block_attributes, $context, 'order' ) ) ) {
				$declarations['order'] = method_get_responsive_setting( $block_attributes, $context, 'order' ) . $suffix;
			}
		}

		if ( 'equalDimensions' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'dimensions' ) ) {
				if ( ! str_starts_with( method_get_responsive_setting( $block_attributes, $context, 'dimensions' ), '0' ) ) {
					$declarations['width'] = method_get_responsive_setting( $block_attributes, $context, 'dimensions' ) . $suffix;
					$declarations['height'] = method_get_responsive_setting( $block_attributes, $context, 'dimensions' ) . $suffix;
				}
			}
		}

		// Min Height
		if ( 'minHeight' == $cssprop ) {
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'minHeight' ) ) {
						if ( ! str_starts_with( $block_attributes["responsiveSettings"]["{$context}"]['minHeight'], '0' ) ) {
							$declarations['min-height'] = $block_attributes["responsiveSettings"]["{$context}"]['minHeight'] . $suffix;
						}
					}
				}
			}
			// Min Width
			if ( 'minWidth' == $cssprop ) {
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'minWidth' ) ) {
						if ( ! str_starts_with( $block_attributes["responsiveSettings"]["{$context}"]['minWidth'], '0' ) ) {
							$declarations['min-width'] = $block_attributes["responsiveSettings"]["{$context}"]['minWidth'] . $suffix;
						}
					}
				}
			}
			// Width + Height
			if ( ( 'width' == $cssprop ) || ( 'height' == $cssprop ) ) {
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], $cssprop ) ) {
						if ( ! str_starts_with( $block_attributes["responsiveSettings"]["{$context}"]["{$cssprop}"], '0' ) ) {
							$declarations["{$cssprop}"] = $block_attributes["responsiveSettings"]["{$context}"]["{$cssprop}"] . $suffix;
						}
					}
				}
			}

		// Line Height
		if ( ( 'line-height' == $cssprop ) || ( 'lineHeight' == $cssprop ) ) {
			if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
				if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'lineHeight' ) ) {
					$declarations['line-height'] = $block_attributes["responsiveSettings"]["{$context}"]['lineHeight'] . $suffix;
				}
			}
		}

		// Font Size
		if ( ( 'font-size' == $cssprop ) || ( 'fontSize' == $cssprop ) ) {
			if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
				if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'fontSize' ) ) {
					$declarations['font-size'] = $block_attributes["responsiveSettings"]["{$context}"]['fontSize']  . $suffix;
				}
			}
		}

		if ( ( 'text-align' == $cssprop ) || ( 'textAlign' == $cssprop ) ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'textAlign' ) ) {
				$declarations['text-align'] = method_get_responsive_setting( $block_attributes, $context, 'textAlign' ) . $suffix;
			}
		}

		if ( 'fontFamily' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'fontFamily' ) ) {
				$declarations['font-family'] = method_get_responsive_setting( $block_attributes, $context, 'fontFamily' ) . $suffix;
			}
		}

		if ( 'fontStyle' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'fontStyle' ) ) {
				$declarations['font-style'] = method_get_responsive_setting( $block_attributes, $context, 'fontStyle' ) . $suffix;
			}
		}

		if ( 'fontWeight' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'fontWeight' ) ) {
				$declarations['font-weight'] = method_get_responsive_setting( $block_attributes, $context, 'fontWeight' ) . $suffix;
			}
		}

		if ( 'textTransform' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'textTransform' ) ) {
				$declarations['text-transform'] = method_get_responsive_setting( $block_attributes, $context, 'textTransform' ) . $suffix;
			}
		}

		if ( 'letterSpacing' == $cssprop ) {
			if ( method_get_responsive_setting( $block_attributes, $context, 'letterSpacing' ) ) {
				$declarations['letter-spacing'] = method_get_responsive_setting( $block_attributes, $context, 'letterSpacing' ) . $suffix;
			}
		}

		// Padding Top
		if ( 'padding-top' == $cssprop ) {
				//$declarations['padding-top'] = '0' . $suffix;
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'padding' ) ) {
						if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"]["padding"], 'top' ) ) {
							$declarations['padding-top'] = $block_attributes["responsiveSettings"]["{$context}"]['padding']['top'] . $suffix;
						}
					}
				}
			}

			// Padding Bottom
			if ( 'padding-bottom' == $cssprop ) {
				//$declarations['padding-bottom'] = '0' . $suffix;
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'padding' ) ) {
						if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"]["padding"], 'bottom' ) ) {
							$declarations['padding-bottom'] = $block_attributes["responsiveSettings"]["{$context}"]['padding']['bottom'] . $suffix;
						}
					}
				}
			}

			// Padding Left
			if ( 'padding-left' == $cssprop ) {
				//$declarations['padding-left'] = '0' . $suffix;
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'padding' ) ) {
						if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"]["padding"], 'left' ) ) {
							$declarations['padding-left'] = $block_attributes["responsiveSettings"]["{$context}"]['padding']['left'] . $suffix;
						}
					}
				}
			}

			// Padding Right
			if ( 'padding-right' == $cssprop ) {
				//$declarations['padding-right'] = '0' . $suffix;
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'padding' ) ) {
						if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"]["padding"], 'right' ) ) {
							$declarations['padding-right'] = $block_attributes["responsiveSettings"]["{$context}"]['padding']['right'] . $suffix;
						}
					}
				}
			}

			// Margin Top
			if ( ( 'margin-top' == $cssprop ) || ( 'marginTop' == $cssprop ) || ( 'marginTopNonZero' == $cssprop ) ) {
				//$declarations['margin-top'] = '0' . $suffix;
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'margin' ) ) {
						if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"]["margin"], 'top' ) ) {
							if ( ( 'marginTopNonZero' != $cssprop ) || ( ! str_starts_with( $block_attributes["responsiveSettings"]["{$context}"]['margin']['top'], '0' ) ) ) {
								$declarations['margin-block-start'] = $block_attributes["responsiveSettings"]["{$context}"]['margin']['top'] . $suffix;
							}
						}
					}
				}
			}

			// Margin Bottom
			if ( ( 'margin-bottom' == $cssprop ) || ( 'marginBottom' == $cssprop ) || ( 'marginBottomNonZero' == $cssprop ) ) {
				//$declarations['margin-bottom'] = '0' . $suffix;
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'margin' ) ) {
						if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"]["margin"], 'bottom' ) ) {
							if ( ( 'marginBottomNonZero' != $cssprop ) || ( ! str_starts_with( $block_attributes["responsiveSettings"]["{$context}"]['margin']['bottom'], '0' ) ) ) {
								$declarations['margin-block-end'] = $block_attributes["responsiveSettings"]["{$context}"]['margin']['bottom'] . $suffix;
							}
						}
					}
				}
			}

			// Margin Left
			if ( ( 'margin-left' == $cssprop ) || ( 'marginLeft' == $cssprop ) || ( 'marginLeftNonZero' == $cssprop ) ) {
				//$declarations['margin-left'] = '0' . $suffix;
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'margin' ) ) {
						if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"]["margin"], 'left' ) ) {
							if ( ( 'marginLeftNonZero' != $cssprop ) || ( ! str_starts_with( $block_attributes["responsiveSettings"]["{$context}"]['margin']['left'], '0' ) ) ) {
								$declarations['margin-left'] = $block_attributes["responsiveSettings"]["{$context}"]['margin']['left'] . $suffix;
							}
						}
					}
				}
			}

			// Margin Right
			if ( ( 'margin-right' == $cssprop ) || ( 'marginRight' == $cssprop ) || ( 'marginRightNonZero' == $cssprop ) ) {
				//$declarations['margin-right'] = '0' . $suffix;
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'margin' ) ) {
						if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"]["margin"], 'right' ) ) {
							if ( ( 'marginRightNonZero' != $cssprop ) || ( ! str_starts_with( $block_attributes["responsiveSettings"]["{$context}"]['margin']['right'], '0' ) ) ) {
								$declarations['margin-right'] = $block_attributes["responsiveSettings"]["{$context}"]['margin']['right'] . $suffix;
							}
						}
					}
				}
			}

			// Gap
			if ( 'gap' == $cssprop ) {
				if ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) {
					if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"], 'gap' ) ) {
						$gapy = '0';
						$gapx = '0';
						if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"]["gap"], 'top' ) ) {
							$declarations['row-gap'] = $block_attributes["responsiveSettings"]["{$context}"]['gap']['top'] . $suffix;
						}
						if ( method_check_array_key( $block_attributes["responsiveSettings"]["{$context}"]["gap"], 'left' ) ) {
							$declarations['column-gap'] = $block_attributes["responsiveSettings"]["{$context}"]['gap']['left'] . $suffix;
						}
					}
				}
			}

			// Gap alt
			if ( 'gapAsVars' == $cssprop ) {
				$gap = method_get_responsive_setting( $block_attributes, $context, 'gap' );
				if ( method_check_array_key( $gap, 'top' ) ) {
					$declarations['--bs-gutter-y'] = $gap['top'] . $suffix;
				} else {
					$declarations['--bs-gutter-y'] = '0' . $suffix;
				}

				if ( method_check_array_key( $gap, 'left' ) ) {
					$declarations['--bs-gutter-x'] = $gap['left'] . $suffix;
				} else {
					$declarations['--bs-gutter-x'] = '1.5rem' . $suffix;
				}
			}

	}
	foreach( $declarations as $key => $value ) {
		$output .= $key . ':' . $value . '; ';
	}
	return $output;
}

function method_get_block_media_query_declarations( $block_attributes, $context = '', $cssprops = array(), $cssSelector = '', $post_id = false ) {
	$output = '';
	$declarations = method_get_block_css_declarations( $block_attributes, $context, $cssprops, true, $post_id );
	$output .= ( ! empty( $declarations ) ? $cssSelector . ' {' . $declarations . '} ' : '' );
	return $output;
}


function method_get_block_responsive_styles( $block_attributes, $selectors = array(), $ranges = array( 'mobile', 'tablet', 'wide' ), $wrap = true, $post_id = false ) {
	$output = '';
	if ( is_array( $selectors ) ) {
		if ( 0 < count( $selectors ) ) {
			$bps = method_get_block_breakpoints();
			$output .= ( $wrap ? '<style>' : '' );
			foreach( $ranges as $range ) {
				$rangeOut = '';
				$rangeOut .= '/* ' . $range . ' */ ';
				if ( 'mobile' == $range ) {
					$rangeOut .= ' @media (max-width:' . $bps['mobile_max'] . ') { ';
				}
				if ( 'tablet' == $range ) {
					$rangeOut .= ' @media (min-width:' . $bps['tablet_min'] . ') and (max-width:' . $bps['tablet_max'] . ') { ';
				}
				if ( 'wide' == $range ) {
					$rangeOut .= ' @media (min-width:' . $bps['wide_min'] . ') { ';
				}
				foreach ( $selectors as $key => $value ) {
					$rangeOut .= method_get_block_media_query_declarations( $block_attributes, $range, $value, $key, $post_id );
				}
				if ( 'base' != $range ) {
					$rangeOut .= '} ';
				}
				if ( 'base' == $range ) {
					$output .= $rangeOut;
				} elseif ( ( method_check_array_key( $block_attributes, 'responsiveSettings' ) ) ) {
					if ( ( method_check_array_key( $block_attributes['responsiveSettings'], $range ) ) ) {
						if ( ( method_check_array_key( $block_attributes['responsiveSettings'][$range], 'enabled' ) ) ) {
							$output .= $rangeOut;
						}
					}
				}
			}
			$output .= ( $wrap ? '</style>' : '' );
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

function myplugin_inline_editor_styles() {
	$custom_css = '';
	$colors = method_get_breakpoint_colors();
	$ranges = array( 'mobile', 'tablet', 'wide' );
	foreach ( $ranges as $range ) {
		$custom_css .= '
			.method-tab-' . $range . '.components-tab-panel__tabs-item:after {
				background-color: ' . $colors["{$range}"] . ';
			}
			.method-responsive-control-tab-' . $range . ' .components-range-control__track {
				background: ' . $colors["{$range}"] . ' !important;
				color: ' . $colors["{$range}"] . ' !important;
			}
			.method-responsive-control-tab-' . $range . ' .components-range-control__thumb-wrapper,
			.method-responsive-control-tab-' . $range . ' .components-range-control__thumb-wrapper span {
				background-color: ' . $colors["{$range}"] . ' !important;
			}
			.method-responsive-control-tab-' . $range . ' .components-form-toggle .components-form-toggle__input {
				border-color: ' . $colors["{$range}"] . ' !important;
				box-shadow: 0 0 0 1px ' . $colors["{$range}"] . ' !important;
			}
			.method-responsive-control-tab-' . $range . ' .components-form-toggle .components-form-toggle__input:focus+.components-form-toggle__track {
				box-shadow: 0 0 0 var(--wp-admin-border-width-focus) #fff,0 0 0 calc(var(--wp-admin-border-width-focus)*2) ' . $colors["{$range}"] . ';
				border-color: ' . $colors["{$range}"] . ' !important;
			}
			.method-responsive-control-tab-' . $range . ' .components-toggle-control .components-form-toggle.is-checked .components-form-toggle__track {
				background-color: ' . $colors["{$range}"] . ';
			}
			.tab-enabled.tab-enabled-' . $range . ' .dashicon:after {
				background-color: ' . $colors["{$range}"] . ';
			}
		';
	}
	wp_add_inline_style( 'wp-edit-blocks', $custom_css );
}
add_action( 'enqueue_block_editor_assets', 'myplugin_inline_editor_styles' );


function method_get_responsive_setting( $block_attributes, $breakpoint, $setting, $fallback = false ) {
	if ( method_checK_array_key( $block_attributes, 'responsiveSettings' ) ) {
		if ( method_checK_array_key( $block_attributes['responsiveSettings'], $breakpoint ) ) {
			if ( method_checK_array_key( $block_attributes['responsiveSettings']["{$breakpoint}"], $setting ) ) {
				if ( ! empty( $block_attributes['responsiveSettings']["{$breakpoint}"]["{$setting}"] ) ) {
					return $block_attributes['responsiveSettings']["{$breakpoint}"]["{$setting}"];
				}
			}
		}
	}
	return $fallback;
}

function method_get_theme_icons() {
	$icons = array();
	$icons = apply_filters( 'method_block_theme_button_icons', $icons );
	$icons = apply_filters( 'method_theme_icons', $icons );
	return ( 0 < count( $icons ) ? $icons : false );
}

function method_register_theme_icons() {
	if ( ( function_exists( 'wp_register_icon_collection' ) ) && ( function_exists( 'wp_register_icon' ) ) ) {
		$icons = method_get_theme_icons();
		$visible_icons = array_filter( $icons, function ( $icon ) {
			return empty( $icon['omit'] );
		} );
		if ( $visible_icons ) {
			wp_register_icon_collection(
				'method',
				array(
					'label' => __('Method', 'method'),
				)
			);
			foreach ( $visible_icons as $slug => $icon ) {
				wp_register_icon(
					'method/' . $slug,
					array(
						'label'   => $icon['label'],
						'content' => $icon['svg'],
					)
				);
			}
		}
	}
}

add_action( 'init', 'method_register_theme_icons');