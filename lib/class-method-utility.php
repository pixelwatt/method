<?php

//======================================================================
//
// METHOD UTILITY CLASS
//
// This is a stripped down version of the layout class for dealing with
// post meta and theme options. 
//
//======================================================================

class Method_Utility {
	protected $loaded_meta = array();
	protected $opts        = array();

	function __construct() {
		$option_key = apply_filters( 'method_utility_option_key', 'method_options');
		$this->opts = get_option( $option_key );
	}

	public function load_meta( $id ) {
		$this->loaded_meta = get_post_meta( $id );
		return;
	}

	public function unload_meta() {
		$this->loaded_meta = array();
		return;
	}

	public function get_loaded_meta( $key, $fallback = '' ) {
		$output = false;
		if ( $this->check_array_key( $this->loaded_meta, $key ) ) {
			if ( $this->check_array_key( $this->loaded_meta[ "{$key}" ], 0 ) ) {
				$output = $this->loaded_meta[ "{$key}" ][0];
			}
		}
		return ( false === $output ? ( ! empty( $fallback ) ? $fallback : false ) : $output );
	}

	public function get_serialized_loaded_meta( $key ) {
		$output = false;
		if ( $this->check_array_key( $this->loaded_meta, $key ) ) {
			if ( $this->check_array_key( $this->loaded_meta[ "{$key}" ], 0 ) ) {
				$output = maybe_unserialize( $this->loaded_meta[ "{$key}" ][0] );
			}
		}
		return $output;
	}

	public function get_loaded_headline( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_loaded_meta( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_loaded_meta( $key ) ? $this->format_tags( esc_html( $this->get_loaded_meta( $key ) ) ) : $fallback ) . $after;
		}
		return $output;
	}

	public function get_loaded_content( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_loaded_meta( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_loaded_meta( $key ) ? $this->filter_content( $this->get_loaded_meta( $key ) ) : $fallback ) . $after;
		}
		return $output;
	}

	public function get_option( $key, $fallback = '' ) {
		$output = false;
		if ( $this->check_array_key( $this->opts, $key ) ) {
			$output = $this->opts[ "{$key}" ];
		}
		return ( false === $output ? ( ! empty( $fallback ) ? $fallback : false ) : $output );
	}

	public function get_headline_from_option( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_option( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_option( $key ) ? $this->format_tags( esc_html( $this->get_option( $key ) ) ) : $fallback ) . $after;
		}
		return $output;
	}

	public function get_content_from_option( $key, $before, $after, $fallback = '' ) {
		$output = '';
		if ( ( $this->get_option( $key ) ) || ( ! empty( $fallback ) ) ) {
			$output = $before . ( $this->get_option( $key ) ? $this->filter_content( $this->get_option( $key ) ) : $fallback ) . $after;
		}
		return $output;
	}

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

	public function filter_content( $content ) {
		if ( ! empty( $content ) ) {
			$content = apply_filters( 'the_content', $content );
		}
		return $content;
	}

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
		return $this->str_replace_assoc( apply_filters( 'method_utility_format_tags', $tags ), $text );
	}

	public function format_headline( $text ) {
		return $this->format_tags( esc_html( $text ) );
	}

	public function str_replace_assoc( array $replace, $subject ) {
		return str_replace( array_keys( $replace ), array_values( $replace ), $subject );
	}
}