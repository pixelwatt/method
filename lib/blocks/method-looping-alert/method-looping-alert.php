<?php

// Block registrations

function register_method_looping_alert_block() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_looping_alert_block'
    ]);
}
add_action( 'init', 'register_method_looping_alert_block' );


function render_method_looping_alert_block( $block_attributes, $block ) {
    $methodId = uniqid( 'method-' );
    $cssargs = array(
        '#' . $methodId => array( 'margin-top', 'margin-bottom', 'textColor' ),
        '#' . $methodId . ' > .method-looping-alert-inner' => array( 'textColor', 'bgColor', 'borderRadius', 'border', 'padding-top', 'padding-bottom', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'textTransform', 'letterSpacing' ),
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);

    $alertText = method_check_array_key( $block_attributes, 'alertText' ) ? $block_attributes['alertText'] : '';
    $seperator = method_check_array_key( $block_attributes, 'seperator' ) ? $block_attributes['seperator'] : '';
    // 0-100; frontend.js converts this to px/s (see src/marquee.js).
    $speed = isset( $block_attributes['speed'] ) && is_numeric( $block_attributes['speed'] )
        ? max( 0, min( 100, floatval( $block_attributes['speed'] ) ) )
        : 0;

    $wrapperAttributes = get_block_wrapper_attributes( [
        'class'      => 'method-looping-alert',
        'id'         => $methodId,
        'data-speed' => $speed,
    ] );

    $openTag = '<div ' . $wrapperAttributes . '>';
    $closeTag = '</div>';

    if ( method_check_array_key( $block_attributes, 'link' ) ) {
        if ( method_check_array_key( $block_attributes['link'], 'url' ) ) {
            $btnTarget = ( method_check_array_key( $block_attributes['link'], 'opensInNewTab' ) ? '_blank' : '_self' );
            $openTag = '<a target="' . $btnTarget . '" href="' . esc_url( $block_attributes['link']['url'] ) . '" ' . $wrapperAttributes . '>';
            $closeTag = '</a>';
        }
    }

    // A single text + separator unit. frontend.js clones this to fill the
    // container width and duplicates the group so the scroll loops seamlessly.
    $unit = '<span class="method-looping-alert-unit">'
        . '<span class="method-looping-alert-item">' . esc_html( $alertText ) . '</span>'
        . '<span class="method-looping-alert-sep">' . esc_html( $seperator ) . '</span>'
        . '</span>';

    return $openTag
        . '<div class="method-looping-alert-inner">'
        . '<p class="method-looping-alert-track">'
        . '<span class="method-looping-alert-group">' . $unit . '</span>'
        . '</p>'
        . '</div>'
        . $closeTag;
}
