<?php

// Block registrations

function register_method_container_block() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_container_block'
    ]);
}
add_action( 'init', 'register_method_container_block' );



function render_method_container_block( $block_attributes, $content, $block ) {
    $methodId = ( method_check_array_key( $block_attributes, 'methodId' ) ? $block_attributes['methodId'] : uniqid( 'method-' ) );
    $align = method_get_responsive_setting( $block_attributes, 'base', 'alignItems' );

    $cssargs = array(
        '#' . $methodId => array( 'borderRadius', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'boxShadow' ),
        '#' . $methodId . ' > .method-container-content' => array( 'color', 'bgColor', 'borderRadius', 'border', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'fontSize', 'lineHeight', 'height', 'minHeight' ),
        '#' . $methodId . ' > .method-container-content > .method-container-bgimg' => array( 'bgImg', 'bgPosition', 'bgSize', 'bgRepeat' ),
        '#' . $methodId . ' > .method-container-content > .method-container-shade' => array( 'bgShade' ),
        '#' . $methodId . ' a' => array( 'linkColor' )
    );

    $openTag = '<div ' . get_block_wrapper_attributes( ['class' => 'method-container', 'id' => $methodId] ) . '>';
    $closeTag = '</div>';

    if ( method_check_array_key( $block_attributes, 'link' ) ) {
        if ( method_check_array_key( $block_attributes['link'], 'url' ) ) {
            $btnTarget = ( method_check_array_key( $block_attributes['link'], 'target' ) ? '_blank' : '_self' );
            $openTag = '<a target="' . $btnTarget . '" href="' . $block_attributes['link']['url'] . '" ' . get_block_wrapper_attributes( ['class' => 'method-container', 'id' => $methodId] ) . '>';
            $closeTag = '</a>';
        }
    }

    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ) );

    $output = '
        ' . $openTag . '
            <div class="method-container-content method-fit-img-container' . ( $align ? ' align-items-' . $align : '' ) . '">
                <div class="method-container-bgimg">&nbsp;</div>
                <div class="method-container-shade">&nbsp;</div>
                ' . do_blocks( $content ) . '
            </div>
        ' . $closeTag . '
    ';

    return $output . $responsive;
}