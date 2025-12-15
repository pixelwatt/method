<?php

// Block registrations

function register_method_section_block() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_section_block'
    ]);
}
add_action( 'init', 'register_method_section_block' );



function render_method_section_block( $block_attributes, $content, $block ) {
    $methodId = ( method_check_array_key( $block_attributes, 'methodId' ) ? $block_attributes['methodId'] : uniqid( 'method-' ) );
    $align = method_get_responsive_setting( $block_attributes, 'base', 'alignItems' );

    $extraClasses = '';
    if ( method_check_array_key( $block_attributes, 'align' ) ) {
        if ( ( 'full' == $block_attributes['align'] ) && ( ! method_check_array_key( $block_attributes, 'unconstrained' ) ) ) {
            $extraClasses = ' is-layout-constrained wp-block-block has-global-padding';
        }
    }

    $cssargs = array(
        '#' . $methodId => array( 'borderRadius', 'marginLeftNonZero', 'marginRightNonZero', 'margin-top', 'margin-bottom', 'boxShadow' ),
        '#' . $methodId . ' > .method-section-content' => array( 'color', 'bgColor', 'borderRadius', 'border', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'fontSize', 'lineHeight', 'height', 'minHeight' ),
        '#' . $methodId . ' > .method-section-content > .method-section-shade' => array( 'bgShade' ),
        '#' . $methodId . ' a' => array( 'linkColor' )
    );

    $contentWrap = '';
    $imgElement = '';
    $chosenImg = '';
    if ( ( ! method_check_array_key( $block_attributes, 'useParallax' ) ) && ( ! method_check_array_key( $block_attributes, 'bgVideo' ) ) ) {
        $cssargs["#{$methodId}  > .method-section-content > .method-section-bgimg"] = array( 'bgImg', 'bgPosition', 'bgSize', 'bgRepeat' );
        $contentWrap = '<div class="method-section-content' . ( $align ? ' align-items-' . $align : '' ) . '">';
    } else {
        $contentWrap = '<div class="method-section-content jarallax' . ( $align ? ' align-items-' . $align : '' ) . '" data-jarallax data-speed="0.8"' . ( method_check_array_key( $block_attributes, 'bgVideo' ) ? ' data-video-src="' . $block_attributes['bgVideo'] . '"' : '' ) . '>';
        $chosenSize = method_get_responsive_setting( $block_attributes, 'base', 'bgImgSize', 'full' );
        if ( method_check_array_key( $block_attributes, 'bgImg' ) ) {
            if ( method_check_array_key( $block_attributes['bgImg'], 'id' ) ) {
                $chosenImg = wp_get_attachment_image( $block_attributes['bgImg']['id'], $chosenSize, false, array( 'class' => 'jarallax-img' ) );
            }
        }
    }

    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ) );

    $output = '
        <div ' . get_block_wrapper_attributes( ['class' => 'method-section', 'id' => $methodId] ) . '>
            ' . $contentWrap . '
                ' . $chosenImg . '
                <div class="method-section-bgimg">&nbsp;</div>
                <div class="method-section-shade">&nbsp;</div>
                <div class="method-section-content-inner' . $extraClasses . '">
                    ' . do_blocks( $content ) . '
                </div>
            </div>
        </div>
    ';

    return $output . $responsive;
    return;
}