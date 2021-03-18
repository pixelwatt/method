<?php

//======================================================================
//
// METHOD LAYOUT CLASS v1.1.4
//
// You probably don't want or need to edit this file.
//
//======================================================================

abstract class Method_Layout {
	protected $elements    = array();
	protected $meta        = array();
	protected $loaded_meta = array();
	protected $opts        = array();
	protected $id;
	protected $html;
	protected $modals;
	protected $scripts;
	protected $attr = array();

	//======================================================================
	// CORE METHODS
	//======================================================================

	public function build_page( $pid = '', $archive = false ) {
		$this->set_opts();
		if ( true == $archive ) {
			global $wp_query;
			$this->attr['is_archive'] = true;
			$this->attr['post_type']  = ( $this->check_key( $wp_query->query_vars['post_type'] ) ? $wp_query->query_vars['post_type'] : 'post' );

			if ( 'post' == $this->attr['post_type'] ) {
				$this->attr['category'] = ( $this->check_key( $wp_query->queried_object->name ) ? $wp_query->queried_object->name : '' );
			}

			$this->attr['taxonomy'] = ( $this->check_key( $wp_query->query_vars['taxonomy'] ) ? $wp_query->query_vars['taxonomy'] : '' );
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

	//======================================================================
	// ABSTRACT METHODS
	//======================================================================

	abstract protected function set_opts();

	abstract protected function determine_attributes();

	abstract protected function build_header();

	abstract protected function build_footer();

	abstract protected function build_components();

	//======================================================================
	// POST META METHODS
	//======================================================================

	//-----------------------------------------------------
	// Get data for a meta key (current post)
	//-----------------------------------------------------

	protected function get_meta( $key ) {
		$output = false;
		if ( isset( $this->meta[ "{$key}" ][0] ) ) {
			if ( ! empty( $this->meta[ "{$key}" ][0] ) ) {
				$output = $this->meta[ "{$key}" ][0];
			}
		}
		return $output;
	}

	//-----------------------------------------------------
	// Get unserialized data for a serialized meta key (current post)
	//-----------------------------------------------------

	protected function get_serialized_meta( $key ) {
		$output = false;
		if ( isset( $this->meta[ "{$key}" ][0] ) ) {
			if ( ! empty( $this->meta[ "{$key}" ][0] ) ) {
				$output = maybe_unserialize( $this->meta[ "{$key}" ][0] );
			}
		}
		return $output;
	}

	//-----------------------------------------------------
	// Build a headline from a meta key (current post)
	//-----------------------------------------------------

	protected function get_headline( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_meta( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_meta( $key ) ? $this->format_tags( esc_html( $this->get_meta( $key ) ) ) : $fallback ) . $after;
		}
		return $output;
	}

	//-----------------------------------------------------
	// Build filtered content from a meta key (current post)
	//-----------------------------------------------------

	protected function get_content( $key, $before, $after, $fallback = '' ) {
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

	protected function load_meta( $id ) {
		$this->loaded_meta = get_post_meta( $id );
		return;
	}

	//-----------------------------------------------------
	// Reset loaded_meta to an empty array.
	//-----------------------------------------------------

	protected function unload_meta() {
		$this->loaded_meta = array();
		return;
	}

	//-----------------------------------------------------
	// Get data for a meta key (loaded meta)
	//-----------------------------------------------------

	protected function get_loaded_meta( $key ) {
		$output = false;
		if ( isset( $this->loaded_meta[ "{$key}" ][0] ) ) {
			if ( ! empty( $this->loaded_meta[ "{$key}" ][0] ) ) {
				$output = $this->loaded_meta[ "{$key}" ][0];
			}
		}
		return $output;
	}

	//-----------------------------------------------------
	// Get unserialized data for a serialized meta key (loaded meta)
	//-----------------------------------------------------

	protected function get_serialized_loaded_meta( $key ) {
		$output = false;
		if ( isset( $this->loaded_meta[ "{$key}" ][0] ) ) {
			if ( ! empty( $this->loaded_meta[ "{$key}" ][0] ) ) {
				$output = maybe_unserialize( $this->loaded_meta[ "{$key}" ][0] );
			}
		}
		return $output;
	}

	//-----------------------------------------------------
	// Build a headline from a meta key (loaded meta)
	//-----------------------------------------------------

	protected function get_loaded_headline( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_loaded_meta( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_loaded_meta( $key ) ? $this->format_tags( esc_html( $this->get_loaded_meta( $key ) ) ) : $fallback ) . $after;
		}
		return $output;
	}

	//-----------------------------------------------------
	// Build filtered content from a meta key (loaded meta)
	//-----------------------------------------------------

	protected function get_loaded_content( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_loaded_meta( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_loaded_meta( $key ) ? $this->filter_content( $this->get_loaded_meta( $key ) ) : $fallback ) . $after;
		}
		return $output;
	}

	//======================================================================
	// THEME OPTION METHODS
	//======================================================================

	//-----------------------------------------------------
	// Get an option from retrieved theme options
	//-----------------------------------------------------

	protected function get_option( $key ) {
		$output = false;
		if ( isset( $this->opts[ "{$key}" ] ) ) {
			if ( ! empty( $this->opts[ "{$key}" ] ) ) {
				$output = $this->opts[ "{$key}" ];
			}
		}
		return $output;
	}

	//-----------------------------------------------------
	// Build a headline from a retrieved theme option
	//-----------------------------------------------------

	protected function get_headline_from_option( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_option( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_option( $key ) ? $this->format_tags( esc_html( $this->get_option( $key ) ) ) : $fallback ) . $after;
		}
		return $output;
	}

	//-----------------------------------------------------
	// Build filtered content from a retrieved theme option
	//-----------------------------------------------------

	protected function get_content_from_option( $key, $before, $after, $fallback = '' ) {
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

	protected function array_to_ul( $array ) {
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

	protected function array_to_p( $array, $class = '', $seperator = '', $show_seperator = false ) {
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

	protected function format_tags( $text ) {
		$tags = array(
			'[br]'      => '<br>',
			'[mbr]'     => '<br class="d-inline d-sm-inline d-md-none d-lg-none d-xl-none d-xxl-none">',
			'[dbr]'     => '<br class="d-none d-sm-none d-md-inline d-lg-inline d-xl-inline d-xxl-inline">',
			'[strong]'  => '<strong>',
			'[/strong]' => '</strong>',
			'[em]'      => '<em>',
			'[/em]'     => '</em>',
		);
		return $this->str_replace_assoc( $tags, $text );
	}

	//-----------------------------------------------------
	// Escape html in a string and run through format_tags()
	//-----------------------------------------------------

	protected function format_headline( $text ) {
		return $this->format_tags( esc_html( $text ) );
	}

	//-----------------------------------------------------
	// Check to see if an array key exists.
	//-----------------------------------------------------

	protected function check_key( $key ) {
		$output = false;
		if ( isset( $key ) ) {
			if ( ! empty( $key ) ) {
				$output = true;
			}
		}
		return $output;
	}

	//-----------------------------------------------------
	// Run a string through WordPress' content filter
	//-----------------------------------------------------

	protected function filter_content( $content ) {
		if ( ! empty( $content ) ) {
			$content = apply_filters( 'the_content', $content );
		}
		return $content;
	}

	//-----------------------------------------------------
	// Function to replace strings found in an array
	// src: https://www.php.net/manual/en/function.str-replace.php#95198
	//-----------------------------------------------------

	protected function str_replace_assoc( array $replace, $subject ) {
		return str_replace( array_keys( $replace ), array_values( $replace ), $subject );
	}

	//-----------------------------------------------------
	// Add a modal to the layout's HTML
	//-----------------------------------------------------

	protected function inject_modal( $mid, $mclass = '', $title, $content, $prefiltered = false, $lg = false, $scrollable = false, $v5 = true ) {
		$close = ( $v5 ? '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' : '<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		<span aria-hidden="true">&times;</span>' );
		$this->modals .= '
			<div class="modal fade' . ( ! empty( $mclass ) ? ' ' . $mclass : '' ) . '" id="' . $mid . '" tabindex="-1" role="dialog" aria-labelledby="' . $mid . 'Label" aria-hidden="true">
				<div class="modal-dialog' . ( $scrollable ? ' modal-dialog-scrollable' : '' ) . ( $lg ? ' modal-lg' : '' ) . '" role="document">
					<div class="modal-content">
      					<div class="modal-header">
        					<h5 class="modal-title" id="' . $mid . 'Label">' . $title . '</h5>
        					' . $close . '
        					</button>
      					</div>
      					<div class="modal-body">
      						' . ( $prefiltered ? $content : $this->filter_content( $content ) ) . '
      					</div>  
    				</div>
  				</div>
			</div>

		';
	}

	protected function inject_bs_modal( $args ) {
		$defaults = array(
			'id'          => 'bsModal',
			'title'       => '',
			'hide_title'  => false,
			'content'     => '',
			'prefiltered' => false,
			'size'        => '',
			'scrollable'  => false,
		);
		$parsed = wp_parse_args( $args, $defaults );
		$this->modals .= '
			<div class="modal fade" id="' . $parsed['id'] . '" tabindex="-1" role="dialog" aria-labelledby="' . $parsed['id'] . 'Label" aria-hidden="true">
				<div class="modal-dialog' . ( $parsed['scrollable'] ? ' modal-dialog-scrollable' : '' ) . ( ! empty( $parsed['size'] ) ? ' modal-' . $parsed['size'] : '' ) . '" role="document">
					<div class="modal-content">
      					<div class="modal-header">
        					<h5 class="modal-title' . ( $parsed['hide_title'] ? ' visually-hidden' : '' ) . '" id="' . $parsed['id'] . 'Label">' . $parsed['title'] . '</h5>
        					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        					</button>
      					</div>
      					<div class="modal-body">
      						' . ( $parsed['prefiltered'] ? $parsed['content'] : $this->filter_content( $parsed['content'] ) ) . '
      					</div>  
    				</div>
  				</div>
			</div>

		';
	}

	//-----------------------------------------------------
	// Build an inline style for a background image from ID.
	//-----------------------------------------------------

	protected function get_bg_inline_style( $id, $size ) {
		$output = '';
		if ( ( $id ) && ( ! empty( $id ) ) ) {
			$output .= ' style="background-image: url(\'' . wp_get_attachment_image_url( $id, $size ) . '\')"';
		}
		return $output;
	}

	//-----------------------------------------------------
	// Check if a nunber is odd or even.
	//-----------------------------------------------------

	protected function odd_or_even( $i, $even_text = 'even', $odd_text = 'odd' ) {
		return ( 0 == $i % 2 ? $even_text : $odd_text );
	}
}
