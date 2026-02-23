<?php

// Block registrations

function register_method_buttons_block() {
	register_block_type( __DIR__ . '/build/buttons', [
        'render_callback' => 'render_method_buttons_block'
    ]);
}
add_action( 'init', 'register_method_buttons_block' );

function register_method_button_block() {
	register_block_type( __DIR__ . '/build/button', [
        'render_callback' => 'render_method_button_block'
    ]);
}
add_action( 'init', 'register_method_button_block' );

function register_method_theme_button_block() {
    wp_register_script(
        'method-theme-button-block-editor-script',
        get_template_directory_uri() . '/lib/blocks/method-buttons/build/theme-button/index.js',
        array('react-jsx-runtime'),
        METHOD_VERSION,
        true
    );

	register_block_type( __DIR__ . '/build/theme-button', [
        'editor_script' => 'method-theme-button-block-editor-script',
        'render_callback' => 'render_method_theme_button_block'
    ]);
}
add_action( 'init', 'register_method_theme_button_block' );

function method_theme_button_enqueue_block_assets() {
    $defaults = false;
    wp_enqueue_script('method-theme-button-block-editor-script');
    wp_localize_script('method-theme-button-block-editor-script', 'themeButtonData', array(
        'buttonStyles' => apply_filters( 'method_block_theme_button_styles', $defaults ),
        'buttonStylesLabel' => apply_filters( 'method_block_theme_button_styles_label', 'Button Styles' ),
        'labelStyles' => apply_filters( 'method_block_theme_label_styles', $defaults ),
        'buttonIcons' => apply_filters( 'method_block_theme_button_icons', $defaults ),
        'afterLabel' => apply_filters( 'method_block_theme_button_after_label', '' ),
        'beforeLabel' => apply_filters( 'method_block_theme_button_before_label', '' ),
    ));
}

add_action('enqueue_block_editor_assets', 'method_theme_button_enqueue_block_assets');

function render_method_buttons_block( $block_attributes, $content, $block ) {
    $methodId = uniqid( 'method-' );
    $cssargs = array(
        '#' . $methodId => array( 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'margin-top', 'margin-bottom' ),
        '#' . $methodId . ' > .method-buttons-inner-blocks' => array( 'gap' ),
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);


    $output = '
        <div ' . get_block_wrapper_attributes( ['class' => 'method-buttons', 'id' => $methodId] ) . '>
            ' . do_blocks( $content ) . '
        </div>
    ';
    return $output;
}

function render_method_button_block( $block_attributes, $block ) {
    $methodId = uniqid( 'method-' );
    $cssargs = array(
        '#' . $methodId => array( 'borderRadius', 'boxShadow', 'textColor', 'bgColor', 'border', 'fontSize', 'lineHeight', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom' ),
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);

    $openTag = '<div ' . get_block_wrapper_attributes( ['class' => 'method-button', 'id' => $methodId] ) . '>';
    $closeTag = '</div>';

    if ( method_check_array_key( $block_attributes, 'link' ) ) {
        if ( method_check_array_key( $block_attributes['link'], 'url' ) ) {
            $btnTarget = ( method_check_array_key( $block_attributes['link'], 'opensInNewTab' ) ? '_blank' : '_self' );
            $openTag = '<a target="' . $btnTarget . '" href="' . $block_attributes['link']['url'] . '" ' . get_block_wrapper_attributes( ['class' => 'method-button', 'id' => $methodId] ) . '>';
            $closeTag = '</a>';
        }
    }

    $output = $openTag . '<span class="method-button-label">' . ( method_check_array_key( $block_attributes, 'btnLabel' ) ? $block_attributes['btnLabel'] : '' ) . '</span>' . $closeTag;
    return $output;
}

function render_method_theme_button_block( $block_attributes, $block ) {
    $methodId = uniqid( 'method-' );
    $buttonIcons = apply_filters( 'method_block_theme_button_icons', false );

    $extraclass = '';
    if ( method_check_array_key( $block_attributes, 'btnStyle' ) ) {
        $extraclass = ' method-theme-button-' . $block_attributes['btnStyle'];
    }

    $openTag = '<div ' . get_block_wrapper_attributes( ['class' => 'method-theme-button' . $extraclass, 'id' => $methodId] ) . '>';
    $closeTag = '</div>';

    if ( ( is_array( $buttonIcons ) ) && ( method_check_array_key( $block_attributes, 'beforeIcon' ) ) ) {
        if ( method_check_array_key( $buttonIcons, $block_attributes['beforeIcon'] ) ) {
            $beforeLabel = '<span class="method-button-icon method-button-icon-before">' . $buttonIcons["{$block_attributes['beforeIcon']}"]['svg'] . '</span>';
        }
    } else {
        $beforeLabel = apply_filters( 'method_block_theme_button_before_label', '' );
        $beforeLabel = ( ! empty( $beforeLabel ) ? '<span class="method-button-icon method-button-icon-before">' . $beforeLabel . '</span>' : '' );
    }

    if ( ( is_array( $buttonIcons ) ) && ( method_check_array_key( $block_attributes, 'afterIcon' ) ) ) {
        if ( method_check_array_key( $buttonIcons, $block_attributes['afterIcon'] ) ) {
            $afterLabel = '<span class="method-button-icon method-button-icon-after">' . $buttonIcons["{$block_attributes['afterIcon']}"]['svg'] . '</span>';
        }
    } else {
        $afterLabel = apply_filters( 'method_block_theme_button_after_label', '' );
        $afterLabel = ( ! empty( $afterLabel ) ? '<span class="method-button-icon method-button-icon-after">' . $afterLabel . '</span>' : '' );
    }
    
    
    
    

    if ( method_check_array_key( $block_attributes, 'link' ) ) {
        if ( method_check_array_key( $block_attributes['link'], 'url' ) ) {
            $btnTarget = ( method_check_array_key( $block_attributes['link'], 'opensInNewTab' ) ? '_blank' : '_self' );
            $openTag = '<a target="' . $btnTarget . '" href="' . $block_attributes['link']['url'] . '" ' . get_block_wrapper_attributes( ['class' => 'method-theme-button' . $extraclass, 'id' => $methodId] ) . '>';
            $closeTag = '</a>';
        }
    }

    $output = $openTag . $beforeLabel . '<span class="method-button-label' . ( method_check_array_key( $block_attributes, 'labelStyle' ) ? ' ' . $block_attributes['labelStyle'] : '' ) . '">' . ( method_check_array_key( $block_attributes, 'btnLabel' ) ? $block_attributes['btnLabel'] : '' ) . '</span>' . $afterLabel . $closeTag;
    return $output;
}