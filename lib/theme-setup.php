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


	add_theme_support( 'editor-gradient-presets' );

	add_theme_support('editor-styles');
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

add_image_size( 'method_hd', 1920, 1080, true );
add_image_size( 'method_qhd', 2560, 1440, true );


//-----------------------------------------------------
// Make image sizes available in the block editor
//-----------------------------------------------------

add_filter( 'wp_prepare_attachment_for_js', function( $response, $attachment ) {
	if ( $attachment->post_type === 'attachment' && wp_attachment_is_image( $attachment->ID ) ) {
		$sizes = array( 'method_hd', 'method_qhd' );
		foreach ( $sizes as $size ) {
			$image = wp_get_attachment_image_src( $attachment->ID, $size );
			if ( $image ) {
				$response['sizes']["{$size}"] = [
					'url'    => $image[0],
					'width'  => $image[1],
					'height' => $image[2],
					'orientation' => $image[1] > $image[2] ? 'landscape' : 'portrait',
				];
			}
		}
	}
	return $response;
}, 10, 2 );


add_theme_support( 'editor-image-sizes' );

add_filter( 'block_editor_settings_all', function( $settings ) {
	$settings['imageSizes'][] = [
		'slug' => 'method_hd',
		'name' => __( 'HD', 'your-textdomain' ),
		// Note: you can also include width/height, but it's optional here
	];
	$settings['imageSizes'][] = [
		'slug' => 'method_qhd',
		'name' => __( 'QHD', 'your-textdomain' ),
		// Note: you can also include width/height, but it's optional here
	];
	return $settings;
} );


//-----------------------------------------------------
// Enqueue scripts and styles
//-----------------------------------------------------

function method_scripts() {
	//wp_enqueue_style( 'method-front', get_template_directory_uri() . '/assets/css/front.min.css', '', METHOD_VERSION );
	wp_enqueue_script( 'method', get_template_directory_uri() . '/assets/js/scripts.min.js', array( 'jquery' ), METHOD_VERSION, false );

	wp_enqueue_script( 'jarallax', get_template_directory_uri() . '/inc/jarallax/jarallax.min.js', array(), METHOD_VERSION, false );
	wp_enqueue_script( 'jarallax-video', get_template_directory_uri() . '/inc/jarallax/jarallax-video.min.js', array( 'jarallax' ), METHOD_VERSION, false );

	wp_enqueue_script('swiper', get_template_directory_uri() . '/inc/swiper/swiper-bundle.min.js',  array(), METHOD_VERSION, true);
    wp_enqueue_style('swiper', get_template_directory_uri() . '/inc/swiper/swiper-bundle.min.css');
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

add_filter('http_request_args', function($args, $url) {
    static $auth_header = null;
    static $initialized = false;

    if (!$initialized) {
        $initialized = true;
        $options = get_option('method_options');
        if (!empty($options['http_auth_enabled']) && !empty($options['http_auth_user']) && !empty($options['http_auth_pass'])) {
            $auth_header = 'Basic ' . base64_encode($options['http_auth_user'] . ':' . $options['http_auth_pass']);
        }
    }

    if ($auth_header) {
        static $site_host = null;
        $site_host ??= parse_url(site_url(), PHP_URL_HOST);
        if (parse_url($url, PHP_URL_HOST) === $site_host) {
            $args['headers']['Authorization'] = $auth_header;
        }
    }

    return $args;
}, 10, 2);


function method_inject_gtag() {
	$util = new Method_Utility;
	if ( ( $util->get_option('ga_enable') ) && ( $util->get_option('ga_id') ) ) {
    ?>
        <!-- Google tag (gtag.js) -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo $util->get_option('ga_id'); ?>"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());

			gtag('config', '<?php echo $util->get_option('ga_id'); ?>');
		</script>
    <?php
	}
}
add_action('wp_head', 'method_inject_gtag');