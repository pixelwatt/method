<?php

//======================================================================
// CMB2 HELPER FUNCTIONS
//======================================================================

function method_cmb2_tinymce_options( $temp, $class = '' ) {
	$output = array();
	if ( ! empty( $class ) ) {
		$output['tinymce']['body_class'] = $class;
	}
	switch ( $temp ) {
		case 'minimal':
			$output['media_buttons'] = false;
			$output['textarea_rows'] = 8;
			$output['teeny'] = true;
			break;
		default:
			// code...
			break;
	}
	return $output;
}

/**
* Include metabox only on the default page template (page.php). Heavily based of Ed Townend's front-page solution
* @author Rob Clark
*
* @param bool $display
* @param array $meta_box
* @return bool display metabox
*/
function method_cmb2_metabox_include_default_page( $display, $meta_box ) {
	if ( ! isset( $meta_box['show_on']['key'] ) ) {
		return $display;
	}
	if ( 'default-page-template' !== $meta_box['show_on']['key'] ) {
		return $display;
	}
	$post_id = 0;
	// If we're showing it based on ID, get the current ID
	if ( isset( $_GET['post'] ) ) {
		$post_id = $_GET['post'];
	} elseif ( isset( $_POST['post_ID'] ) ) {
		$post_id = $_POST['post_ID'];
	}
	if ( ! $post_id ) {
		return false;
	}
	$front_page = get_option( 'page_on_front' );
	$page_template = get_page_template_slug( $post_id );
	if ( ( empty( $page_template ) ) && ( $post_id != $front_page ) ) {
		$is_it_basic = true;
	} else {
		$is_it_basic = false;
	}
	// there is a front page set and we're on it!
	return $is_it_basic;
}
add_filter( 'cmb2_show_on', 'method_cmb2_metabox_include_default_page', 10, 2 );


/*
Example Usage:

$cmb_options = new_cmb2_box( array(
	'id'            => $prefix . 'metabox',
	'title'         => esc_html__( 'Page Template Options', 'cmb2' ),
	'object_types'  => array( 'page' ),
	'show_on' => array( 'key' => 'default-page-template', 'value' => '' ),
) );
*/


/**
 * Include metabox on front page
 * @author Ed Townend
 * @link https://github.com/CMB2/CMB2/wiki/Adding-your-own-show_on-filters
 *
 * @param bool $display
 * @param array $meta_box
 * @return bool display metabox
 */
function method_cmb2_metabox_include_front_page( $display, $meta_box ) {
	if ( ! isset( $meta_box['show_on']['key'] ) ) {
		return $display;
	}

	if ( 'front-page' !== $meta_box['show_on']['key'] ) {
		return $display;
	}

	$post_id = 0;

	// If we're showing it based on ID, get the current ID
	if ( isset( $_GET['post'] ) ) {
		$post_id = $_GET['post'];
	} elseif ( isset( $_POST['post_ID'] ) ) {
		$post_id = $_POST['post_ID'];
	}

	if ( ! $post_id ) {
		return false;
	}

	// Get ID of page set as front page, 0 if there isn't one
	$front_page = get_option( 'page_on_front' );

	// there is a front page set and we're on it!
	return $post_id == $front_page;
}
add_filter( 'cmb2_show_on', 'method_cmb2_metabox_include_front_page', 10, 2 );


/*
Example usage:

$cmb_options = new_cmb2_box( array(
	'id'            => $prefix . 'metabox',
	'title'         => esc_html__( 'Front Page Options', 'cmb2' ),
	'object_types'  => array( 'page' ),
	'show_on' => array( 'key' => 'front-page', 'value' => '' ),
) );
*/
