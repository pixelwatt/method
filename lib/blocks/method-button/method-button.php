<?php

function method_button_register_block() {
    // Automatically load dependencies and version from the generated `block.asset.php` file.
    
    // Enqueue block editor JS
    wp_register_script(
        'method-button-editor-script',
        get_stylesheet_directory_uri() . '/lib/blocks/method-button/build/block.js',
        array('react-jsx-runtime'),
        METHOD_VERSION,
        true
    );

    // Register the block
    register_block_type('method/button', array(
        'editor_script' => 'method-button-editor-script',
        'render_callback' => 'method_render_button_block',
    ));
}
add_action('init', 'method_button_register_block');


function method_render_button_block( $block_attributes, $block ) {
    // Headline
    $label = '';
    if ( method_check_array_key( $block_attributes, 'text' ) ) {
        $label = $block_attributes['text'];
    }
    $custom_attributes = array(
        'href' => ( method_check_array_key( $block_attributes, 'url' ) ? $block_attributes['url'] : '' )
    );
    
    if ( array_key_exists( 'opensInNewTab', $block_attributes ) ) {
        if ( true === $block_attributes['opensInNewTab'] ) {
            $custom_attributes['target'] = '_blank';
        }
    }
    $wrapper_attributes = get_block_wrapper_attributes($custom_attributes);
    $inlined = method_get_block_inline_styles( $block_attributes );
    return '
        <a ' . $wrapper_attributes . $inlined .  '>
            ' . $label . '
        </a>
    ';
}