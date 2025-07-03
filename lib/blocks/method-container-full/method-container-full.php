<?php

function method_container_full_register_block() {
    // Automatically load dependencies and version from the generated `block.asset.php` file.
    
    // Enqueue block editor JS
    wp_register_script(
        'method-container-full-block-editor-script',
        get_stylesheet_directory_uri() . '/lib/blocks/method-container-full/build/block.js',
        array('react-jsx-runtime'),
        METHOD_VERSION,
        true
    );

    // Register the block
    register_block_type('method/container-full', array(
        'editor_script' => 'method-container-full-block-editor-script',
        'render_callback' => 'method_render_container_full_block',
    ));
}
add_action('init', 'method_container_full_register_block');


function method_container_full_localize_block() {
    wp_enqueue_script('method-container-full-block-editor-script');
    wp_localize_script('method-container-full-block-editor-script', 'methodContainerFullData', array(
        'breakpoints' => method_get_block_breakpoints()
    ));
}
add_action('enqueue_block_editor_assets', 'method_container_full_localize_block');


function method_render_container_full_block( $block_attributes, $content, $block ) {
    // Block wrapper setup
    $rid = rand();
    $cssId = 'wp-block-method-container-full-' . $rid;
    $inlined = method_get_block_css_declarations( $block_attributes, 'base', array( 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom', 'font-size', 'line-height', 'color', 'background-color' ) );
    $wrapper_attributes = get_block_wrapper_attributes(
        [
            'id'    => $cssId,
            'class' => 'alignfull',
        ]
    );

    // Generate responsive override styles
    $cssargs = array(
        '#' . $cssId => array( 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom', 'font-size', 'line-height' ),
        '#' . $cssId . ' .method-container-full' => array( 'padding-left', 'padding-right' ),
    ); 
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs );
    return '
        <div ' . $wrapper_attributes . ' style="' . $inlined . '">
            <div class="method-container-full method-container-full-rendered" style="' . method_get_block_css_declarations( $block_attributes, 'base', array( 'padding-left', 'padding-right' ) ) . '">
                <div class="method-container-full-inner-wrap">
                    ' . ( method_check_array_key( $block_attributes, 'fullWidthContent' ) ? '' : '<div class="has-global-padding is-layout-constrained wp-block-block alignfull">' ) . '
                        <div class="method-inner-blocks">
                            ' . do_blocks( $content ) . '
                        </div>
                    ' . ( method_check_array_key( $block_attributes, 'fullWidthContent' ) ? '' : '</div>' ) . '
                </div>
            </div>
        </div>
        ' . $responsive . '
    ';
}