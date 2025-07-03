<?php

function method_grid_item_register_block() {
    // Automatically load dependencies and version from the generated `block.asset.php` file.
    
    // Enqueue block editor JS
    wp_register_script(
        'method-grid-item-block-editor-script',
        get_stylesheet_directory_uri() . '/lib/blocks/method-grid-item/build/block.js',
        array('react-jsx-runtime'),
        METHOD_VERSION,
        true
    );

    // Register the block
    register_block_type('method/grid-item', array(
        'editor_script' => 'method-grid-item-block-editor-script',
        'render_callback' => 'method_render_grid_item_block',
    ));
}
add_action('init', 'method_grid_item_register_block');


function method_render_grid_item_block( $block_attributes, $content, $block ) {
    $inlined = '';
    if ( method_check_array_key( $block_attributes, 'style' ) ) {
        $blockcss = wp_style_engine_get_styles( $block_attributes['style'] );
        $inlined = ' style="' . $blockcss['css'] . '"';
    }
    return '
        <div class="method-grid-item-component" data-gfw="' . ( method_check_array_key( $block_attributes, 'fullWidthItem' ) ? 'true' : 'false' ) . '"' . $inlined . '>
            ' . do_blocks( $content ) . '
        </div>
    ';
}