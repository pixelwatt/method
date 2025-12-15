<?php
/**
 * Plugin Name: Method Bootstrap Tabs
 * Description: Bootstrap tabs block for the block editor
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Block registrations

function register_method_tabs_block() {
	register_block_type( __DIR__ . '/build/tabs', [
		'render_callback' => 'render_method_tabs_block'
	]);
}
add_action( 'init', 'register_method_tabs_block' );

function register_method_tab_block() {
	register_block_type( __DIR__ . '/build/tab', [
		'render_callback' => 'render_method_tab_block'
	]);
}
add_action( 'init', 'register_method_tab_block' );


// Frontend rendering callbacks

//-----------------------------------------------------
// Tabs Container
//-----------------------------------------------------

function render_method_tabs_block( $block_attributes, $content, $block ) {
	$method_id     = isset( $block_attributes['methodId'] ) ? $block_attributes['methodId'] : uniqid( 'method-tabs-' );
	$nav_placement = isset( $block_attributes['navPlacement'] ) ? $block_attributes['navPlacement'] : 'top';
	$nav_alignment = isset( $block_attributes['navAlignment'] ) ? $block_attributes['navAlignment'] : 'start';
	$nav_style     = isset( $block_attributes['navStyle'] ) ? $block_attributes['navStyle'] : 'tabs';
	$nav_fill      = ! empty( $block_attributes['navFill'] );

	// Build nav classes
	$nav_classes = [
		'nav',
		$nav_style === 'pills' ? 'nav-pills' : 'nav-tabs',
	];

	if ( $nav_fill ) {
		$nav_classes[] = 'nav-fill';
	}

	if ( $nav_alignment === 'center' ) {
		$nav_classes[] = 'justify-content-center';
	} elseif ( $nav_alignment === 'end' ) {
		$nav_classes[] = 'justify-content-end';
	}

	if ( in_array( $nav_placement, [ 'left', 'right' ], true ) ) {
		$nav_classes[] = 'flex-column';
	}

	// Build wrapper classes
	$wrapper_classes = [ 'method-tabs' ];
	if ( in_array( $nav_placement, [ 'left', 'right' ], true ) ) {
		$wrapper_classes[] = 'd-flex';
		if ( $nav_placement === 'right' ) {
			$wrapper_classes[] = 'flex-row-reverse';
		}
	}

	// Parse inner blocks to build navigation and tab panes
	$nav_items   = '';
	$tab_panes   = '';
	$tab_index   = 0;

	foreach ( $block->inner_blocks as $inner_block ) {
		if ( $inner_block->name === 'method/tab' ) {
			$tab_id    = isset( $inner_block->attributes['methodId'] ) ? $inner_block->attributes['methodId'] : $method_id . '-tab-' . $tab_index;
			$tab_label = isset( $inner_block->attributes['label'] ) ? $inner_block->attributes['label'] : 'Tab ' . ( $tab_index + 1 );
			$tab_icon  = isset( $inner_block->attributes['icon'] ) ? $inner_block->attributes['icon'] : '';
			$is_active = $tab_index === 0;

			// Build nav item
			$icon_html = '';
			if ( ! empty( $tab_icon ) ) {
				$icon_html = sprintf( '<i class="bi %s me-2"></i>', esc_attr( $tab_icon ) );
			}

			$nav_items .= sprintf(
				'<li class="nav-item" role="presentation">
					<button class="nav-link%s" id="%s-tab" data-bs-toggle="tab" data-bs-target="#%s" type="button" role="tab" aria-controls="%s" aria-selected="%s">%s%s</button>
				</li>',
				$is_active ? ' active' : '',
				esc_attr( $tab_id ),
				esc_attr( $tab_id ),
				esc_attr( $tab_id ),
				$is_active ? 'true' : 'false',
				$icon_html,
				esc_html( $tab_label )
			);

			// Build tab pane
			$pane_classes = [ 'tab-pane', 'fade' ];
			if ( $is_active ) {
				$pane_classes[] = 'show';
				$pane_classes[] = 'active';
			}

			// Render inner block content
			$inner_content = '';
			foreach ( $inner_block->inner_blocks as $child_block ) {
				$inner_content .= render_block( $child_block->parsed_block );
			}

			$tab_panes .= sprintf(
				'<div class="%s" id="%s" role="tabpanel" aria-labelledby="%s-tab" tabindex="0">%s</div>',
				esc_attr( implode( ' ', $pane_classes ) ),
				esc_attr( $tab_id ),
				esc_attr( $tab_id ),
				$inner_content
			);

			$tab_index++;
		}
	}

	$nav_html = sprintf(
		'<ul class="%s" id="%s-nav" role="tablist">%s</ul>',
		esc_attr( implode( ' ', $nav_classes ) ),
		esc_attr( $method_id ),
		$nav_items
	);

	$tab_content = '<div class="tab-content">' . $tab_panes . '</div>';

	// Build output based on placement
	$output = '<div ' . get_block_wrapper_attributes( [ 'class' => implode( ' ', $wrapper_classes ), 'id' => $method_id ] ) . '>';

	if ( in_array( $nav_placement, [ 'top', 'left' ], true ) ) {
		$output .= $nav_html;
	}

	$output .= $tab_content;

	if ( in_array( $nav_placement, [ 'bottom', 'right' ], true ) ) {
		$output .= $nav_html;
	}

	$output .= '</div>';

	return $output;
}

//-----------------------------------------------------
// Tab Panel
// Rendered by parent - this is a fallback for edge cases
//-----------------------------------------------------

function render_method_tab_block( $block_attributes, $content, $block ) {
	return do_blocks( $content );
}
