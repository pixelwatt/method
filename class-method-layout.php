<?php

//======================================================================
//
// METHOD LAYOUT CLASS v1.1.1
//
// You probably don't want to edit this file.
//
//======================================================================

abstract class Method_Layout {
	protected $elements = array();
	protected $meta = array();
	protected $loaded_meta = array();
	protected $opts = array();
	protected $id;
	protected $html;
	protected $modals;
	protected $scripts;
	protected $attr = array();

	abstract protected function set_opts();

	/*

		Example:
		protected function set_opts() {
			$this->opts = get_option( 'method_options' );
		}

	*/

	public function build_page( $pid = '', $archive = false ) {
		$this->set_opts();
		if ( true == $archive ) {
			global $wp_query;
			$this->attr['is_archive'] = true;
			$this->attr['post_type'] = ( $this->check_key( $wp_query->query_vars['post_type'] ) ? $wp_query->query_vars['post_type'] : 'post' );
			if ( 'post' == $this->attr['post_type'] ) {
				$this->attr['category'] = ( $this->check_key( $wp_query->queried_object->name ) ? $wp_query->queried_object->name : '' );
			}
			$this->attr['taxonomy'] = ( $this->check_key( $wp_query->query_vars['taxonomy'] ) ? $wp_query->query_vars['taxonomy'] : '' );
			$this->determine_attributes();
			$this->build_layout();
			return $this->html . $this->modals . $this->scripts;
		} elseif ( ( ! empty( $pid ) ) && ( false == $archive ) ) {
			$this->attr['is_archive'] = false;
			$this->attr['post_type'] = get_post_type( $this->id );
			$this->id = $pid;
			$this->meta = get_post_meta( $this->id );
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


	abstract protected function determine_attributes();


	abstract protected function build_header();


	abstract protected function build_footer();


	abstract protected function build_components();


	protected function inject_modal( $mid, $mclass = '', $title, $content, $prefiltered = false, $lg = false, $scrollable = false ) {
		$this->modals .= '
			<div class="modal fade" id="' . $mid . '" tabindex="-1" role="dialog" aria-labelledby="' . $mid . 'Label" aria-hidden="true">
				<div class="modal-dialog' . ( $scrollable ? ' modal-dialog-scrollable' : '' ) . ( $lg ? ' modal-lg' : '' ) . '" role="document">
					<div class="modal-content">
      					<div class="modal-header">
        					<h5 class="modal-title" id="exampleModalLabel">' . $title . '</h5>
        					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
          						<span aria-hidden="true">&times;</span>
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


	protected function array_to_ul( $array ) {
		$array = maybe_unserialize( $array );
		$output = '';

		if ( ! empty( $array ) ) {
			if ( is_array( $array ) ) {
				$output .= '<ul>';
				foreach ( $array as $item ) {
					$output .= '<li>' . esc_html( $item ) . '</li>';
				}
				$output .= '</ul>';
			}
		}
		return $output;
	}

	protected function array_to_p( $array, $class = '' ) {
		$array = maybe_unserialize( $array );
		$output = '';

		if ( ! empty( $array ) ) {
			if ( is_array( $array ) ) {
				$output .= '<p' . ( ! empty( $class ) ? ' class="' . $class . '"' : '' ) . '>';
				$ac = count( $array );
				$i = 1;
				foreach ( $array as $item ) {
					$output .= esc_html( $item ) . ( $i != $ac ? '<br>' : '' );
					$i++;
				}
				$output .= '</p>';
			}
		}
		return $output;
	}

	protected function format_tags( $text ) {
		$tags = array(
			'[br]' => '<br>',
			'[mbr]' => '<br class="d-inline d-md-none">',
			'[dbr]' => '<br class="d-xs-none d-sm-none d-md-inline">',
			'[strong]' => '<strong>',
			'[/strong]' => '</strong>',
			'[em]' => '<em>',
			'[/em]' => '</em>',
		);
		return $this->str_replace_assoc( $tags, $text );
	}

	protected function get_headline( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_meta( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_meta( $key ) ? $this->format_tags( esc_html( $this->get_meta( $key ) ) ) : $fallback ) . $after;
		}
		return $output;
	}

	protected function get_loaded_headline( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_loaded_meta( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_loaded_meta( $key ) ? $this->format_tags( esc_html( $this->get_loaded_meta( $key ) ) ) : $fallback ) . $after;
		}
		return $output;
	}

	protected function load_meta( $id ) {
		$this->loaded_meta = get_post_meta( $id );
		return;
	}

	protected function unload_meta() {
		$this->loaded_meta = array();
		return;
	}

	protected function get_loaded_meta( $key ) {
		$output = false;
		if ( isset( $this->loaded_meta[ "{$key}" ][0] ) ) {
			if ( ! empty( $this->loaded_meta[ "{$key}" ][0] ) ) {
				$output = $this->loaded_meta[ "{$key}" ][0];
			}
		}
		return $output;
	}

	protected function get_serialized_loaded_meta( $key ) {
		$output = false;
		if ( isset( $this->loaded_meta[ "{$key}" ][0] ) ) {
			if ( ! empty( $this->loaded_meta[ "{$key}" ][0] ) ) {
				$output = maybe_unserialize( $this->loaded_meta[ "{$key}" ][0] );
			}
		}
		return $output;
	}

	protected function get_meta( $key ) {
		$output = false;
		if ( isset( $this->meta[ "{$key}" ][0] ) ) {
			if ( ! empty( $this->meta[ "{$key}" ][0] ) ) {
				$output = $this->meta[ "{$key}" ][0];
			}
		}
		return $output;
	}

	protected function get_serialized_meta( $key ) {
		$output = false;
		if ( isset( $this->meta[ "{$key}" ][0] ) ) {
			if ( ! empty( $this->meta[ "{$key}" ][0] ) ) {
				$output = maybe_unserialize( $this->meta[ "{$key}" ][0] );
			}
		}
		return $output;
	}

	protected function get_option( $key ) {
		$output = false;
		if ( isset( $this->opts[ "{$key}" ] ) ) {
			if ( ! empty( $this->opts[ "{$key}" ] ) ) {
				$output = $this->opts[ "{$key}" ];
			}
		}
		return $output;
	}

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
	// Run a string through Wordpress' content filter
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
}
