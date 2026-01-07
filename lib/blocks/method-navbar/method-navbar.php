<?php

function method_navbar_register_block() {
    
    // Enqueue block editor JS
    wp_register_script(
        'method-navbar-block-editor-script',
        get_template_directory_uri() . '/lib/blocks/method-navbar/build/index.js',
        array('react-jsx-runtime'),
        METHOD_VERSION,
        true
    );

    // Register the block
    register_block_type('method/navbar', array(
        'editor_script' => 'method-navbar-block-editor-script',
        'render_callback' => 'method_render_navbar_block',
    ));
}
add_action('init', 'method_navbar_register_block');


function method_navbar_enqueue_block_assets() {
    wp_enqueue_script('method-navbar-block-editor-script');
    wp_localize_script('method-navbar-block-editor-script', 'navbarData', array(
        'menuPreview' => wp_nav_menu( array( 'theme_location' => 'primary', 'depth' => 1, 'container' => '', 'menu_class' => '', 'items_wrap' => '<ul id="%1$s" class="navbar-nav %2$s">%3$s</ul>', 'walker' => new bootstrap_5_wp_nav_menu_walker(), 'fallback_cb' => '__return_false', 'echo' => false, ) ) // Replace 'my_key' with your array key
    ));
}
add_action('enqueue_block_editor_assets', 'method_navbar_enqueue_block_assets');

function method_render_navbar_block( $block_attributes, $block ) {
    $output = '';
    return $output;
}