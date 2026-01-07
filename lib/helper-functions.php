<?php

//======================================================================
// HELPER FUNCTIONS
//======================================================================


//-----------------------------------------------------
// Get common CSS classes
//-----------------------------------------------------

function method_get_class( $class, $echo = false ) {
	$output = '';

	if ( ! empty( $class ) ) {
		switch ( $class ) {
			case 'full_width_outer_col':
				$output = 'method-full-width-outer-col col-12 col-sm-11';
				break;
			case 'full_width_container':
				$output = 'method-full-width-container';
				break;
			default:
				break;
		}
	}

	if ( $echo ) {
		echo $output;
	} else {
		return $output;
	}
}


//-----------------------------------------------------
// Run a string through Wordpress' content filter
//-----------------------------------------------------

function method_filter_content( $content ) {
	if ( ! empty( $content ) ) {
		$content = apply_filters( 'the_content', $content );
	}
	return $content;
}


//-----------------------------------------------------
// DEPRECATED: Check an array key to see if it exists
//-----------------------------------------------------

function method_check_key( $key ) {
	$output = false;
	if ( isset( $key ) ) {
		if ( ! empty( $key ) ) {
			$output = true;
		}
	}
	return $output;
}


//------------------------------------------------------------
// Updated function to check an array key to see if it exists
//------------------------------------------------------------

function method_check_array_key( $item, $key ) {
	$output = false;
	if ( is_array( $item ) ) {
		if ( array_key_exists( $key, $item ) ) {
			if ( ! empty( $item["{$key}"] ) ) {
				$output = true;
			}
		}
	}
	return $output;
}


//-----------------------------------------------------
// Check to see if an array has content.
//-----------------------------------------------------

function method_check_array( $item, $key ) {
	$output = false;
	if ( $item ) {
		if ( is_array( $item ) ) {
			if ( 1 <=count( $item ) ) {
				if ( method_check_array_key( $item[0], $key ) ) {
					$output = true;
				}
			}
		}
	}
	return $output;
}


//-----------------------------------------------------
// Add the array_key_first() function for older PHP
//-----------------------------------------------------

if ( ! function_exists( 'array_key_first' ) ) {
	function array_key_first( array $arr ) {
		foreach ( $arr as $key => $unused ) {
			return $key;
		}
		return null;
	}
}


//-----------------------------------------------------
// Get an array of post IDs and titles
//-----------------------------------------------------

function method_get_post_array( $type, $none = '', $labels = false ) {
	//lets create an array of boroughs to loop through
	if ( ! empty( $none ) ) {
		$output[0] = $none;
	} else {
		$output = array();
	}

	$args = array(
		'post_type' => $type,
		'post_status' => 'publish',
		'posts_per_page' => -1,
		'orderby' => 'title',
		'order' => 'ASC'
	);

	//The Query
	$items = get_posts( $args );

	if ( $items ) {
		foreach ( $items as $post ) :
			setup_postdata( $post );
			$ptl = '';
			if ( $labels ) {
				global $wp_post_types;
				$lbs = $wp_post_types[$post->post_type]->labels;
				$ptl = ' (' . $lbs->singular_name . ')';
			}
			$output[ "{$post->ID}" ] = get_the_title( $post->ID ) . $ptl;
		endforeach;
		wp_reset_postdata();
	}

	return $output;
}


//-----------------------------------------------------
// Get an array of term ids and names
//-----------------------------------------------------

function method_get_term_array( $tax, $none = '' ) {
	//lets create an array of boroughs to loop through
	if ( ! empty( $none ) ) {
		$output[0] = $none;
	} else {
		$output = array();
	}

	//The Query
	$items = get_terms( $tax );

	if ( $items ) {
		foreach ( $items as $term ) :
			$output[ "{$term->term_id}" ] = $term->name;
		endforeach;
	}

	return $output;
}


//-----------------------------------------------------
// Get an array of nav menus created in the menu editor
//-----------------------------------------------------

function method_get_menus_array() {
	$menus  = get_terms( 'nav_menu', array( 'hide_empty' => true ) );
	$output = array();

	if ( ! empty( $menus ) ) {
		foreach ( $menus as $menu ) {
			$output[ $menu->term_id ] = $menu->name;
		}
	}

	return $output;
}


//-----------------------------------------------------
// Additional utility functions
//-----------------------------------------------------

function method_str_replace_assoc( array $replace, $subject ) {
	return str_replace( array_keys( $replace ), array_values( $replace ), $subject );
}


function method_get_tags_badge() {
	return '<span class="method-tags-opener">Tags Supported</span> ';
}

function method_get_font_size_presets() {
	if ( defined( 'METHOD_CHILD_OPTIONS' ) ) {
		$theme_data = METHOD_CHILD_OPTIONS;
	} else {
		$theme_data = METHOD_OPTIONS;
	}
	return $theme_data['typography']['font-size-presets'];
}

function method_get_all_bs_breakpoint_options() {
	$output = array();
	if ( defined( 'METHOD_CHILD_OPTIONS' ) ) {
		$theme_data = METHOD_CHILD_OPTIONS;
	} else {
		$theme_data = METHOD_OPTIONS;
	}
	if ( method_check_array_key( $theme_data, 'breakpoints' ) ) {
		if ( method_check_array_key( $theme_data['breakpoints'], 'dimensions' ) ) {
			if ( is_array( $theme_data['breakpoints']['dimensions'] ) ) {
				if ( 0 < count( $theme_data['breakpoints']['dimensions'] ) ) {
					foreach ( $theme_data['breakpoints']['dimensions'] as $key => $value ) {
						$output[] = array(
							'key' => $key,
							'name' => strtoupper($key),
							'hint' => $value . $theme_data['breakpoints']['units'],
						);
					}
				}
			}
		}
	}
	return $output;
}

function method_get_breakpoint_class_prefixes() {
	if ( defined( 'METHOD_CHILD_OPTIONS' ) ) {
		$theme_data = METHOD_CHILD_OPTIONS;
	} else {
		$theme_data = METHOD_OPTIONS;
	}
	return array(
		'mobile' => '',
		'tablet' => $theme_data['breakpoints']['tablet_min'],
		'base' => $theme_data['breakpoints']['base'],
		'wide' => $theme_data['breakpoints']['wide_min'],
	);
}

function method_get_block_breakpoints() {
	if ( defined( 'METHOD_CHILD_OPTIONS' ) ) {
		$theme_data = METHOD_CHILD_OPTIONS;
	} else {
		$theme_data = METHOD_OPTIONS;
	}
	$breakpoint_mobile_max =  $theme_data['breakpoints']['mobile_max'];
	$breakpoint_tablet_min =  $theme_data['breakpoints']['tablet_min'];
	$breakpoint_tablet_max =  $theme_data['breakpoints']['tablet_max'];
	$breakpoint_wide_min =  $theme_data['breakpoints']['wide_min'];
	return array(
		'mobile_max' => ( $theme_data['breakpoints']['dimensions']["{$breakpoint_mobile_max}"] - 1 ) . $theme_data['breakpoints']['units'],
		'tablet_min' => $theme_data['breakpoints']['dimensions']["{$breakpoint_tablet_min}"] . $theme_data['breakpoints']['units'],
		'tablet_max' => ( $theme_data['breakpoints']['dimensions']["{$breakpoint_tablet_max}"] - 1 ) . $theme_data['breakpoints']['units'],
		'wide_min' => $theme_data['breakpoints']['dimensions']["{$breakpoint_wide_min}"] . $theme_data['breakpoints']['units'],
	);
}

function method_get_breakpoint_colors() {
	if ( defined( 'METHOD_CHILD_OPTIONS' ) ) {
		$theme_data = METHOD_CHILD_OPTIONS;
	} else {
		$theme_data = METHOD_OPTIONS;
	}
	$output = array(
		'mobile' => '#007CBA',
		'tablet' => '#007CBA',
		'wide' => '#007CBA',
	);
	if ( method_check_array_key( $theme_data, 'breakpoint-colors' ) ) {
		if ( method_check_array_key( $theme_data['breakpoint-colors'], 'enabled' ) ) {
			$output = array(
				'mobile' => ( method_check_array_key( $theme_data['breakpoint-colors'], 'mobile' ) ? $theme_data['breakpoint-colors']['mobile'] : '#007CBA' ),
				'tablet' => ( method_check_array_key( $theme_data['breakpoint-colors'], 'tablet' ) ? $theme_data['breakpoint-colors']['tablet'] : '#007CBA' ),
				'wide' => ( method_check_array_key( $theme_data['breakpoint-colors'], 'wide' ) ? $theme_data['breakpoint-colors']['wide'] : '#007CBA' ),
			);
		}
	}
	return $output;
}


function method_build_social_nav_items( $key = 'social_accounts' ) {
	$output = '';
	$theme_opts = get_option( 'method_options' );
	$social_links = ( method_check_array_key( $theme_opts, $key ) ? $theme_opts["{$key}"] : false );
	if ( ! empty( $social_links ) ) {
		if ( is_array( $social_links ) ) {
			$platforms = method_get_social_platforms();
			if ( method_check_array( $social_links, 'service' ) ) {
				foreach ( $social_links as $link ) {
					$service = $link['service'];
					$output .= ' <li>' . ( isset( $link['url'] ) ? ( ! empty( $link['url'] ) ? '<a target="_blank" href="' . $link['url'] . '">' : '' ) : '' ) . '<span class="method-sn-icon">' . $platforms["{$service}"]["icon"] . '</span><span class="method-sn-label">' . $platforms["{$service}"]["label"] . '</span>' . ( isset( $link['url'] ) ? ( ! empty( $link['url'] ) ? '</a>' : '' ) : '' ) . '</li>';
				}
			}
		}
	}

	return $output;
}

function method_get_options_page_social_options() {
	$options = array();
	$platforms = method_get_social_platforms();
	foreach ( $platforms as $key => $value ) {
		$options["{$key}"] = __( $value['icon'] . '<span class="service-label">' . $value['label'] . '</span>', 'method' );
	}
	return $options;
}

function method_get_social_platforms() {
	$defaults = array(
		'bluesky' => array(
			'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-square-fill" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z"/></svg>',
			'label' => 'Bluesky',
		),
		'facebook' => array(
			'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/></svg>',
			'label' => 'Facebook',
		),
		'github' => array(
			'icon' => '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8.01.13C3.58.13,0,3.74,0,8.2c0,3.57,2.29,6.58,5.47,7.65.4.08.54-.17.54-.39,0-.19-.01-.83-.01-1.5-2.23.48-2.69-.96-2.69-.96-.36-.93-.89-1.18-.89-1.18-.73-.49.05-.49.05-.49.81.05,1.23.83,1.23.83.72,1.23,1.87.88,2.33.67.07-.52.28-.88.5-1.08-1.78-.19-3.65-.88-3.65-3.98,0-.88.32-1.6.82-2.16-.08-.2-.36-1.03.08-2.14,0,0,.68-.21,2.2.83.65-.18,1.33-.27,2-.27.68,0,1.37.09,2,.27,1.52-1.04,2.2-.83,2.2-.83.44,1.11.16,1.94.08,2.14.52.56.82,1.28.82,2.16,0,3.1-1.87,3.78-3.66,3.98.29.25.54.73.54,1.5,0,1.08-.01,1.95-.01,2.22,0,.21.15.47.54.39,3.18-1.07,5.47-4.09,5.47-7.65.01-4.46-3.58-8.07-7.99-8.07Z" fill="currentColor" fill-rule="evenodd"/></svg>',
			'label' => 'GitHub',
		),
		'instagram' => array(
			'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/></svg>',
			'label' => 'Instagram',
		),
		'linkedin' => array(
			'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/></svg>',
			'label' => 'LinkedIn',
		),
		'pinterest' => array(
			'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pinterest" viewBox="0 0 16 16"><path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0"/></svg>',
			'label' => 'Pinterest',
		),
		'threads' => array(
			'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-threads" viewBox="0 0 16 16"><path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161"/></svg>',
			'label' => 'Threads',
		),
		'tiktok' => array(
			'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tiktok" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/></svg>',
			'label' => 'TikTok',
		),
		'twitch' => array(
			'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitch" viewBox="0 0 16 16"><path d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142z"/><path d="M11.857 3.143h-1.143V6.57h1.143zm-3.143 0H7.571V6.57h1.143z"/></svg>',
			'label' => 'Twitch',
		),
		'twitter' => array(
			'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg>',
			'label' => 'Twitter',
		),
		'vimeo' => array(
			'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-vimeo" viewBox="0 0 16 16"><path d="M15.992 4.204q-.106 2.334-3.262 6.393-3.263 4.243-5.522 4.243-1.4 0-2.367-2.583L3.55 7.523Q2.83 4.939 2.007 4.94q-.178.001-1.254.754L0 4.724a210 210 0 0 0 2.334-2.081q1.581-1.364 2.373-1.437 1.865-.185 2.298 2.553.466 2.952.646 3.666.54 2.447 1.186 2.445.5 0 1.508-1.587 1.006-1.587 1.077-2.415.144-1.37-1.077-1.37a3 3 0 0 0-1.185.261q1.183-3.86 4.508-3.756 2.466.075 2.324 3.2z"/></svg>',
			'label' => 'Vimeo',
		),
		'youtube' => array(
			'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/></svg>',
			'label' => 'YouTube',
		),
		'custom' => array(
			'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/></svg>',
			'label' => 'Custom Link',
		),
	);
	return apply_filters( 'method_available_social_platforms', $defaults );
}