<?php

// Block registrations

function register_method_fitted_image_block() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_fitted_image_block',
        'uses_context' => [ 'postId' ],
    ]);
}
add_action( 'init', 'register_method_fitted_image_block' );



function render_method_fitted_image_block( $block_attributes, $block ) {
    $post_id = $block->context['postId'] ?? get_the_ID();
    $methodId = uniqid( 'method-' );
    $cssargs = array(
        '#' . $methodId => array( 'borderRadius', 'marginLeftNonZero', 'marginRightNonZero', 'margin-top', 'margin-bottom', 'boxShadow' ),
        '#' . $methodId . ' > .method-block-content' => array( 'color', 'bgColor', 'borderRadius', 'border', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom' ),
        '#' . $methodId . ' > .method-block-content > .method-block-shade' => array( 'bgShade' ),
        '#' . $methodId . ' > .method-block-content > .method-fit-img-container' => array( 'aspectRatio' ),
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);
    $chosenSize = method_get_responsive_setting( $block_attributes, 'base', 'bgImgSize', 'full' );
    $chosenFit = method_get_responsive_setting( $block_attributes, 'base', 'bgDisplaySize', '' );
    $chosenImg = '';
    if ( method_check_array_key( $block_attributes, 'useFeaturedImage' ) ) {
        $chosenImg = get_the_post_thumbnail( $post_id, 'large', array( 'class' => 'method-fit-img' ) );
        if ( ( ! $chosenImg ) && ( method_check_array_key( $block_attributes, 'bgImg' ) ) ) {
            if ( method_check_array_key( $block_attributes['bgImg'], 'id' ) ) {
                $chosenImg = wp_get_attachment_image( $block_attributes['bgImg']['id'], $chosenSize, false, array( 'class' => 'method-fit-img' . $chosenFit ) );
            }
        }
        if ( ( ! $chosenImg ) && ( ! method_check_array_key( $block_attributes, 'linkToPost' ) ) ) {
            return;
        }
    } elseif ( method_check_array_key( $block_attributes, 'bgImg' ) ) {
        if ( method_check_array_key( $block_attributes['bgImg'], 'id' ) ) {
            $chosenImg = wp_get_attachment_image( $block_attributes['bgImg']['id'], $chosenSize, false, array( 'class' => 'method-fit-img' . $chosenFit ) );
        }
    }
    $aspectClass = '';
    $aspectUses = method_get_responsive_setting( $block_attributes, 'base', 'aspectUses' );
    if ( 'ratio' == $aspectUses ) {
        $aspectRatio = method_get_responsive_setting( $block_attributes, 'base', 'aspectRatio', '-1-1' );
        $aspectClass = ' method-ratio method-ratio' . $aspectRatio;
    }

    $openTag = '<div ' . get_block_wrapper_attributes( ['class' => 'method-block-fitted-image', 'id' => $methodId] ) . '>';
    $closeTag = '</div>';

    if ( method_check_array_key( $block_attributes, 'linkToPost' ) ) {
        $openTag = '<a target="_self" href="' . get_the_permalink( $post_id ) . '" ' . get_block_wrapper_attributes( ['class' => 'method-block-fitted-image', 'id' => $methodId] ) . '>';
        $closeTag = '</a>';
    } elseif ( method_check_array_key( $block_attributes, 'link' ) ) {
        if ( method_check_array_key( $block_attributes['link'], 'url' ) ) {
            $btnTarget = ( method_check_array_key( $block_attributes['link'], 'opensInNewTab' ) ? '_blank' : '_self' );
            $openTag = '<a target="' . $btnTarget . '" href="' . $block_attributes['link']['url'] . '" ' . get_block_wrapper_attributes( ['class' => 'method-block-fitted-image', 'id' => $methodId] ) . '>';
            $closeTag = '</a>';
        }
    }

    $output = '
        ' . $openTag . '
            <div class="method-block-content">
                <div class="method-block-shade">&nbsp;</div>
                <div class="method-fit-img-container' . $aspectClass . '">
                    ' . $chosenImg . '
                </div>
            </div>
        ' . $closeTag . '
    ';
    return $output;
}