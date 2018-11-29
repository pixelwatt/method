<?php
	
//======================================================================
//
// FUNCTIONS.PHP
//
// Table of Contents:
// 1. Initial Setup
// 2. Kirki Setup
// 3. Custom Post Types
// 4. Custom Taxonomies
// 5. Helper Functions
// 6. Content Generation Functions
// 7. CMB2 Helper Functions
// 8. Meta Boxes
//
//======================================================================


//======================================================================
// 1. INITIAL SETUP
//======================================================================


//-----------------------------------------------------
// Import a custom navwalker for Bootstrap 4
//-----------------------------------------------------

require_once get_template_directory() . '/inc/class-wp-bootstrap-navwalker.php';


//-----------------------------------------------------
// Theme and Post Support
//-----------------------------------------------------

add_theme_support( 'title-tag' );			// Add theme support for the title tag
add_theme_support( 'post-thumbnails' );		// Add theme support for post thumbnails

function spitfire_after_setup_theme() {
add_theme_support( 'html5', array( 'search-form' ) );
}
add_action( 'after_setup_theme', 'spitfire_after_setup_theme' );


//-----------------------------------------------------
// Configure required plugins
//-----------------------------------------------------

require_once get_template_directory() . '/inc/class-tgm-plugin-activation.php';

add_action( 'tgmpa_register', 'spitfire_register_required_plugins' );

function spitfire_register_required_plugins() {
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

        array(
            'name'      => 'Kirki',
            'slug'      => 'kirki',
            'required'  => true,
        ),

        array(
            'name'      => 'Ninja Forms',
            'slug'      => 'ninja-forms',
            'required'  => true,
        ),

        /*
        array(
            'name'      => 'SVG Support',
            'slug'      => 'svg-support',
            'required'  => true,
        ),
        */

        /*
        array(
			'name'      => 'cmb2-field-post-search-ajax',
			'slug'      => 'cmb2-field-post-search-ajax',
			'source'    => 'https://github.com/alexis-magina/cmb2-field-post-search-ajax/archive/master.zip',
			'required'  => true,
			'force_activation'   => false, // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch.
		),
		*/

        /*
        array(
			'name'      => 'CMB2 Roadway Segments',
			'slug'      => 'cmb2-roadway-segments',
			'source'    => 'https://github.com/pixelwatt/cmb2-roadway-segments/archive/master.zip',
			'required'  => true,
		),
		*/

        /*
        array(
            'name'      => 'Classic Editor',
            'slug'      => 'classic-editor',
            'required'  => true,
        ),
        */

	);

	$config = array(
		'id'           => 'spitfire',                 // Unique ID for hashing notices for multiple instances of TGMPA.
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
// Enqueue scripts and styles
//-----------------------------------------------------

function spitfire_scripts() {
	wp_enqueue_style( 'spitfire', get_template_directory_uri().'/theme.min.css', '', '1.0.0' );
	wp_enqueue_style( 'fontawesome', 'https://use.fontawesome.com/releases/v5.5.0/css/all.css' );
	wp_enqueue_script( 'scripts', get_template_directory_uri().'/assets/js/scripts.min.js', array('jquery'), '1.0.0', false );
    
	if ( ! is_admin() ) {
        wp_deregister_script( 'jquery' );
        wp_register_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js', false, '3.3.1' );
        wp_enqueue_script( 'jquery' );
    }

}

add_action( 'wp_enqueue_scripts', 'spitfire_scripts' );


//======================================================================
// 2. KIRKI CONFIG
//======================================================================


if ( class_exists( 'Kirki' ) ) {

    // Set up the Kirki config

    Kirki::add_config( 'spitfire', array(
        'capability'  => 'edit_theme_options',
        'option_type' => 'theme_mod',
    ) );

    // Set up a panel to store all of this config's fields under

    Kirki::add_panel( 'theme_options', array(
        'priority'    => 10,
        'title'       => __( 'spitfire Theme Options', 'crossfitrtr' ),
        'description' => __( 'Here, you can modify custom options for the spitfire theme.', 'crossfitrtr' ),
    ) );

    // Add social media link options

    Kirki::add_section( 'social_options', array(
		'title'          => __( 'Social Accounts' ),
		'description'    => __( 'Here, add primary social media accounts.' ),
		'panel'          => 'theme_options', // Not typically needed.
		'priority'       => 160,
		'capability'     => 'edit_theme_options',
		'theme_supports' => '', // Rarely needed.
	) );

	Kirki::add_field( 'spitfire', array(
		'type'        => 'repeater',
		'label'       => esc_attr__( 'Social Links', 'spitfire' ),
		'description' => esc_attr__( 'Add social links here.', 'spitfire' ),
		'section'     => 'social_options',
		'priority'    => 10,
		'row_label' => array(
			'type' => 'text',
			'value' => esc_attr__( 'Social Link', 'spitfire' ),
		),
		'settings'    => 'spitfire_social',
		'fields' => array(
			'service' => array(
				'type'        => 'radio',
				'label'       => esc_attr__( 'Service', 'spitfire' ),
				'description' => esc_attr__( 'Which service are you adding a link for?', 'spitfire' ),
				'default'     => 'facebook',
				'multiple'    => 0,
				'choices'     => array(
					'facebook' => esc_attr__( 'Facebook', 'spitfire' ),
					'twitter' => esc_attr__( 'Twitter', 'spitfire' ),
					'linkedin' => esc_attr__( 'LinkedIn', 'spitfire' ),
					'instagram' => esc_attr__( 'Instagram', 'spitfire' ),
					'pinterest' => esc_attr__( 'Pinterest', 'spitfire' ),
					'youtube' => esc_attr__( 'YouTube', 'spitfire' ),
				),
			),
			'url' => array(
				'type'        => 'text',
				'label'       => esc_attr__( 'Profile URL', 'spitfire' ),
				'description' => esc_attr__( 'Enter the full URL for your profile.', 'spitfire' ),
				'default'     => '',
			),
		),
	) );

}


//======================================================================
// 3. CUSTOM POST TYPES
//======================================================================


/*

add_action( 'init', 'spitfire_news_init' );

function spitfire_news_init() {
	$labels = array(
		'name'               => _x( 'News', 'post type general name', 'spitfire' ),
		'singular_name'      => _x( 'News Item', 'post type singular name', 'spitfire' ),
		'menu_name'          => _x( 'News', 'admin menu', 'spitfire' ),
		'name_admin_bar'     => _x( 'News Item', 'add new on admin bar', 'spitfire' ),
		'add_new'            => _x( 'Add News Item', 'job', 'spitfire' ),
		'add_new_item'       => __( 'Add New News Item', 'spitfire' ),
		'new_item'           => __( 'New News Item', 'spitfire' ),
		'edit_item'          => __( 'Edit News Item', 'spitfire' ),
		'view_item'          => __( 'View News Item', 'spitfire' ),
		'all_items'          => __( 'News', 'spitfire' ),
		'search_items'       => __( 'Search News', 'spitfire' ),
		'parent_item_colon'  => __( 'Parent News:', 'spitfire' ),
		'not_found'          => __( 'No news found.', 'spitfire' ),
		'not_found_in_trash' => __( 'No news found in Trash.', 'spitfire' )
	);

	$args = array(
		'labels'             => $labels,
		'description'        => __( 'Church news updates.', 'spitfire' ),
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'query_var'          => true,
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position' 	 => 5,
		'menu_icon'			 => 'dashicons-megaphone',
		'supports'           => array( 'title' , 'editor' )
	);

	register_post_type( 'news', $args );
}

*/


//======================================================================
// 4. CUSTOM TAXONOMIES
//======================================================================


// Declare custom taxonomies here.

/*
add_action( 'init', 'spitfire_register_mytax', 0 );

function spitfire_register_mytax() 
{
	// Add new taxonomy, make it hierarchical (like categories)
	$labels = array(
		'name' => _x( 'My Tax Terms', 'taxonomy general name' ),
		'singular_name' => _x( 'My Tax Term', 'taxonomy singular name' ),
		'search_items' =>  __( 'Search My Tax Terms' ),
		'all_items' => __( 'All My Tax Terms' ),
		'parent_item' => __( 'Parent My Tax Term' ),
		'parent_item_colon' => __( 'Parent My Tax Term:' ),
		'edit_item' => __( 'Edit My Tax Term' ), 
		'update_item' => __( 'Update My Tax Term' ),
		'add_new_item' => __( 'Add New My Tax Term' ),
		'new_item_name' => __( 'New My Tax Term Name' ),
		'menu_name' => __( 'My Tax Term' ),
	); 	

	register_taxonomy('mytax',array('myposttype'), array(
		'hierarchical' => true,
		'labels' => $labels,
		'show_ui' => true,
		'query_var' => true,
		'rewrite' => array( 'slug' => 'mytax' ),
		'show_admin_column' => true
	));
}
*/


//======================================================================
// 5. HELPER FUNCTIONS
//======================================================================


//-----------------------------------------------------
// Get common CSS classes
//-----------------------------------------------------

function spitfire_get_class( $class ) {
	$output = '';

	if ( ! empty( $class ) ) {
		switch ( $class ) {
			case 'full_width_outer_col':
				$output = 'col-12 col-sm-11';
				break;
			case 'full_width_container':
				$output = 'full-width-container';
				break;
			default:
				break;
		}
	}

	return $output;
}


//-----------------------------------------------------
// Run a string through Wordpress' content filter
//-----------------------------------------------------

function spitfire_filter_content($content) {
    if (!empty($content)) {
        $content = apply_filters('the_content',$content);
    }
    return $content;
}


//-----------------------------------------------------
// Get content by ID
//-----------------------------------------------------


function spitfire_get_content( $id ) {
	$content_post = get_post( $id );
	$content = $content_post->post_content;
	$content = apply_filters('the_content', $content);
	$content = str_replace(']]>', ']]&gt;', $content);
	return $content;
}


//-----------------------------------------------------
// Return social icons in unordered list.
//-----------------------------------------------------

function spitfire_get_social_icons() {
	$output = '';

	$social_links = get_theme_mod( 'spitfire_social' );
	if ( ! empty( $social_links ) ) {
		if ( is_array( $social_links ) ) {
			$output .= '<ul class="s-ics">';

			foreach ( $social_links as $link ) {
				$service = ( isset( $link['service'] ) ? ( ! empty( $link['service'] ) ? $link['service'] : 'facebook' ) : 'facebook' );

				switch ( $service ) {
					case 'facebook':
						$fa = 'fab fa-facebook-f';
						break;
					case 'twitter':
						$fa = 'fab fa-twitter';
						break;
					case 'linkedin':
						$fa = 'fab fa-linkedin-in';
						break;
					case 'instagram':
						$fa = 'fab fa-instagram';
						break;
					case 'pinterest':
						$fa = 'fab fa-pinterest';
						break;
					case 'youtube':
						$fa = 'fab fa-youtube';
						break;
					default:
						$fa = 'fab fa-facebook-f';
						break;
				}

				$output .= ' <li>' . ( isset( $link['url'] ) ? ( ! empty( $link['url'] ) ? '<a href="' . $link['url'] . '">' : '' ) : '' ) . '<i class="' . $fa . '"></i><span class="sr-only sr-only-focusable"> ' . ucwords( $service ) . '</span>' . ( isset( $link['url'] ) ? ( ! empty( $link['url'] ) ? '</a>' : '' ) : '' ) . '</li>';
			}

			$output .= '</ul>';
		}
	}

	return $output;
}


//======================================================================
// 6. CONTENT GENERATION FUNCTIONS
//======================================================================


// Place content generation functions here.


//======================================================================
// 7. CMB2 HELPER FUNCTIONS
//======================================================================


/**
* Include metabox only on the default page template (page.php). Heavily based of Ed Townend's front-page solution
* @author Rob Clark
*
* @param bool $display
* @param array $meta_box
* @return bool display metabox
*/
function cmb2_metabox_include_default_page( $display, $meta_box ) {
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
    if ( ( empty($page_template) ) && ( $post_id != $front_page ) ) {
        $is_it_basic = true;
    } else {
        $is_it_basic = false;	
    }
    // there is a front page set and we're on it!
    return $is_it_basic;
}
add_filter( 'cmb2_show_on', 'cmb2_metabox_include_default_page', 10, 2 );


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
function ed_metabox_include_front_page( $display, $meta_box ) {
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
add_filter( 'cmb2_show_on', 'ed_metabox_include_front_page', 10, 2 );


/*
Example usage:
	
$cmb_options = new_cmb2_box( array(
	'id'            => $prefix . 'metabox',
	'title'         => esc_html__( 'Front Page Options', 'cmb2' ),
	'object_types'  => array( 'page' ),
	'show_on' => array( 'key' => 'front-page', 'value' => '' ),
) );
*/