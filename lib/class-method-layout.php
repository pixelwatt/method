<?php

//======================================================================
//
// METHOD LAYOUT CLASS v1.3.9
//
// You probably don't want or need to edit this file.
//
//======================================================================

abstract class Method_Layout {
	protected $meta             = array();
	protected $loaded_meta      = array();
	protected $loaded_term_meta = array();
	protected $opts             = array();
	protected $id;
	protected $html;
	protected $modals;
	protected $scripts;
	protected $attr             = array();

	//======================================================================
	// CORE METHODS
	//======================================================================

	public function build_page( $pid = '', $archive = false ) {
		$this->set_opts();
		$this->attr['is_front'] = false;
		if ( true == $archive ) {
			global $wp_query;
			$this->attr['is_archive'] = true;
			$this->attr['post_type']  = ( $this->check_array_key( $wp_query->query_vars, 'post_type' ) ? $wp_query->query_vars['post_type'] : 'post' );

			if ( 'post' == $this->attr['post_type'] ) {
				$this->attr['category'] = ( $this->check_key( $wp_query->queried_object->name ) ? $wp_query->queried_object->name : '' );
			}

			$this->attr['taxonomy'] = ( $this->check_array_key( $wp_query->query_vars, 'taxonomy' ) ? $wp_query->query_vars['taxonomy'] : '' );
			$this->determine_attributes();
			$this->build_layout();

			return $this->html . $this->modals . $this->scripts;

		} elseif ( ( ! empty( $pid ) ) && ( false == $archive ) ) {
			$this->attr['is_archive'] = false;
			$this->attr['post_type']  = get_post_type( $this->id );
			$this->id                 = $pid;
			$this->meta               = get_post_meta( $this->id );

			if ( 'page' == $this->attr['post_type'] ) {
				$fp = get_option( 'page_on_front' );
				if ( $fp == $this->id ) {
					$this->attr['is_front'] = true;
				}
			}

			$this->determine_attributes();
			$this->build_layout();

			return $this->html . $this->modals . $this->scripts;

		} else {
			return false;
		}
	}

	protected function build_layout() {
		$this->build_header();
		$this->build_components();
		$this->build_footer();
		return;
	}

	public function init_page( $pid, $standalone = false ) {
		$this->set_opts();
		$this->attr['is_front'] = false;
		$this->attr['standalone'] = $standalone;
		$this->attr['is_archive'] = false;
		$this->id                 = $pid;
		$this->attr['post_type']  = get_post_type( $this->id );
		$this->meta               = get_post_meta( $this->id );

		if ( 'page' == $this->attr['post_type'] ) {
			$fp = get_option( 'page_on_front' );
			if ( $fp == $this->id ) {
				$this->attr['is_front'] = true;
			}
		}
		return;
	}

	public function init_archive( $standalone = false ) {
		$this->set_opts();
		$this->attr['standalone'] = $standalone;
		$this->attr['is_archive'] = true;
		return;
	}

	public function init_search( $standalone = false ) {
		$this->set_opts();
		$this->attr['standalone'] = $standalone;
		return;
	}

	//======================================================================
	// ABSTRACT METHODS
	//======================================================================

	abstract protected function set_opts();

	abstract protected function determine_attributes();

	abstract protected function build_header();

	abstract protected function build_footer();

	abstract protected function build_components();

	//======================================================================
	// FRONTEND METHODS
	//======================================================================

	//-----------------------------------------------------
	// A public method for building a single component
	//-----------------------------------------------------

	public function build_component( $component ) {
		if ( $this->attr['standalone'] ) {
			$this->reset_markup();
		} else {
			$this->reset_html();
		}
		$output = '';
		$this->attr['components'] = array();
		$this->attr['components'][] = $component;
		$this->build_components( $items );
		if ( $this->attr['standalone'] ) {
			$output = $this->get_merged_markup();
			$this->reset_markup();
		} else {
			$output = $this->html;
			$this->reset_html();
		}
		return $output;
	}

	//-----------------------------------------------------
	// A public method for getting the header
	//-----------------------------------------------------

	public function get_header_markup() {
		if ( $this->attr['standalone'] ) {
			$this->reset_markup();
		} else {
			$this->reset_html();
		}
		$output = '';
		$this->build_header();
		if ( $this->attr['standalone'] ) {
			$output = $this->get_merged_markup();
			$this->reset_markup();
		} else {
			$output = $this->html;
			$this->reset_html();
		}
		return $output;
	}

	//-----------------------------------------------------
	// A public method for getting the footer
	//-----------------------------------------------------

	public function get_footer_markup() {
		if ( $this->attr['standalone'] ) {
			$this->reset_markup();
		} else {
			$this->reset_html();
		}
		$output = '';
		$this->build_footer();
		// Any components built after calling this function on the frontend will need to be built with $standalone passed as true
		$output = $this->get_merged_markup();
		$this->reset_markup();
		return $output;
	}

	//-----------------------------------------------------
	// Get all markup fields as a combined string
	//-----------------------------------------------------

	protected function get_merged_markup() {
		return $this->html . $this->modals . $this->scripts;
	}

	//-----------------------------------------------------
	// Reset html
	//-----------------------------------------------------

	protected function reset_html() {
		$this->html = '';
		return;
	}

	//-----------------------------------------------------
	// Reset markup fields
	//-----------------------------------------------------

	protected function reset_markup() {
		$this->html = '';
		$this->scripts = '';
		$this->modals = '';
		return;
	}

	//======================================================================
	// POST META METHODS
	//======================================================================

	//-----------------------------------------------------
	// Get data for a meta key (current post)
	//-----------------------------------------------------

	public function get_meta( $key, $fallback = '' ) {
		$output = false;
		if ( $this->check_array_key( $this->meta, $key ) ) {
			if ( $this->check_array_key( $this->meta[ "{$key}" ], 0 ) ) {
				$output = $this->meta[ "{$key}" ][0];
			}
		}
		return ( false === $output ? ( ! empty( $fallback ) ? $fallback : false ) : $output );
	}

	//-----------------------------------------------------
	// Get unserialized data for a serialized meta key (current post)
	//-----------------------------------------------------

	public function get_serialized_meta( $key ) {
		$output = false;
		if ( $this->check_array_key( $this->meta, $key ) ) {
			if ( $this->check_array_key( $this->meta[ "{$key}" ], 0 ) ) {
				$output = maybe_unserialize( $this->meta[ "{$key}" ][0] );
			}
		}
		return $output;
	}

	//-----------------------------------------------------
	// Build a headline from a meta key (current post)
	//-----------------------------------------------------

	public function get_headline( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_meta( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_meta( $key ) ? $this->format_tags( esc_html( $this->get_meta( $key ) ) ) : $fallback ) . $after;
		}
		return $output;
	}

	//-----------------------------------------------------
	// Build filtered content from a meta key (current post)
	//-----------------------------------------------------

	public function get_content( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_meta( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_meta( $key ) ? $this->filter_content( $this->get_meta( $key ) ) : $fallback ) . $after;
		}
		return $output;
	}

	//-----------------------------------------------------
	// Load all meta for a specified post and store in the
	// loaded_meta property.
	//-----------------------------------------------------

	public function load_meta( $id ) {
		$this->loaded_meta = get_post_meta( $id );
		return;
	}

	//-----------------------------------------------------
	// Reset loaded_meta to an empty array.
	//-----------------------------------------------------

	public function unload_meta() {
		$this->loaded_meta = array();
		return;
	}

	//-----------------------------------------------------
	// Get data for a meta key (loaded meta)
	//-----------------------------------------------------

	public function get_loaded_meta( $key, $fallback = '' ) {
		$output = false;
		if ( $this->check_array_key( $this->loaded_meta, $key ) ) {
			if ( $this->check_array_key( $this->loaded_meta[ "{$key}" ], 0 ) ) {
				$output = $this->loaded_meta[ "{$key}" ][0];
			}
		}
		return ( false === $output ? ( ! empty( $fallback ) ? $fallback : false ) : $output );
	}

	//-----------------------------------------------------
	// Get unserialized data for a serialized meta key (loaded meta)
	//-----------------------------------------------------

	public function get_serialized_loaded_meta( $key ) {
		$output = false;
		if ( $this->check_array_key( $this->loaded_meta, $key ) ) {
			if ( $this->check_array_key( $this->loaded_meta[ "{$key}" ], 0 ) ) {
				$output = maybe_unserialize( $this->loaded_meta[ "{$key}" ][0] );
			}
		}
		return $output;
	}

	//-----------------------------------------------------
	// Build a headline from a meta key (loaded meta)
	//-----------------------------------------------------

	public function get_loaded_headline( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_loaded_meta( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_loaded_meta( $key ) ? $this->format_tags( esc_html( $this->get_loaded_meta( $key ) ) ) : $fallback ) . $after;
		}
		return $output;
	}

	//-----------------------------------------------------
	// Build filtered content from a meta key (loaded meta)
	//-----------------------------------------------------

	public function get_loaded_content( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_loaded_meta( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_loaded_meta( $key ) ? $this->filter_content( $this->get_loaded_meta( $key ) ) : $fallback ) . $after;
		}
		return $output;
	}

	//-----------------------------------------------------
	// Load all meta for a specified term and store in the
	// loaded_term_meta property.
	//-----------------------------------------------------

	public function load_term_meta( $id ) {
		$this->loaded_term_meta = get_term_meta( $id );
		return;
	}

	//-----------------------------------------------------
	// Reset loaded_term_meta to an empty array.
	//-----------------------------------------------------

	public function unload_term_meta() {
		$this->loaded_term_meta = array();
		return;
	}

	//-----------------------------------------------------
	// Get data for a meta key (loaded term meta)
	//-----------------------------------------------------

	public function get_loaded_term_meta( $key, $fallback = '' ) {
		$output = false;
		if ( $this->check_array_key( $this->loaded_term_meta, $key ) ) {
			if ( $this->check_array_key( $this->loaded_term_meta[ "{$key}" ], 0 ) ) {
				$output = $this->loaded_term_meta[ "{$key}" ][0];
			}
		}
		return ( false === $output ? ( ! empty( $fallback ) ? $fallback : false ) : $output );
	}

	//======================================================================
	// THEME OPTION METHODS
	//======================================================================

	//-----------------------------------------------------
	// Get an option from retrieved theme options
	//-----------------------------------------------------

	public function get_option( $key, $fallback = '' ) {
		$output = false;
		if ( $this->check_array_key( $this->opts, $key ) ) {
			$output = $this->opts[ "{$key}" ];
		}
		return ( false === $output ? ( ! empty( $fallback ) ? $fallback : false ) : $output );
	}

	//-----------------------------------------------------
	// Build a headline from a retrieved theme option
	//-----------------------------------------------------

	public function get_headline_from_option( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_option( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_option( $key ) ? $this->format_tags( esc_html( $this->get_option( $key ) ) ) : $fallback ) . $after;
		}
		return $output;
	}

	//-----------------------------------------------------
	// Build filtered content from a retrieved theme option
	//-----------------------------------------------------

	public function get_content_from_option( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_option( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_option( $key ) ? $this->filter_content( $this->get_option( $key ) ) : $fallback ) . $after;
		}
		return $output;
	}

	//======================================================================
	// UTILITY METHODS
	//======================================================================

	//-----------------------------------------------------
	// Create an unordered list from an array
	//-----------------------------------------------------

	public function array_to_ul( $array, $class = '' ) {
		$array  = maybe_unserialize( $array );
		$output = '';

		if ( ! empty( $array ) ) {
			if ( is_array( $array ) ) {
				$output .= '<ul' . ( ! empty( $class ) ? ' class="' . $class . '"' : '' ) . '>';
				foreach ( $array as $item ) {
					$output .= '<li>' . $this->format_tags( esc_html( $item ) ) . '</li>';
				}
				$output .= '</ul>';
			}
		}
		return $output;
	}

	//-----------------------------------------------------
	// Create a paragraph with line breaks from an array
	//-----------------------------------------------------

	public function array_to_p( $array, $class = '', $seperator = '', $show_seperator = false ) {
		$array  = maybe_unserialize( $array );
		$output = '';

		if ( ! empty( $array ) ) {
			if ( is_array( $array ) ) {
				$output .= '<p' . ( ! empty( $class ) ? ' class="' . $class . '"' : '' ) . '>';
				$ac      = count( $array );
				$i       = 1;
				foreach ( $array as $item ) {
					$output .= $this->format_tags( esc_html( $item ) ) . ( $i != $ac ? ( ! empty( $seperator ) ? ( ! $show_seperator ? '<span class="visually-hidden">' : '' ) . $seperator . ( ! $show_seperator ? '</span>' : '' ) : '' ) . '<br>' : '' );
					$i++;
				}
				$output .= '</p>';
			}
		}
		return $output;
	}

	//-----------------------------------------------------
	// Replace format tags in a string with html tags
	//-----------------------------------------------------

	public function format_tags( $text ) {
		$tags = array(
			'[br]'      => '<br>',
			'[mbr]'     => '<br class="d-inline d-sm-inline d-md-none d-lg-none d-xl-none d-xxl-none">',
			'[dbr]'     => '<br class="d-none d-sm-none d-md-inline d-lg-inline d-xl-inline d-xxl-inline">',
			'[strong]'  => '<strong>',
			'[/strong]' => '</strong>',
			'[b]'       => '<strong>',
			'[/b]'      => '</strong>',
			'[em]'      => '<em>',
			'[/em]'     => '</em>',
			'[u]'       => '<span class="method-underlined">',
			'[/u]'      => '</span>',
			'[bull]'    => '<span class="method-bull">&bull;</span>',
		);
		return $this->str_replace_assoc( apply_filters( 'method_format_tags', $tags ), $text );
	}

	//-----------------------------------------------------
	// Escape html in a string and run through format_tags()
	//-----------------------------------------------------

	public function format_headline( $text ) {
		return $this->format_tags( esc_html( $text ) );
	}

	//-----------------------------------------------------
	// Check to see if an array key exists.
	//-----------------------------------------------------

	public function check_key( $key ) {
		$output = false;
		if ( isset( $key ) ) {
			if ( ! empty( $key ) ) {
				$output = true;
			}
		}
		return $output;
	}

	//-----------------------------------------------------
	// Check to see if an array key exists, more cleanly.
	//-----------------------------------------------------

	public function check_array_key( $item, $key ) {
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

	public function check_array( $item, $key ) {
		$output = false;
		if ( $item ) {
			if ( is_array( $item ) ) {
				if ( 1 <=count( $item ) ) {
					if ( $this->check_array_key( $item[0], $key ) ) {
						$output = true;
					}
				}
			}
		}
		return $output;
	}


	//-----------------------------------------------------
	// Run a string through WordPress' content filter
	//-----------------------------------------------------

	public function filter_content( $content ) {
		if ( ! empty( $content ) ) {
			$content = apply_filters( 'the_content', $content );
		}
		return $content;
	}

	//-----------------------------------------------------
	// Function to replace strings found in an array
	// src: https://www.php.net/manual/en/function.str-replace.php#95198
	//-----------------------------------------------------

	public function str_replace_assoc( array $replace, $subject ) {
		return str_replace( array_keys( $replace ), array_values( $replace ), $subject );
	}

	//-----------------------------------------------------
	// Add a modal to the layout's HTML
	//-----------------------------------------------------

	public function inject_modal( $mid, $mclass = '', $title, $content, $prefiltered = false, $lg = false, $scrollable = false, $v5 = true ) {
		$close = ( $v5 ? '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' : '<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		<span aria-hidden="true">&times;</span></button>' );
		$this->modals .= '
			<div class="modal fade' . ( ! empty( $mclass ) ? ' ' . $mclass : '' ) . '" id="' . $mid . '" tabindex="-1" role="dialog" aria-labelledby="' . $mid . 'Label" aria-hidden="true">
				<div class="modal-dialog' . ( $scrollable ? ' modal-dialog-scrollable' : '' ) . ( $lg ? ' modal-lg' : '' ) . '" role="document">
					<div class="modal-content">
      					<div class="modal-header">
        					<h5 class="modal-title" id="' . $mid . 'Label">' . $title . '</h5>
        					' . $close . '
      					</div>
      					<div class="modal-body">
      						' . ( $prefiltered ? $content : $this->filter_content( $content ) ) . '
      					</div>  
    				</div>
  				</div>
			</div>

		';
	}

	public function inject_bs_modal( $args ) {
		$defaults = array(
			'id'          => 'bsModal',
			'class'       => '',
			'title'       => '',
			'hide_title'  => false,
			'content'     => '',
			'prefiltered' => false,
			'size'        => '',
			'scrollable'  => false,
			'hide_header' => false,
			'prepend_header' => '',
			'append_header' => '',
			'prepend_body' => '<div class="content-wrap">',
			'append_body' => '</div>',
			'button_html' => '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>',
			'return'  => false,
		);
		$parsed = wp_parse_args( $args, $defaults );
		$output = '
			<div class="modal fade' . ( ! empty( $parsed['class'] ) ? ' ' . $parsed['class'] : '' ) . '" id="' . $parsed['id'] . '" tabindex="-1" role="dialog" aria-labelledby="' . $parsed['id'] . 'Label" aria-hidden="true">
				<div class="modal-dialog' . ( $parsed['scrollable'] ? ' modal-dialog-scrollable' : '' ) . ( ! empty( $parsed['size'] ) ? ' modal-' . $parsed['size'] : '' ) . '" role="document">
					<div class="modal-content">
      					<div class="modal-header' . ( $parsed['hide_header'] ? ' visually-hidden' : '' ) . '">
							' . $parsed['prepend_header'] . '
        					<h5 class="modal-title' . ( $parsed['hide_title'] ? ' visually-hidden' : '' ) . '" id="' . $parsed['id'] . 'Label">' . $parsed['title'] . '</h5>
							' . ( $parsed['hide_header'] ? '' : $parsed['button_html'] ) . '
							' . $parsed['append_header'] . '
      					</div>
      					<div class="modal-body">
						  	' . $parsed['prepend_body'] . '
							' . ( $parsed['hide_header'] ? $parsed['button_html'] : '' ) . '
							' . ( $parsed['prefiltered'] ? $parsed['content'] : $this->filter_content( $parsed['content'] ) ) . '
							' . $parsed['append_body'] . '
      					</div>  
    				</div>
  				</div>
			</div>
		';
		if ( $parsed['return'] ) {
			return $output;
		} else {
			$this->modals .= $output;
			return;
		}
	}

	//-----------------------------------------------------
	// Build an inline style for a background image from ID.
	//-----------------------------------------------------

	public function get_bg_inline_style( $id, $size, $fallback = '' ) {
		$output = '';
		if ( ( $id ) && ( ! empty( $id ) ) ) {
			$output .= ' style="background-image: url(\'' . wp_get_attachment_image_url( $id, $size ) . '\')"';
		}
		if ( ( empty( $output ) ) && ( ! empty( $fallback ) ) ) {
			$output .= ' style="background-image: url(\'' . $fallback . '\')"';
		}
		return $output;
	}

	//-----------------------------------------------------
	// Check if a nunber is odd or even.
	//-----------------------------------------------------

	public function odd_or_even( $i, $odd_text = 'odd', $even_text = 'even' ) {
		return ( 0 == $i % 2 ? $even_text : $odd_text );
	}

	//-----------------------------------------------------
	// Get a Bootstrap icon
	//-----------------------------------------------------

	public function get_bs_icon_svg( $icon, $size = '16', $class = '', $label = '', $hidden = false ) {
		$output = '';
		$file = get_template_directory() . '/inc/bootstrap-icons/' . $icon . '.svg';
		if ( file_exists( $file ) ) {
			$svg = file_get_contents( $file );
			$svg = str_replace( 'width="16"', 'width="' . $size . '"', $svg );
			$svg = str_replace( 'height="16"', 'height="' . $size . '" focusable="false"', $svg );
			if ( ! empty( $class ) ) {
				$svg = str_replace( 'class="bi bi-' . $icon . '"', 'class="bi bi-' . $icon . ' ' . $class . '"', $svg );
			}
			if ( ( ! empty( $label ) ) || ( $hidden ) ) {
				$attrs = array();
				$svg_d = new DOMDocument();
				libxml_use_internal_errors( true );
				if ( ! empty( $label ) ) {
					$attrs['aria-label'] = $label;
				}
				if ( $hidden ) {
					$attrs['aria-hidden'] = 'true';
				}
				foreach ( $attrs as $key => $value ) {
					$svg_d->loadHTML( $svg );
					libxml_clear_errors();
					$svg_attr = $svg_d->createAttribute( $key );
					$svg_attr->value = $value;
					$elements = $svg_d->getElementsByTagName( 'svg' );
					foreach ( $elements as $element ) {
						$element->appendChild( $svg_attr );
					}
					$svg = $svg_d->saveHTML();
				}
			}
			$output = $svg;
		}
		return $output;
	}

	//-----------------------------------------------------
	// Inline a SVG
	//-----------------------------------------------------

	public function get_svg( $id, $class = '', $label = '', $hidden = false, $fallback_size = 'full' ) {
		$output = '';
		$file = get_attached_file( $id );
		if ( file_exists( $file ) ) {
			if ( $this->endsWith( $file, '.svg' ) ) {
				$svg = file_get_contents( $file );
				if ( ( ! empty( $label ) ) || ( ! empty( $class ) ) || ( $hidden ) ) {
					$attrs = array();
					$svg_d = new DOMDocument();
					libxml_use_internal_errors( true );
					if ( ! empty( $label ) ) {
						$attrs['aria-label'] = $label;
					} else {
						$attrs['aria-label'] = esc_attr( wp_get_attachment_caption( $id ) );
					}
					if ( ! empty( $class ) ) {
						$attrs['class'] = $class;
					}
					if ( $hidden ) {
						$attrs['aria-hidden'] = 'true';
					}
					foreach ( $attrs as $key => $value ) {
						$svg_d->loadHTML( $svg );
						libxml_clear_errors();
						$svg_attr = $svg_d->createAttribute( $key );
						$svg_attr->value = $value;
						$elements = $svg_d->getElementsByTagName( 'svg' );
						foreach ( $elements as $element ) {
							$element->appendChild( $svg_attr );
						}
						$svg = $svg_d->saveHTML();
					}
				}
			} else {
				$svg = wp_get_attachment_image( $id, $fallback_size, false, array( 'class' => $class ) );
			}
			$output = $svg;
		}
		return $output;
	}

	public function endsWith($haystack, $needle) {
		$length = strlen($needle);
		return $length > 0 ? substr($haystack, -$length) === $needle : true;
	}

	//-----------------------------------------------------
	// Build social icons from theme options
	//-----------------------------------------------------

	public function build_social_icons( $class = 's-ics', $icon_size = 16 ) {
		$output = '';

		$social_links = $this->get_option( 'social_accounts' );
		if ( ! empty( $social_links ) ) {
			if ( is_array( $social_links ) ) {
				if ( $this->check_array( $social_links, 'service' ) ) {
					$output .= '<ul class="' . $class . '">';

					foreach ( $social_links as $link ) {
						$service = $link['service'];

						switch ( $service ) {
							case 'facebook':
								$icon = $this->get_bs_icon_svg( 'facebook', $icon_size );
								break;
							case 'twitter':
								$icon = $this->get_bs_icon_svg( 'twitter', $icon_size );
								break;
							case 'linkedin':
								$icon = $this->get_bs_icon_svg( 'linkedin', $icon_size );
								break;
							case 'instagram':
								$icon = $this->get_bs_icon_svg( 'instagram', $icon_size );
								break;
							case 'pinterest':
								$icon = $this->get_bs_icon_svg( 'pinterest', $icon_size );
								break;
							case 'youtube':
								$icon = $this->get_bs_icon_svg( 'youtube', $icon_size );
								break;
							case 'twitch':
								$icon = $this->get_bs_icon_svg( 'twitch', $icon_size );
								break;
							case 'tiktok':
								$icon = $this->get_bs_icon_svg( 'tiktok', $icon_size );
								break;
							default:
								$icon = '';
								break;
						}

						$output .= ' <li>' . ( isset( $link['url'] ) ? ( ! empty( $link['url'] ) ? '<a href="' . $link['url'] . '">' : '' ) : '' ) . $icon . '<span class="visually-hidden-focusable"> ' . ucwords( $service ) . '</span>' . ( isset( $link['url'] ) ? ( ! empty( $link['url'] ) ? '</a>' : '' ) : '' ) . '</li>';
					}

					$output .= '</ul>';
				}
			}
		}

		return $output;
	}

	//-----------------------------------------------------
	// Build js for an interactive observer
	//-----------------------------------------------------

	public function build_observer( $elements, $threshold = 1 ) {
		$output = '
			var observer = new IntersectionObserver(function(entries) {
				for (let entry of entries) {
					if(entry.isIntersecting === true) {
						if(entry[\'intersectionRatio\'] === 1) {
		';
		foreach ( $elements as $key => $value ) {
			$output .= 'if(entry[\'target\'][\'id\'] === "' . $key . '") {';
			foreach ( $value as $line ) {
				$output .= $line . ';';
			}
			$output .= 'observer.unobserve(document.querySelector("#' . $key . '")); }';
		}
		$output .= '
						}
					}
				}
			}, { threshold: ' . $threshold . ', root:null });
		';
		foreach ( $elements as $key => $value ) {
			$output .= 'observer.observe(document.querySelector("#' . $key . '"));';
		}
		return $output;
	}

}
