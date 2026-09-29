<?php

// Block registrations

function register_method_modal_block() {
    register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_modal_block'
    ]);
}
add_action( 'init', 'register_method_modal_block' );

function method_modal_enqueue_block_assets() {
    wp_localize_script( 'method-modal-editor-script', 'methodModalData', array(
        'sizes' => method_get_modal_sizes(),
    ));
}
add_action( 'enqueue_block_editor_assets', 'method_modal_enqueue_block_assets' );

/**
 * WordPress dequeues the assets enqueued while rendering a block that prints
 * nothing. This block prints nothing where it sits, but its content is printed
 * in the footer and needs what it enqueued: block styles, form scripts.
 */
function method_modal_keep_assets( $enqueue, $block_name ) {
    return 'method/modal' === $block_name ? true : $enqueue;
}
add_filter( 'enqueue_empty_block_content_assets', 'method_modal_keep_assets', 10, 2 );

/**
 * The same happens one level up when the block around a modal prints nothing
 * either, such as a synced pattern that holds only a modal. So the assets of
 * a modal's content are noted here, before the content renders, and enqueued
 * again by the modal registry once the page has rendered.
 */
function method_modal_snapshot_assets( $parsed_block ) {
    if ( 'method/modal' === ( $parsed_block['blockName'] ?? '' ) ) {
        Method_Modals::instance()->snapshot_assets();
    }
    return $parsed_block;
}
add_filter( 'render_block_data', 'method_modal_snapshot_assets' );

/**
 * Id a modal block is opened with: the custom id if there is one, otherwise
 * the id generated when the block was inserted. Mirrors getEffectiveModalId()
 * in lib/blocks/utils/modalId.js.
 *
 * @param array $block_attributes
 * @return string Id, or '' if the block has none yet.
 */
function method_modal_get_block_id( $block_attributes ) {
    $custom = method_sanitize_modal_id( $block_attributes['customId'] ?? '' );
    if ( '' !== $custom ) {
        return $custom;
    }
    return method_sanitize_modal_id( $block_attributes['modalId'] ?? '' );
}

/**
 * The block prints nothing where it sits. Its content is handed to the modal
 * registry (lib/class-method-modals.php), which prints the modal in the footer.
 */
function render_method_modal_block( $block_attributes, $content, $block ) {
    // Taken first: every snapshot has to be collected, whatever happens below.
    $assets = Method_Modals::instance()->assets_since_snapshot();

    // Nowhere to print a modal.
    if ( wp_is_serving_rest_request() || is_feed() ) {
        return '';
    }

    // Block visibility is applied to the block's output after this callback
    // has run, which is too late to stop a hidden modal from registering.
    if ( false === ( $block->parsed_block['attrs']['metadata']['blockVisibility'] ?? null ) ) {
        return '';
    }

    $modalId = method_modal_get_block_id( $block_attributes );
    if ( '' === $modalId || Method_Modals::instance()->is_registered( $modalId ) ) {
        return '';
    }

    $scope = '#' . $modalId . '.method-modal';
    $cssargs = array(
        $scope . ' .modal-content' => array( 'textColor', 'bgColor', 'border', 'borderRadius' ),
        $scope . ' .modal-header' => array( 'padding-top', 'padding-left', 'padding-right' ),
        $scope . ' .modal-body' => array( 'padding-bottom', 'padding-left', 'padding-right' ),
        $scope . ' .modal-body a:not(.method-theme-button)' => array( 'linkColor' ),
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );

    method_register_modal( array(
        'id'      => $modalId,
        'title'   => $block_attributes['title'] ?? '',
        'content' => $content,
        'source'  => 'block',
        'class'   => trim( 'wp-block-method-modal ' . ( $block_attributes['className'] ?? '' ) ),
        'css'     => $responsive,
        'assets'  => $assets,
        'options' => array(
            'size'             => $block_attributes['size'] ?? 'default',
            'fullscreen_below' => $block_attributes['fullscreenBelow'] ?? '',
            'centered'         => ! empty( $block_attributes['centered'] ),
            'scrollable'       => ! empty( $block_attributes['scrollable'] ),
            'static_backdrop'  => ! empty( $block_attributes['staticBackdrop'] ),
            'hide_title'       => ! empty( $block_attributes['hideTitle'] ),
            'title_tag'        => $block_attributes['titleTag'] ?? 'h2',
            'close_icon'       => $block_attributes['closeIcon'] ?? '',
        ),
    ) );

    return '';
}
