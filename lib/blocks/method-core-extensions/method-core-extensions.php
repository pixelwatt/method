<?php
/**
 * Method Core Extensions
 *
 * Extends targeted core blocks with Method's responsive spacing
 * and typography system. CSS is only generated for responsive
 * breakpoints (mobile, tablet, wide) — base styling is owned
 * entirely by WordPress core's block controls.
 */


// ─── Configuration ──────────────────────────────────────────────────────────────

/**
 * Returns the config array for which core blocks get Method's responsive system,
 * and what CSS properties each block needs.
 *
 * Filterable so child themes can extend or modify targeting.
 */
function method_core_extensions_get_config() {
    $config = array(
        'core/paragraph' => array(
            'cssargs' => array(
                'padding-top',
                'padding-bottom',
                'padding-left',
                'padding-right',
                'margin-top',
                'margin-bottom',
                'fontSize',
                'lineHeight',
                'textAlign',
            ),
        ),
        'core/heading' => array(
            'cssargs' => array(
                'margin-top',
                'margin-bottom',
                'fontSize',
                'lineHeight',
                'textAlign',
            ),
        ),
        'core/list' => array(
            'cssargs' => array(
                'padding-top',
                'padding-bottom',
                'padding-left',
                'padding-right',
                'margin-top',
                'margin-bottom',
                'fontSize',
                'lineHeight',
            ),
        ),
    );

    return apply_filters( 'method_core_extensions_config', $config );
}


/**
 * Default responsiveSettings for extended core blocks.
 * Base is minimal — core owns base styling.
 */
function method_core_extensions_get_defaults() {
    $breakpoint_defaults = array(
        'enabled'        => false,
        'customSpacing'  => false,
        'customType'     => false,
        'padding'        => array( 'top' => '0rem', 'bottom' => '0rem', 'left' => '0rem', 'right' => '0rem' ),
        'margin'         => array( 'top' => '0rem', 'bottom' => '0rem', 'left' => '0rem', 'right' => '0rem' ),
        'fontSize'       => '',
        'lineHeight'     => '',
        'textAlign'      => '',
        'allowNegative'  => false,
    );

    return array(
        'base'   => array( 'enabled' => true ),
        'mobile' => $breakpoint_defaults,
        'tablet' => $breakpoint_defaults,
        'wide'   => $breakpoint_defaults,
    );
}


// ─── 1. Register responsiveSettings attribute on targeted core blocks ───────────

add_filter( 'register_block_type_args', 'method_core_extensions_register_attributes', 10, 2 );

function method_core_extensions_register_attributes( $args, $block_type ) {
    $config = method_core_extensions_get_config();

    if ( ! isset( $config[ $block_type ] ) ) {
        return $args;
    }

    if ( ! isset( $args['attributes'] ) ) {
        $args['attributes'] = array();
    }

    $args['attributes']['responsiveSettings'] = array(
        'type'    => 'object',
        'default' => method_core_extensions_get_defaults(),
    );

    return $args;
}


// ─── 2. Enqueue editor script ───────────────────────────────────────────────────

add_action( 'enqueue_block_assets', 'method_core_extensions_enqueue_editor' );

function method_core_extensions_enqueue_editor() {
    if ( ! is_admin() ) {
        return;
    }

    $asset_file = __DIR__ . '/build/index.asset.php';
    $assets     = file_exists( $asset_file ) ? require $asset_file : array(
        'dependencies' => array(),
        'version'      => filemtime( __DIR__ . '/build/index.js' ),
    );

    wp_enqueue_script(
        'method-core-extensions',
        get_template_directory_uri() . '/lib/blocks/method-core-extensions/build/index.js',
        $assets['dependencies'],
        $assets['version'],
        true
    );
}


// ─── 3. Frontend CSS generation ─────────────────────────────────────────────────

add_filter( 'render_block', 'method_core_extensions_render_css', 10, 3 );

function method_core_extensions_render_css( $block_content, $parsed_block, $block_instance ) {
    $config = method_core_extensions_get_config();

    if ( ! isset( $config[ $parsed_block['blockName'] ] ) ) {
        return $block_content;
    }

    $attrs = $parsed_block['attrs'] ?? array();

    if ( ! method_check_array_key( $attrs, 'responsiveSettings' ) ) {
        return $block_content;
    }

    // Only generate CSS if at least one responsive breakpoint is enabled.
    $responsive = $attrs['responsiveSettings'];
    $has_responsive = false;
    foreach ( array( 'mobile', 'tablet', 'wide' ) as $bp ) {
        if ( ! empty( $responsive[ $bp ]['enabled'] ) ) {
            $has_responsive = true;
            break;
        }
    }

    if ( ! $has_responsive ) {
        return $block_content;
    }

    // Generate unique ID and inject onto the block's root element.
    $method_id = uniqid( 'method-ce-' );
    $block_content = method_core_extensions_inject_id( $block_content, $method_id );

    // Build the selector map — all properties target the root element directly.
    $block_config = $config[ $parsed_block['blockName'] ];
    $cssargs = array(
        '#' . $method_id => $block_config['cssargs'],
    );

    // Generate CSS for responsive breakpoints ONLY — exclude base.
    $responsive_css = method_get_block_responsive_styles(
        $attrs,
        $cssargs,
        array( 'mobile', 'tablet', 'wide' ),
        false
    );
    method_collect_css( $responsive_css, '#' . $method_id, 10 );

    return $block_content;
}


/**
 * Inject a unique ID onto the block's root HTML element.
 *
 * Handles both self-closing and standard tags, and avoids
 * clobbering any existing id attribute.
 */
function method_core_extensions_inject_id( $html, $id ) {
    $html = trim( $html );

    // If the element already has an id, don't override it.
    if ( preg_match( '/^<\w+[^>]*\sid\s*=/', $html ) ) {
        return $html;
    }

    return preg_replace(
        '/^(<\w+)(\s)/s',
        '$1 id="' . esc_attr( $id ) . '"$2',
        $html,
        1
    );
}
