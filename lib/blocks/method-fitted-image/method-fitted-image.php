<?php

// Block registrations

function register_method_fitted_image_block() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_fitted_image_block',
        'uses_context' => [ 'postId' ],
    ]);
}
add_action( 'init', 'register_method_fitted_image_block' );


/**
 * Wrapper attributes that let build/frontend.js open the uncropped, full-size
 * version of an attachment in a lightbox. The href is the full image, so the
 * block degrades to a plain link when the script (or <dialog>) is unavailable.
 *
 * @param int $attachment_id Attachment to show in the lightbox.
 * @return array Attribute name => value pairs, or an empty array if the
 *               attachment has no usable full-size image.
 */
function method_fitted_image_lightbox_attributes( $attachment_id ) {
    $full = wp_get_attachment_image_src( $attachment_id, 'full' );
    if ( ! $full || empty( $full[0] ) ) {
        return array();
    }

    $attributes = array(
        'href'                        => $full[0],
        'data-method-lightbox'        => '1',
        'data-method-lightbox-src'    => $full[0],
        'data-method-lightbox-width'  => $full[1],
        'data-method-lightbox-height' => $full[2],
        'data-method-lightbox-alt'    => trim( (string) get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ) ),
        'aria-haspopup'               => 'dialog',
    );

    $srcset = wp_get_attachment_image_srcset( $attachment_id, 'full' );
    if ( $srcset ) {
        $attributes['data-method-lightbox-srcset'] = $srcset;
    }

    return $attributes;
}


function render_method_fitted_image_block( $block_attributes, $block ) {
    $post_id = $block->context['postId'] ?? get_the_ID();
    $methodId = uniqid( 'method-' );
    $cssargs = array(
        '#' . $methodId => array( 'borderRadius', 'marginLeftNonZero', 'marginRightNonZero', 'margin-top', 'margin-bottom', 'boxShadow', 'zeroHeight' ),
        '#' . $methodId . ' > .method-block-content' => array( 'color', 'bgColor', 'borderRadius', 'border', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom' ),
        '#' . $methodId . ' > .method-block-content > .method-block-shade' => array( 'bgShade', 'boxShadow', 'borderRadius' ),
        '#' . $methodId . ' > .method-block-content > .method-fit-img-container' => array( 'aspectRatio' ),
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);
    $chosenSize = method_get_responsive_setting( $block_attributes, 'base', 'bgImgSize', 'full' );
    $chosenFit = method_get_responsive_setting( $block_attributes, 'base', 'bgDisplaySize', '' );
    $chosenImg = '';
    $chosenImgId = 0; // Attachment behind $chosenImg; used for the lightbox.
    if ( method_check_array_key( $block_attributes, 'useFeaturedImage' ) ) {
        $chosenImg = get_the_post_thumbnail( $post_id, 'large', array( 'class' => 'method-fit-img' ) );
        if ( $chosenImg ) {
            $chosenImgId = (int) get_post_thumbnail_id( $post_id );
        }
        if ( ( ! $chosenImg ) && ( method_check_array_key( $block_attributes, 'bgImg' ) ) ) {
            if ( method_check_array_key( $block_attributes['bgImg'], 'id' ) ) {
                $chosenImg = wp_get_attachment_image( $block_attributes['bgImg']['id'], $chosenSize, false, array( 'class' => 'method-fit-img' . $chosenFit ) );
                if ( $chosenImg ) {
                    $chosenImgId = (int) $block_attributes['bgImg']['id'];
                }
            }
        }
        if ( ( ! $chosenImg ) && ( ! method_check_array_key( $block_attributes, 'linkToPost' ) ) ) {
            return;
        }
    } elseif ( method_check_array_key( $block_attributes, 'bgImg' ) ) {
        if ( method_check_array_key( $block_attributes['bgImg'], 'id' ) ) {
            $chosenImg = wp_get_attachment_image( $block_attributes['bgImg']['id'], $chosenSize, false, array( 'class' => 'method-fit-img' . $chosenFit ) );
            if ( $chosenImg ) {
                $chosenImgId = (int) $block_attributes['bgImg']['id'];
            }
        }
    }
    $aspectClass = '';
    $aspectUses = method_get_responsive_setting( $block_attributes, 'base', 'aspectUses' );
    if ( 'ratio' == $aspectUses ) {
        $aspectRatio = method_get_responsive_setting( $block_attributes, 'base', 'aspectRatio', '-1-1' );
        $aspectClass = ' method-ratio method-ratio' . $aspectRatio;
    } elseif ( empty( $aspectUses ) ) {
        $aspectClass = ' method-ratio method-ratio-1-1';
    }

    $lightboxAttrs = array();
    if ( $chosenImgId && method_check_array_key( $block_attributes, 'lightbox' ) ) {
        $lightboxAttrs = method_fitted_image_lightbox_attributes( $chosenImgId );
    }

    $openTag = '<div ' . get_block_wrapper_attributes( ['class' => 'method-block-fitted-image', 'id' => $methodId] ) . '>';
    $closeTag = '</div>';

    // The lightbox takes precedence over linking: the whole block becomes the
    // trigger (an <a> to the full-size image, enhanced by build/frontend.js).
    if ( $lightboxAttrs ) {
        $openTag = '<a ' . get_block_wrapper_attributes( array_merge( ['class' => 'method-block-fitted-image method-lightbox-trigger', 'id' => $methodId], $lightboxAttrs ) ) . '>';
        $closeTag = '</a>';
    } elseif ( method_check_array_key( $block_attributes, 'linkToPost' ) ) {
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
