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
            'name'      => 'Ninja Forms',
            'slug'      => 'ninja-forms',
            'required'  => true,
        ),

        array(
            'name'      => 'Classic Editor',
            'slug'      => 'classic-editor',
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
            'name'      => 'Kirki',
            'slug'      => 'kirki',
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
	wp_enqueue_style( 'spitfire', get_template_directory_uri().'/theme.min.css', '', '1.0.3' );
	wp_enqueue_style( 'fontawesome', get_template_directory_uri().'/inc/fontawesome/css/all.min.css' );
	wp_enqueue_script( 'scripts', get_template_directory_uri().'/assets/js/scripts.min.js', array('jquery'), '1.0.3', false );
    
	if ( ! is_admin() ) {
        wp_deregister_script( 'jquery' );
        wp_register_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js', false, '3.3.1' );
        wp_enqueue_script( 'jquery' );
    }

}

add_action( 'wp_enqueue_scripts', 'spitfire_scripts' );


//======================================================================
// 2. THEME OPTIONS
//======================================================================

add_action( 'cmb2_admin_init', 'spitfire_register_theme_options_metabox' );

function spitfire_register_theme_options_metabox() {

	/**
	 * Registers options page menu item and form.
	 */
	$cmb_options = new_cmb2_box( array(
		'id'           => 'spitfire_theme_options_metabox',
		'title'        => esc_html__( 'spitfire Theme Options', 'spitfire' ),
		'object_types' => array( 'options-page' ),

		/*
		 * The following parameters are specific to the options-page box
		 * Several of these parameters are passed along to add_menu_page()/add_submenu_page().
		 */

		'option_key'      => 'spitfire_options', // The option key and admin menu page slug.
		// 'icon_url'        => 'dashicons-palmtree', // Menu icon. Only applicable if 'parent_slug' is left empty.
		'menu_title'      => esc_html__( 'Theme Options', 'spitfire' ), // Falls back to 'title' (above).
		'parent_slug'     => 'themes.php', // Make options page a submenu item of the themes menu.
		// 'capability'      => 'manage_options', // Cap required to view options-page.
		// 'position'        => 1, // Menu position. Only applicable if 'parent_slug' is left empty.
		// 'admin_menu_hook' => 'network_admin_menu', // 'network_admin_menu' to add network-level options page.
		// 'display_cb'      => false, // Override the options-page form output (CMB2_Hookup::options_page_output()).
		// 'save_button'     => esc_html__( 'Save Theme Options', 'myprefix' ), // The text for the options-page save button. Defaults to 'Save'.
	) );

	$cmb_options->add_field( array(
        'name'     => __( '<span style="font-size: 1.25rem; font-weight: 800; line-height: 1; text-transform: none;">Social Media Accounts</span>', 'cmb2' ),
        //'desc'     => __( 'Below, add images for this investment.', 'cmb2' ),
        'id'       => 'social_info',
        'type'     => 'title',
    ) );

	$group_field_social_accounts = $cmb_options->add_field( array(
		'id'          => 'social_accounts',
		'type'        => 'group',
		'description' => __( 'Configure social account links below.', 'spitfire' ),
		// 'repeatable'  => false, // use false if you want non-repeatable group
		'options'     => array(
			'group_title'       => __( 'Account {#}', 'spitfire' ), // since version 1.1.4, {#} gets replaced by row number
			'add_button'        => __( 'Add Another Account', 'spitfire' ),
			'remove_button'     => __( 'Remove Account', 'spitfire' ),
			'sortable'          => true,
			'closed'         => true, // true to have the groups closed by default
			// 'remove_confirm' => esc_html__( 'Are you sure you want to remove?', 'cmb2' ), // Performs confirmation before removing group.
		),
	) );

	$cmb_options->add_group_field( $group_field_social_accounts, array(
		'name' => 'Service',
		'id'   => 'service',
		'type' => 'radio',
		'default' => 'facebook',
		'desc' => __( 'Which service are you adding a link for?', 'spitfire' ),
		'options' => array(
			'facebook' => esc_attr__( 'Facebook', 'spitfire' ),
			'twitter' => esc_attr__( 'Twitter', 'spitfire' ),
			'linkedin' => esc_attr__( 'LinkedIn', 'spitfire' ),
			'instagram' => esc_attr__( 'Instagram', 'spitfire' ),
			'pinterest' => esc_attr__( 'Pinterest', 'spitfire' ),
			'youtube' => esc_attr__( 'YouTube', 'spitfire' ),
		),
	) );

	$cmb_options->add_group_field( $group_field_social_accounts, array(
		'name' => __( 'Profile URL', 'spitfire' ),
		'desc' => __( 'Enter the full URL for your profile.', 'spitfire' ),
		'id'   => 'url',
		'type' => 'text_url',
	) );

	/*
	 * Options fields ids only need
	 * to be unique within this box.
	 * Prefix is not needed.
	 */

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

//======================================================================
// 6. CONTENT GENERATION FUNCTIONS
//======================================================================


class spitfire_layout {
	private $elements = array();
	private $meta = array();
	private $opts = array();
	private $id;
	private $html;
	private $modals;
	private $scripts;
	private $attr = array();

	public function build_page( $pid='', $archive=false ) {
		$this->opts = get_option( 'spitfire_options' );
		if ( true == $archive ) {
			global $wp_query;
			$this->attr['is_archive'] = true;
			$this->attr['post_type'] = ( spitfire_check_key( $wp_query->query_vars['post_type'] ) ? $wp_query->query_vars['post_type'] : 'post' );
			if ( 'post' == $this->attr['post_type'] ) {
				$this->attr['category'] = ( spitfire_check_key( $wp_query->queried_object->name ) ? $wp_query->queried_object->name : '' );
			}
			$this->attr['taxonomy'] = ( spitfire_check_key( $wp_query->query_vars['taxonomy'] ) ? $wp_query->query_vars['taxonomy'] : '' );
			$this->determine_attributes();
			$this->build_layout();
			return $this->html . $this->modals . $this->scripts;
		}
		elseif ( ( ! empty( $pid ) ) && ( false == $archive ) ) {
			$this->attr['is_archive'] = false;
			$this->attr['post_type'] = get_post_type( $this->id );
			$this->id = $pid;
			$this->meta = get_post_meta( $this->id );
			$this->determine_attributes();
			$this->build_layout();
			return $this->html . $this->modals . $this->scripts;
		} else {
			return false;
		}
	}


	private function determine_attributes() {
		global $wp_query;
		if ( true == $this->attr['is_archive'] ) {
			switch ( $this->attr['post_type'] ) {
				case 'post':
					$this->attr['components'] = array( 'components' );
					break;
			}
		} else {
			switch ( $this->attr['post_type'] ) {
				case 'page':
					$fp = get_option( 'page_on_front' );
					if ( $fp == $this->id ) {
						$this->attr['components'] = array( 'components' );
					} else {
						$template = get_page_template_slug( $this->id );
						switch ( $template ) {
							case 'templates/page-template-custom.php':
								$this->attr['components'] = array( 'components' );
								break;
							default:
								$this->attr['components'] = array( 'components' );
								break;
						}
					}
					break;
				case 'post':
					$this->attr['components'] = array( 'components' );
					break;
				default:
					break;
			}
		}
		return;
	}


	private function build_layout() {
		$this->build_header();
		$this->build_components();
		$this->build_footer();
		return;
	}


	private function build_header() {
		$this->scripts .= '

		';
		$this->html .= '
		
		';
		return;
	}


	private function build_footer() {
		$this->html .= '
		
		';
		return;
	}


	private function inject_modal( $mid, $mclass='', $title, $content, $prefiltered=false, $lg=false, $scrollable=false ) {
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
      						' . ( $prefiltered ? $content : spitfire_filter_content( $content ) ) . '
      					</div>  
    				</div>
  				</div>
			</div>

		';
	}


	private function build_components() {
		if ( true == $this->attr['is_archive'] ) {
			global $wp_query;
		}
		foreach ( $this->attr['components'] as $component ) {
			switch ( $component ) {
				case 'component':
					$this->html .= '

					';
					break;
				default:
					break;
			}
		}
		return;
	}


	private function array_to_ul( $array ) {
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


	private function get_meta( $key ) {
		$output = false;
		if ( isset( $this->meta["{$key}"][0] ) ) {
			if ( ! empty( $this->meta["{$key}"][0] ) ) {
				$output = $this->meta["{$key}"][0];
			}
		}
		return $output;
	}


	private function get_option( $key ) {
		$output = false;
		if ( isset( $this->opts["{$key}"] ) ) {
			if ( ! empty( $this->opts["{$key}"] ) ) {
				$output = $this->opts["{$key}"];
			}
		}
		return $output;
	}

	private function build_social_icons() {
		$output = '';

		$social_links = $this->get_option( 'social_accounts' );
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

	/*
	Usage for archive pages:
	get_header();
	$layout = new spitfire_layout;
	echo $layout->build_page( '', true );
	get_footer();

	Usage for single pages:
	get_header();
	$layout = new spitfire_layout;
	echo $layout->build_page( $post->ID );
	get_footer();

	*/
}


function spitfire_check_key( $key ) {
	$output = $fb;
	if ( isset( $key ) ) {
		if ( ! empty( $key ) ) {
			$output = true;
		}
	}
	return $output;
}


if (!function_exists('array_key_first')) {
    function array_key_first(array $arr) {
        foreach($arr as $key => $unused) {
            return $key;
        }
        return NULL;
    }
}


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