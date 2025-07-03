<?php

function method_buttons_register_block() {
    // Automatically load dependencies and version from the generated `block.asset.php` file.
    
    // Enqueue block editor JS
    wp_register_script(
        'method-buttons-editor-script',
        get_stylesheet_directory_uri() . '/lib/blocks/method-buttons/build/block.js',
        array('react-jsx-runtime'),
        METHOD_VERSION,
        true
    );

    // Register the block
    register_block_type('method/buttons', array(
        'editor_script' => 'method-buttons-editor-script',
        'render_callback' => 'method_render_buttons_block',
    ));
}
add_action('init', 'method_buttons_register_block');

function method_render_buttons_block( $block_attributes, $content, $block ) {
    $wrapper_attributes = get_block_wrapper_attributes();
    $inlined = method_get_block_inline_styles( $block_attributes );
    return '
        <div ' . $wrapper_attributes . $inlined .  '>
            ' . do_blocks( $content ) . '
        </div>
        <pre>' . print_r( method_get_block_breakpoints(), true ) . '</pre>
    ';
}