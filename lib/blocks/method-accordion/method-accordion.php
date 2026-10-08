<?php

// Block registrations

function register_method_accordion_block() {
	register_block_type( __DIR__ . '/build/accordion', [
        'render_callback' => 'render_method_accordion_block'
    ]);
}
add_action( 'init', 'register_method_accordion_block' );

function register_method_accordion_item_block() {
	register_block_type( __DIR__ . '/build/item', [
        'render_callback' => 'render_method_accordion_item_block'
    ]);
}
add_action( 'init', 'register_method_accordion_item_block' );

function register_method_accordion_body_block() {
	register_block_type( __DIR__ . '/build/body', [
        'render_callback' => 'render_method_accordion_body_block'
    ]);
}
add_action( 'init', 'register_method_accordion_body_block' );

/**
 * HTML id of an accordion's wrapper. Mirrors getAccordionElementId() in
 * lib/blocks/utils/accordionId.js.
 *
 * @param string $accordion_id The accordion's `accordionId` attribute.
 * @return string
 */
function method_accordion_element_id( $accordion_id ) {
    return 'accordion-' . $accordion_id;
}

/**
 * HTML id of an accordion item's collapsible panel, unique per accordion.
 * Mirrors getAccordionCollapseId() in lib/blocks/utils/accordionId.js.
 *
 * @param string $accordion_id The accordion's `accordionId` attribute.
 * @param int    $item_index   The item's 1-based position in the accordion.
 * @return string
 */
function method_accordion_collapse_id( $accordion_id, $item_index ) {
    return method_accordion_element_id( $accordion_id ) . '-collapse-' . (int) $item_index;
}

function render_method_accordion_block( $block_attributes, $content, $block ) {
    return '<div ' . get_block_wrapper_attributes( ['class' => 'method-accordion' ] ) . '>' . do_blocks( $content ) . '</div>';
}

function render_method_accordion_item_block( $block_attributes, $content, $block ) {
    $itemIndex   = (int) ( $block_attributes['itemIndex'] ?? 1 );
    $accordionId = $block->context['method-accordion/accordionId'] ?? ( $block_attributes['parentAccordionId'] ?? '' );
    $collapseId  = method_accordion_collapse_id( $accordionId, $itemIndex );
    $hTag        = $block->context['method-accordion/hTag'] ?? 'h2';
    $closed      = $block->context['method-accordion/closed'] ?? false;
    $open        = ( 1 === $itemIndex && ! $closed );

    // The saved panel wrapper may still carry an id from before 2.0.0-beta28
    // (`collapse1`, repeated across accordions). The server decides the id, the
    // parent, and the open state, so the button and its panel always agree.
    $processor = new WP_HTML_Tag_Processor( $content );
    if ( $processor->next_tag( [ 'class_name' => 'accordion-collapse' ] ) ) {
        $processor->set_attribute( 'id', $collapseId );
        $processor->set_attribute( 'data-bs-parent', '#' . method_accordion_element_id( $accordionId ) );
        if ( $open ) {
            $processor->add_class( 'show' );
        } else {
            $processor->remove_class( 'show' );
        }
        $content = $processor->get_updated_html();
    }

    $headline = method_check_array_key( $block_attributes, 'headline' ) ? $block_attributes['headline'] : 'Accordion Item';
    return '
        <' . $hTag . ' class="accordion-header"><button class="accordion-button' . ( $open ? '' : ' collapsed' ) . '" type="button" aria-expanded="' . ( $open ? 'true' : 'false' ) . '" aria-controls="' . esc_attr( $collapseId ) . '" data-bs-toggle="collapse" data-bs-target="#' . esc_attr( $collapseId ) . '">' . $headline . '</button></' . $hTag . '>
        <div ' . get_block_wrapper_attributes( ['class' => 'accordion-item' ] ) . '>
            ' . $content . '
        </div>
    ';
}

function render_method_accordion_body_block( $block_attributes, $content, $block ) {
    return '<div ' . get_block_wrapper_attributes( ['class' => 'accordion-body' ] ) . '>' . do_blocks( $content ) . '</div>';
}
