<?php

function method_grid_register_block() {
    // Automatically load dependencies and version from the generated `block.asset.php` file.
    
    // Enqueue block editor JS
    wp_register_script(
        'method-grid-block-editor-script',
        get_stylesheet_directory_uri() . '/lib/blocks/method-grid/build/block.js',
        array('react-jsx-runtime'),
        METHOD_VERSION,
        true
    );

    // Register the block
    register_block_type('method/grid', array(
        'editor_script' => 'method-grid-block-editor-script',
        'render_callback' => 'method_render_grid_block',
    ));
}
add_action('init', 'method_grid_register_block');


function method_render_grid_block( $block_attributes, $content, $block ) {
    // Block wrapper setup
    $rid = rand();
    $cssId = 'wp-block-method-grid-' . $rid;
    $inlined = method_get_block_css_declarations( $block_attributes, 'base', array( 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom', 'font-size', 'line-height', 'color' ) );
    $wrapper_attributes = get_block_wrapper_attributes(
        [
            'id'    => $cssId
        ]
    );

    // Generate responsive CSS classes
    $rcls = array();
    $bcss = '';
    $ranges = array( 'mobile', 'tablet', 'wide' );
    foreach( $ranges as $range ) {
        if ( method_check_array_key( $block_attributes, 'custom' . ucfirst( $range ) ) ) {
            // Check for items per row
            if ( method_check_array_key( $block_attributes, $range . 'GridCols' ) ) {
                $rcls[] = 'method-layout-' . $range . '-' . $block_attributes["{$range}GridCols"];
            } else {
                $rcls[] = 'method-layout-' . $range . '-1';
            }
            if ( method_check_array_key( $block_attributes, $range . 'VerticalAlign' ) ) {
                $rcls[] = 'method-' . $range . '-' . $block_attributes["{$range}VerticalAlign"];
            }
            if ( method_check_array_key( $block_attributes, $range . 'JustifyContent' ) ) {
                $rcls[] = 'method-' . $range . '-' . $block_attributes["{$range}JustifyContent"];
            }
        }
    }
    $ecls = ' ' . implode( ' ', $rcls );

    // Generate responsive override styles
    $cssargs = array(
        '#' . $cssId => array( 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom', 'font-size', 'line-height' ),
        '#' . $cssId . ' .method-grid' => array( 'padding-left', 'padding-right' ),
        '#' . $cssId . ' .method-inner-blocks' => array( 'gapAsVars' ),
    ); 
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs );

    // All together now
    return '
        <div ' . $wrapper_attributes . ' style="' . $inlined . '">
            <div class="method-grid method-grid-rendered method-layout-' . ( method_check_array_key( $block_attributes, 'gridCols' ) ? $block_attributes['gridCols'] : '3' ) . ' method-' . ( method_check_array_key( $block_attributes, 'verticalAlign' ) ? $block_attributes['verticalAlign'] : 'align-start' ) . ' method-' . ( method_check_array_key( $block_attributes, 'justifyContent' ) ? $block_attributes['justifyContent'] : 'justify-start' ) . $ecls . '" style="' . method_get_block_css_declarations( $block_attributes, 'base', array( 'padding-left', 'padding-right' ) ) . '">
                <div class="row g-0">
                    <div class="col-24">
                        <div class="method-inner-blocks" style="' . method_get_block_css_declarations( $block_attributes, 'base', array( 'gapAsVars' ) ) . '">
                            ' . do_blocks( $content ) . '
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ' . $responsive . '
    ';
}

//  ' . method_generate_responsive_css( $block_attributes,  ) . '