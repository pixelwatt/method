<?php

function method_social_nav_register_block() {
    
    // Enqueue block editor JS
    wp_register_script(
        'method-social-nav-block-editor-script',
        get_template_directory_uri() . '/lib/blocks/method-social-nav/build/index.js',
        array('react-jsx-runtime'),
        METHOD_VERSION,
        true
    );

    // Register the block
    register_block_type('method/social-nav', array(
        'editor_script' => 'method-social-nav-block-editor-script',
        'render_callback' => 'method_render_social_nav_block',
    ));
}
add_action('init', 'method_social_nav_register_block');


function method_render_social_nav_block( $block_attributes, $block ) {
    $methodId = uniqid( 'method-' );
    $output = '';

    $socialItems = method_build_social_nav_items();
    if ( ! empty( $socialItems ) ) {
        $cssargs = array(
            '#' . $methodId => array( 'margin-top', 'margin-bottom' ),
            '#' . $methodId . ' ul.method-sn' => array( 'justifyContent', 'flexDirection', 'gap', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right' ),
            '#' . $methodId . ' ul.method-sn a .method-sn-label' => array( 'color' ),
        );

        if ( ! empty( $block_attributes['className'] ) && str_contains( $block_attributes['className'], 'is-style-enclosed' ) ) {
            $cssargs["#{$methodId} ul.method-sn a .method-sn-icon"] = array( 'equalDimensions', 'linkColor', 'bgColor' );
        } else {
            $cssargs["#{$methodId} ul.method-sn a .method-sn-icon"] = array( 'linkColor' );
            $cssargs["#{$methodId} ul.method-sn a .method-sn-icon svg"] = array( 'equalDimensions' );
        }

        $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
        method_collect_css( $responsive, '#' . $methodId, 10);

        $output = '<div ' . get_block_wrapper_attributes( ['class' => 'method-sn-block', 'id' => $methodId] ) . '><ul class="method-sn">' . $socialItems . '</ul></div>';
    }
    return $output;
}