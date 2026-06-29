<?php

// Block registrations

function register_method_container_block() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_container_block'
    ]);
}
add_action( 'init', 'register_method_container_block' );

function method_container_enqueue_assets() {
    wp_enqueue_script('jarallax', get_template_directory_uri() . '/inc/jarallax/jarallax.min.js', [], null, true);
    wp_enqueue_script('jarallax-video', get_template_directory_uri() . '/inc/jarallax/jarallax-video.min.js', ['jarallax'], null, true);
}
add_action('enqueue_block_assets', 'method_container_enqueue_assets');

function render_method_container_block( $block_attributes, $content, $block ) {
    $methodId = uniqid( 'method-' );
    $align = method_get_responsive_setting( $block_attributes, 'base', 'alignItems' );

    $cssargs = array(
        '#' . $methodId => array( 'borderRadius', 'marginLeftNonZero', 'marginRightNonZero', 'margin-top', 'margin-bottom', 'boxShadow', 'zIndex' ),
        '#' . $methodId . ' > .method-container-content' => array( 'color', 'bgColor', 'borderRadius', 'border', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'fontSize', 'lineHeight', 'height', 'minHeight', 'width', 'minWidth', 'alignItems', 'overflow', 'aspectRatioDimension' ),
        '#' . $methodId . ' > .method-container-content > .method-container-shade' => array( 'bgShade' ),
        '#' . $methodId . ' a:not(.method-theme-button)' => array( 'linkColor' )
    );

    // '#' . $methodId . ' > .method-container-content > .method-container-bgimg' => array( 'bgImg', 'bgPosition', 'bgSize', 'bgRepeat' ),
    $mhgroup = method_get_responsive_setting( $block_attributes, 'base', 'mh' );
    $openTag = '<div ' . get_block_wrapper_attributes( ['class' => 'method-container', 'id' => $methodId] ) . '>';
    $closeTag = '</div>';

    if ( method_check_array_key( $block_attributes, 'link' ) ) {
        if ( method_check_array_key( $block_attributes['link'], 'url' ) ) {
            $btnTarget = ( method_check_array_key( $block_attributes['link'], 'opensInNewTab' ) ? '_blank' : '_self' );
            $openTag = '<a target="' . $btnTarget . '" href="' . $block_attributes['link']['url'] . '" ' . get_block_wrapper_attributes( ['class' => 'method-container', 'id' => $methodId] ) . '>';
            $closeTag = '</a>';
        }
    }

    $contentWrap = '';
    $imgElement = '';
    $chosenImg = '';
    if ( ( ! method_check_array_key( $block_attributes, 'useParallax' ) ) && ( ! method_check_array_key( $block_attributes, 'bgVideo' ) ) ) {
        $cssargs["#{$methodId}  > .method-container-content > .method-container-bgimg"] = array( 'bgImg', 'bgPosition', 'bgSize', 'bgRepeat' );
        $contentWrap = '<div class="method-container-content"' . ( ! empty( $mhgroup ) ? ' data-mh="' . $mhgroup . '"' : '' ) . '>';
    } else {
        $contentWrap = '<div class="method-container-content jarallax" data-jarallax data-speed="0.8"' . ( method_check_array_key( $block_attributes, 'bgVideo' ) ? ' data-video-src="' . $block_attributes['bgVideo'] . '"' : '' ) . ( ! empty( $mhgroup ) ? ' data-mh="' . $mhgroup . '"' : '' ) . '>';
        $chosenSize = method_get_responsive_setting( $block_attributes, 'base', 'bgImgSize', 'full' );
        if ( method_check_array_key( $block_attributes, 'bgImg' ) ) {
            if ( method_check_array_key( $block_attributes['bgImg'], 'id' ) ) {
                $chosenImg = wp_get_attachment_image( $block_attributes['bgImg']['id'], $chosenSize, false, array( 'class' => 'jarallax-img' ) );
            }
        }
    }

    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);

    $output = '
        ' . $openTag . '
            ' . $contentWrap . '
                ' . $chosenImg . '
                <div class="method-container-bgimg">&nbsp;</div>
                <div class="method-container-shade">&nbsp;</div>
                ' . do_blocks( $content ) . '
            </div>
        ' . $closeTag . '
    ';

    return $output;
}