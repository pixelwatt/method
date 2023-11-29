<?php

//-----------------------------------------------------
// Theme and Post Support
//-----------------------------------------------------

function method_enable_theme_support() {

	// Add theme support for html5 markup
	$args = array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'script',
		'style',
	);
	add_theme_support( 'html5', $args );

	// Add theme support for the title tag
	add_theme_support( 'title-tag' );

	// Add theme support for post thumbnails
	add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'method_enable_theme_support' );


function method_register_custom_nav_menus() {
	register_nav_menus(
		array(
			'primary' => 'Primary',
		)
	);
}
add_action( 'after_setup_theme', 'method_register_custom_nav_menus' );


//-----------------------------------------------------
// Custom Image Sizes
//-----------------------------------------------------

add_image_size( 'method_1400_600', 1400, 600, true );


//-----------------------------------------------------
// Enqueue scripts and styles
//-----------------------------------------------------

function method_scripts() {
	wp_enqueue_style( 'method', get_template_directory_uri() . '/theme.min.css', '', '1.4.3' );
	wp_enqueue_script( 'method', get_template_directory_uri() . '/assets/js/scripts.min.js', array( 'jquery' ), '1.4.3', false );


}

add_action( 'wp_enqueue_scripts', 'method_scripts' );


//-----------------------------------------------------
// Set option key for Method_Utility class
//-----------------------------------------------------

function method_method_utility_option_key_callback( $string ) {
    // (maybe) modify $string.
    return 'method_options';
}
add_filter( 'method_utility_option_key', 'method_method_utility_option_key_callback', 10, 1 );


//-----------------------------------------------------
// Configure required plugins
//-----------------------------------------------------

require_once get_template_directory() . '/inc/tgm-plugin-activation/class-tgm-plugin-activation.php';

add_action( 'tgmpa_register', 'method_register_required_plugins' );

function method_register_required_plugins() {
	/*
	 * Array of plugin arrays. Required keys are name and slug.
	 * If the source is NOT from the .org repo, then source is also required.
	 */
	$plugins = array(

		array(
			'name'      => 'CMB2',
			'slug'      => 'cmb2',
			'required'  => true,
		),

	);

	$config = array(
		'id'           => 'method',                 // Unique ID for hashing notices for multiple instances of TGMPA.
		'default_path' => '',                      // Default absolute path to bundled plugins.
		'menu'         => 'tgmpa-install-plugins', // Menu slug.
		'parent_slug'  => 'themes.php',            // Parent menu slug.
		'capability'   => 'edit_theme_options',    // Capability needed to view plugin install page, should be a capability associated with the parent menu used.
		'has_notices'  => true,                    // Show admin notices or not.
		'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
		'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
		'is_automatic' => true,                   // Automatically activate plugins after installation or not.
		'message'      => '',                      // Message to output right before the plugins table.
	);

	tgmpa( $plugins, $config );
}


//-----------------------------------------------------
// Function for conditionally enabling the block editor
// for specific posts. Uncomment and modify as needed.
//-----------------------------------------------------
/* 
function method_enable_block_editor_for_post( $use_block_editor, $post ) {
	$output = false;
	$id = $post->ID;
	$pt = get_post_type( $id );
	if ( 'page' == $pt ) {
		$template = get_post_meta( $id, '_wp_page_template', true );
		if ( 'templates/page-template-mytemplate.php' == $template ) {
			$output = true;
		}
	}
	return $output;
}

add_filter( 'use_block_editor_for_post', 'method_enable_block_editor_for_post', 10, 2 );
*/


//-----------------------------------------------------
// Function for condigitally suppressing specific
// WordPress features, mainly the editor. Uncomment
// and modify as needed.
//-----------------------------------------------------
/*
function method_remove_editor() {
	if ( isset( $_GET['post'] ) ) {
		$id = $_GET['post'];
		$pt = get_post_type( $id );
		if ( 'page' == $pt ) {
			$template = get_post_meta( $id, '_wp_page_template', true );
			$front_page = get_option( 'page_on_front' );
			if ( $id == $front_page ) {
				remove_post_type_support( 'page', 'editor' );
			}
			switch ( $template ) {
				case 'templates/page-template-gateway.php':
					remove_post_type_support( 'page', 'editor' );
					break;
				default:
					# code...
					break;
			}
		}
	}
	return;
}
add_action( 'init', 'method_remove_editor' );
*/
