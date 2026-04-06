<?php

// Block registrations

function register_method_section_block() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_section_block'
    ]);
}
add_action( 'init', 'register_method_section_block' );

function method_section_enqueue_assets() {
    wp_enqueue_script('jarallax', get_template_directory_uri() . '/inc/jarallax/jarallax.min.js', [], null, true);
    wp_enqueue_script('jarallax-video', get_template_directory_uri() . '/inc/jarallax/jarallax-video.min.js', ['jarallax'], null, true);

    wp_enqueue_script('vegas', get_template_directory_uri() . '/inc/vegas/vegas-global.js', [], null, true);
    wp_enqueue_style('vegas', get_template_directory_uri() . '/inc/vegas/vegas.min.css');
}
add_action('enqueue_block_assets', 'method_section_enqueue_assets');

add_filter('script_loader_tag', function($tag, $handle) {
    if ($handle === 'vegas') {
        return str_replace('<script ', '<script type="module" ', $tag);
    }
    return $tag;
}, 10, 2);



function render_method_section_block( $block_attributes, $content, $block ) {
    $post_id = $block->context['postId'] ?? get_the_ID();
    $methodId = uniqid( 'method-' );
    $align = method_get_responsive_setting( $block_attributes, 'base', 'alignItems' );

    $extraClasses = '';
    if ( method_check_array_key( $block_attributes, 'align' ) ) {
        if ( ( 'full' == $block_attributes['align'] ) && ( ! method_check_array_key( $block_attributes, 'unconstrained' ) ) ) {
            //$extraClasses = ' is-layout-constrained wp-block-block has-global-padding';
        }
    }

    $cssargs = array(
        '#' . $methodId => array( 'borderRadius', 'marginLeftNonZero', 'marginRightNonZero', 'margin-top', 'margin-bottom', 'boxShadow', 'zIndex', 'overflow' ),
        '#' . $methodId . ' > .method-section-content' => array( 'color', 'bgColor', 'borderRadius', 'border', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'fontSize', 'lineHeight', 'height', 'minHeight', 'alignItems' ),
        '#' . $methodId . ' > .method-section-content > .method-section-shade' => array( 'bgShade' ),
        '#' . $methodId . ' a' => array( 'linkColor' )
    );

    $contentWrap = '';
    $imgElement = '';
    $chosenImg = '';
    $bgimgData = '';

    $bgMedia = $block_attributes['bgMedia'] ?? '';

    if ( $bgMedia === 'slideshow' ) {
        $contentWrap = '<div class="method-section-content">';
        $images = $block_attributes['images'] ?? [];
        if ( ! empty( $images ) ) {
            $slides = array_map( fn( $img ) => [ 'src' => $img['url'] ], $images );
            $bgimgData = ' data-vegas-slides="' . esc_attr( wp_json_encode( $slides ) ) . '"';
        }
    } elseif ( ( ! method_check_array_key( $block_attributes, 'useParallax' ) ) && ( ! method_check_array_key( $block_attributes, 'bgVideo' ) ) ) {
        $cssargs["#{$methodId}  > .method-section-content > .method-section-bgimg"] = array( 'bgImg', 'bgPosition', 'bgSize', 'bgRepeat' );
        $contentWrap = '<div class="method-section-content">';
    } else {
        $contentWrap = '<div class="method-section-content jarallax" data-jarallax data-speed="0.8"' . ( method_check_array_key( $block_attributes, 'bgVideo' ) ? ' data-video-src="' . $block_attributes['bgVideo'] . '"' : '' ) . '>';

        if ( method_check_array_key( $block_attributes, 'useFeaturedImage' ) ) {
            $chosenSize = method_get_responsive_setting( $block_attributes, 'base', 'featuredImageSize', 'full' );
            $chosenImg = get_the_post_thumbnail( $post_id, $chosenSize, array( 'class' => 'jarallax-img' ) );
        } elseif ( method_check_array_key( $block_attributes, 'bgImg' ) ) {
            if ( method_check_array_key( $block_attributes['bgImg'], 'id' ) ) {
                $chosenSize = method_get_responsive_setting( $block_attributes, 'base', 'bgImgSize', 'full' );
                $chosenImg = wp_get_attachment_image( $block_attributes['bgImg']['id'], $chosenSize, false, array( 'class' => 'jarallax-img' ) );
            }
        }
    }

    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false, $post_id );
    method_collect_css( $responsive, '#' . $methodId, 10);

    $output = '
        <div ' . get_block_wrapper_attributes( ['class' => 'method-section', 'id' => $methodId] ) . '>
            ' . $contentWrap . '
                ' . $chosenImg . '
                <div class="method-section-bgimg"' . $bgimgData . '>&nbsp;</div>
                <div class="method-section-shade">&nbsp;</div>
                <div class="method-section-content-inner' . $extraClasses . '">
                    ' . do_blocks( $content ) . '
                </div>
            </div>
        </div>
    ';

    return $output;
    return;
}