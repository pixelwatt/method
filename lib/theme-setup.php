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

add_action( 'after_setup_theme', 'method_run_plugin_dependencies' );

function method_run_plugin_dependencies(): void {
    $autoload = get_template_directory() . '/vendor/autoload.php';
    if ( ! is_readable( $autoload ) ) {
        return;
    }
    require_once $autoload;

    if ( ! class_exists( 'WP_Dependency_Installer' ) ) {
        return;
    }

    $deps = method_collect_plugin_dependencies();
    if ( ! $deps ) {
        return;
    }

    WP_Dependency_Installer::instance( get_template_directory() )
        ->register( $deps )
        ->run();
}

function method_collect_plugin_dependencies(): array {
    $deps = [];

    $dirs = array_unique( [ get_template_directory(), get_stylesheet_directory() ] );
    foreach ( $dirs as $dir ) {
        $file = $dir . '/wp-dependencies.json';
        if ( ! is_readable( $file ) ) {
            continue;
        }
        $decoded = json_decode( (string) file_get_contents( $file ), true );
        if ( is_array( $decoded ) ) {
            $deps = array_merge( $deps, $decoded );
        }
    }

    $deps = apply_filters( 'method/plugin_dependencies', $deps );

    $by_slug = [];
    foreach ( $deps as $dep ) {
        if ( empty( $dep['slug'] ) ) {
            continue;
        }
        $by_slug[ $dep['slug'] ] = $dep;
    }

    return array_values( $by_slug );
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


function method_responsive_embed_wrap( $html ) {
	// Bail on failures, non-strings, or already-wrapped output.
	if ( ! is_string( $html ) || '' === $html || str_contains( $html, 'method-embed' ) ) {
		return $html;
	}

	if ( ! preg_match( '/<iframe[^>]*\bwidth="(\d+)"[^>]*\bheight="(\d+)"/i', $html, $m ) ) {
		return $html;
	}

	return sprintf(
		'<div class="method-embed" style="--embed-ratio: %d / %d">%s</div>',
		(int) $m[1],
		(int) $m[2],
		$html
	);
}

function method_maybe_enable_embed_wrap() {
	if ( ! current_theme_supports( 'method-responsive-embeds' ) ) {
		return;
	}

	add_filter( 'embed_oembed_html', 'method_responsive_embed_wrap', 20 );
	add_filter( 'oembed_result', 'method_responsive_embed_wrap', 20 );
}
add_action( 'after_setup_theme', 'method_maybe_enable_embed_wrap', 11 );


//-----------------------------------------------------
// Method: disable responsive style editing by default.
//
// Child themes can re-enable with:
//   add_theme_support( 'method-responsive-editing' );
// or via the filter:
//   add_filter( 'method/responsive_editing_enabled', '__return_true' );
//
// Rendering of saved responsive styles is unaffected — this
// gates the editing UI only.
//-----------------------------------------------------

function method_configure_responsive_editing( $settings ) {
	$enabled = current_theme_supports( 'method-responsive-editing' );

	/**
	 * Filter whether the responsive editing UI is available.
	 *
	 * @param bool $enabled Default false unless child theme declares support.
	 */
	$enabled = apply_filters( 'method/responsive_editing_enabled', $enabled );

	$settings['responsiveEditingEnabled'] = (bool) $enabled;

	return $settings;
}
add_filter( 'block_editor_settings_all', 'method_configure_responsive_editing' );