<?php

// Block registrations

/**
 * Mapbox GL JS, under the same handle and version cmb2-mapbox and
 * method-tec-mapbox use, so the library never loads twice on a page. It is
 * registered when a map renders, not on init: cmb2-mapbox enqueues the
 * library into the admin <head> and prints inline scripts that need it there,
 * which an earlier footer registration of the same handle would move.
 */
define( 'METHOD_MAPBOX_GL_HANDLE', 'mapbox-gl' );
define( 'METHOD_MAPBOX_GL_BASE', 'https://api.mapbox.com/mapbox-gl-js/v3.23.1/mapbox-gl' );

function register_method_mapbox_map_block() {
    $block_type = register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_mapbox_map_block',
    ]);
    // The view script creates the maps, so it has to run after Mapbox GL JS.
    if ( $block_type && ! empty( $block_type->view_script_handles ) ) {
        foreach ( $block_type->view_script_handles as $handle ) {
            $script = wp_scripts()->query( $handle );
            if ( $script && ! in_array( METHOD_MAPBOX_GL_HANDLE, $script->deps, true ) ) {
                $script->deps[] = METHOD_MAPBOX_GL_HANDLE;
            }
        }
    }
}
add_action( 'init', 'register_method_mapbox_map_block' );

/**
 * The editor loads Mapbox GL JS into the canvas itself, the first time a map
 * block needs it (see loadMapboxGl() in lib/blocks/utils/mapbox.js), so only
 * the URLs are handed over, with the site's token and the style list.
 */
function method_mapbox_map_enqueue_editor_assets() {
    wp_localize_script( 'method-mapbox-map-editor-script', 'methodMapboxData', array(
        'siteToken' => method_mapbox_get_site_token(),
        'styles'    => method_mapbox_get_styles(),
        'gl'        => array(
            'js'  => METHOD_MAPBOX_GL_BASE . '.js',
            'css' => METHOD_MAPBOX_GL_BASE . '.css',
        ),
    ) );
}
add_action( 'enqueue_block_editor_assets', 'method_mapbox_map_enqueue_editor_assets' );


/**
 * The Mapbox access token the site shares, if any: one a child theme hands
 * out through the 'method_mapbox_token' filter (the cmb2-mapbox /
 * method-tec-mapbox integration), or else the one cmb2-mapbox keeps in
 * Method's options when its 'cmb2_mapbox_use_method' switch is on.
 *
 * @return string Token, or '' if the site shares none.
 */
function method_mapbox_get_site_token() {
    $token = '';
    if ( has_filter( 'method_mapbox_token' ) ) {
        $token = trim( (string) apply_filters( 'method_mapbox_token', '' ) );
    }
    if ( '' === $token && function_exists( 'cmb2_mapbox_method' ) && cmb2_mapbox_method() ) {
        $options = get_option( 'method_options' );
        if ( is_array( $options ) && ! empty( $options['mapbox_api_token'] ) ) {
            $token = trim( (string) $options['mapbox_api_token'] );
        }
    }
    return $token;
}


/**
 * The token a block renders with: the site's, or else the block's own
 * (the editor only offers the block option when the site shares no token).
 *
 * @param array $block_attributes
 * @return string Token, or '' if there is none.
 */
function method_mapbox_get_block_token( $block_attributes ) {
    $token = method_mapbox_get_site_token();
    if ( '' === $token ) {
        $token = trim( (string) ( $block_attributes['accessToken'] ?? '' ) );
    }
    return $token;
}


/**
 * Mapbox's prebuilt styles offered by the block's Style option, keyed by the
 * value stored in the block's `mapStyle` attribute. Mirrored for the editor
 * in methodMapboxData.styles (with a fallback copy in lib/blocks/utils/mapbox.js).
 *
 * @return array<string, array{label: string, url: string}>
 */
function method_mapbox_get_styles() {
    $styles = array(
        'standard'              => array( 'label' => __( 'Standard', 'method' ), 'url' => 'mapbox://styles/mapbox/standard' ),
        'standard-satellite'    => array( 'label' => __( 'Standard Satellite', 'method' ), 'url' => 'mapbox://styles/mapbox/standard-satellite' ),
        'streets-v12'           => array( 'label' => __( 'Streets', 'method' ), 'url' => 'mapbox://styles/mapbox/streets-v12' ),
        'outdoors-v12'          => array( 'label' => __( 'Outdoors', 'method' ), 'url' => 'mapbox://styles/mapbox/outdoors-v12' ),
        'light-v11'             => array( 'label' => __( 'Light', 'method' ), 'url' => 'mapbox://styles/mapbox/light-v11' ),
        'dark-v11'              => array( 'label' => __( 'Dark', 'method' ), 'url' => 'mapbox://styles/mapbox/dark-v11' ),
        'satellite-v9'          => array( 'label' => __( 'Satellite', 'method' ), 'url' => 'mapbox://styles/mapbox/satellite-v9' ),
        'satellite-streets-v12' => array( 'label' => __( 'Satellite Streets', 'method' ), 'url' => 'mapbox://styles/mapbox/satellite-streets-v12' ),
        'navigation-day-v1'     => array( 'label' => __( 'Navigation Day', 'method' ), 'url' => 'mapbox://styles/mapbox/navigation-day-v1' ),
        'navigation-night-v1'   => array( 'label' => __( 'Navigation Night', 'method' ), 'url' => 'mapbox://styles/mapbox/navigation-night-v1' ),
    );
    /**
     * Filters the styles the Mapbox Map block offers.
     *
     * @param array $styles key => [ 'label' => string, 'url' => string ]
     */
    return apply_filters( 'method_mapbox_map_styles', $styles );
}


/**
 * A Mapbox Studio style URL, or an https link to a style JSON.
 */
function method_mapbox_is_style_url( $url ) {
    return (bool) preg_match( '#^(mapbox://styles/\S+|https://\S+)$#i', trim( (string) $url ) );
}


/**
 * The style URL a block renders with. Mirrors resolveStyle() in lib/blocks/utils/mapbox.js.
 *
 * @param array $block_attributes
 * @return string
 */
function method_mapbox_resolve_style( $block_attributes ) {
    $styles = method_mapbox_get_styles();
    $key    = (string) ( $block_attributes['mapStyle'] ?? 'standard' );

    if ( 'custom' === $key ) {
        $url = trim( (string) ( $block_attributes['customStyleUrl'] ?? '' ) );
        if ( method_mapbox_is_style_url( $url ) ) {
            return $url;
        }
    }
    if ( ! empty( $styles[ $key ]['url'] ) ) {
        return $styles[ $key ]['url'];
    }
    if ( ! empty( $styles['standard']['url'] ) ) {
        return $styles['standard']['url'];
    }
    $first = reset( $styles );
    return ! empty( $first['url'] ) ? $first['url'] : 'mapbox://styles/mapbox/standard';
}


/**
 * The block's pin.
 *
 * @param array $block_attributes
 * @return array{lng: float, lat: float}|null Null if the block has no (valid) pin.
 */
function method_mapbox_get_pin( $block_attributes ) {
    $lng = $block_attributes['lng'] ?? null;
    $lat = $block_attributes['lat'] ?? null;
    if ( ! is_numeric( $lng ) || ! is_numeric( $lat ) ) {
        return null;
    }
    $lng = (float) $lng;
    $lat = (float) $lat;
    if ( abs( $lat ) > 90 || abs( $lng ) > 180 ) {
        return null;
    }
    return array( 'lng' => $lng, 'lat' => $lat );
}


/**
 * The config the view script creates the map from (see the header of
 * lib/blocks/utils/mapbox.js for its shape).
 *
 * @param array  $block_attributes
 * @param string $token
 * @param array  $pin  From method_mapbox_get_pin().
 * @return array
 */
function method_mapbox_get_map_config( $block_attributes, $token, $pin ) {
    $zoom = is_numeric( $block_attributes['zoom'] ?? null ) ? (float) $block_attributes['zoom'] : 14;
    $zoom = max( 0, min( 22, $zoom ) );

    $scale = is_numeric( $block_attributes['pinScale'] ?? null ) ? (float) $block_attributes['pinScale'] : 1;
    $scale = max( 0.5, min( 3, $scale ) );

    $pin_config = array(
        'lng'   => $pin['lng'],
        'lat'   => $pin['lat'],
        'scale' => $scale,
        'popup' => trim( wp_strip_all_tags( (string) ( $block_attributes['popupText'] ?? '' ) ) ),
    );
    $color = sanitize_text_field( (string) ( $block_attributes['pinColor'] ?? '' ) );
    if ( '' !== $color ) {
        $pin_config['color'] = method_sanitize_theme_color( $color );
    }

    $config = array(
        'token'               => $token,
        'style'               => method_mapbox_resolve_style( $block_attributes ),
        'center'              => array( $pin['lng'], $pin['lat'] ),
        'zoom'                => $zoom,
        'pin'                 => $pin_config,
        'navigation'          => ! array_key_exists( 'showNavigation', $block_attributes ) || ! empty( $block_attributes['showNavigation'] ),
        'cooperativeGestures' => ! array_key_exists( 'cooperativeGestures', $block_attributes ) || ! empty( $block_attributes['cooperativeGestures'] ),
    );

    /**
     * Filters the map config of a Mapbox Map block before it is printed.
     *
     * @param array $config           token, style, center, zoom, pin, navigation, cooperativeGestures
     * @param array $block_attributes
     */
    return apply_filters( 'method_mapbox_map_config', $config, $block_attributes );
}


function method_mapbox_enqueue_gl() {
    if ( ! wp_script_is( METHOD_MAPBOX_GL_HANDLE, 'registered' ) ) {
        wp_register_script( METHOD_MAPBOX_GL_HANDLE, METHOD_MAPBOX_GL_BASE . '.js', array(), null, true );
    }
    if ( ! wp_style_is( METHOD_MAPBOX_GL_HANDLE, 'registered' ) ) {
        wp_register_style( METHOD_MAPBOX_GL_HANDLE, METHOD_MAPBOX_GL_BASE . '.css', array(), null );
    }
    wp_enqueue_script( METHOD_MAPBOX_GL_HANDLE );
    wp_enqueue_style( METHOD_MAPBOX_GL_HANDLE );
}


/**
 * Prints the map's container with its config; the view script (src/frontend.js)
 * creates the map once the container comes near the viewport. Without a token
 * or a pin there is nothing to show, and nothing is printed.
 */
function render_method_mapbox_map_block( $block_attributes, $content, $block ) {
    $token = method_mapbox_get_block_token( $block_attributes );
    $pin   = method_mapbox_get_pin( $block_attributes );
    if ( '' === $token || ! $pin ) {
        return '';
    }

    $methodId = uniqid( 'method-' );
    // Mirrors cssMap in src/edit.js.
    $cssargs = array(
        '#' . $methodId => array( 'height', 'minHeight', 'aspectRatioDimension', 'margin-top', 'margin-bottom', 'borderRadius', 'border', 'boxShadow' ),
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10 );

    $config = method_mapbox_get_map_config( $block_attributes, $token, $pin );
    method_mapbox_enqueue_gl();

    $name = $config['pin']['popup'] ?? '';
    if ( '' === $name ) {
        $name = trim( wp_strip_all_tags( (string) ( $block_attributes['geocodedAddress'] ?? '' ) ) );
    }
    /* translators: %s: place the map shows */
    $label = '' !== $name ? sprintf( __( 'Map of %s', 'method' ), $name ) : __( 'Map', 'method' );

    $wrapper = get_block_wrapper_attributes( array(
        'class'      => 'method-mapbox-map',
        'id'         => $methodId,
        'role'       => 'region',
        'aria-label' => $label,
        'data-map'   => wp_json_encode( $config ),
    ) );

    return '<div ' . $wrapper . '><div class="method-mapbox-map-canvas"></div></div>';
}
