<?php

// Block registrations

function register_method_fluid_video_block() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_fluid_video_block',
    ]);
}
add_action( 'init', 'register_method_fluid_video_block' );



function render_method_fluid_video_block( $block_attributes, $block ) {
    $output = '';
    $chosenImg = '';
    $chosenSize = method_get_responsive_setting( $block_attributes, 'base', 'bgImgSize', 'full' );
    $videoUrl = ( method_check_array_key( $block_attributes, 'videoUrl' ) ? $block_attributes['videoUrl'] : '' );

    if ( method_check_array_key( $block_attributes, 'bgImg' ) ) {
        if ( method_check_array_key( $block_attributes['bgImg'], 'id' ) ) {
            $chosenImg = wp_get_attachment_image( $block_attributes['bgImg']['id'], $chosenSize, false, array( 'class' => 'method-fit-img' ) );
        }
    }
    $parsed = method_parse_video_url( $videoUrl );
    if ( ! $parsed || ! $chosenImg ) {
        return;
    }
    $methodId = uniqid( 'method-' );
    $cssargs = array(
        '#' . $methodId => array( 'borderRadius', 'margin-top', 'margin-bottom', 'boxShadow' ),
        '#' . $methodId . ' > .method-fluid-video-preview' => array( 'color', 'bgColor', 'borderRadius', 'border' ),
        '#' . $methodId . ' > .method-fluid-video-preview > .method-block-shade' => array( 'bgShade' ),
        '#' . $methodId . ' > .method-fluid-video-preview > .method-invoke-target' => array( 'linkColor' ),
        '#' . $methodId . ' > .method-fluid-video-preview > .method-invoke-target:hover' => array( 'linkHoverColor' ),
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);
    $embed_url = method_build_embed_url( $parsed['provider'], $parsed['id'] );
    $wrapper = get_block_wrapper_attributes( [
        'class'              => 'method-fluid-video',
        'id'                 => $methodId,
        'data-embed-url'     => esc_url( $embed_url ),
        'data-provider'      => esc_attr( $parsed['provider'] ),
    ] );
    $output = '
        <div ' . $wrapper . '>
            <a role="button" class="method-fluid-video-preview">
                <div class="method-invoke-target"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" /><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" /></svg></div>
                <div class="method-block-shade">&nbsp;</div>
                <div class="method-fit-img-container">
                    ' . $chosenImg . '
                </div>
            </a>
            <div class="method-fluid-video-player" hidden></div>
        </div>
    ';
    
    return $output;
}