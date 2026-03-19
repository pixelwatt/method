<?php
/**
 * Method Scrollspy Block
 *
 * Registers and renders the scrollspy/table-of-contents block.
 * All TOC generation happens client-side via frontend.js — the PHP render
 * simply outputs a semantic <nav> container with the data attributes
 * that the JS needs to hydrate.
 *
 * @package Method
 */





/**
 * Register the block.
 */
function scrollspy_register() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'scrollspy_render',
    ]);
}
add_action( 'init', 'scrollspy_register' );

/**
 * Render the scrollspy block on the frontend.
 *
 * @param array     $attributes Block attributes.
 * @param string    $content    Block inner content (unused).
 * @param \WP_Block $block      Block instance.
 * @return string
 */
function scrollspy_render( $attributes, $content, $block ) {
	$methodId = uniqid( 'method-' );
	$cssargs = array(
		'#' . $methodId . ' .method-scrollspy__label' => array( 'color' ),
        '#' . $methodId . ' .method-scrollspy__link' => array( 'linkColor' ),
		'#' . $methodId . ' .method-scrollspy__link:hover, #' . $methodId . ' .method-scrollspy__link:focus-visible' => array( 'linkHoverColor' ),
		'#' . $methodId . ' .method-scrollspy__link.is-active' => array( 'linkActiveColor' ),
    );

	$responsive = method_get_block_responsive_styles( $attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10);

	$target_selector = esc_attr( $attributes['targetSelector'] ?? '.docs-content' );
	$label           = esc_html( $attributes['label'] ?? 'On this page' );
	$heading_levels  = $attributes['headingLevels'] ?? array( 'h2', 'h3' );
	$sticky_offset   = intval( $attributes['stickyOffset'] ?? 0 );

	// Resolve the stickyAt breakpoint key to its pixel value.
	$sticky_at_key   = $attributes['stickyAt'] ?? 'md';
	$sticky_at_value = '';
	$breakpoints     = method_get_all_bs_breakpoint_options();
	foreach ( $breakpoints as $bp ) {
		if ( $bp['key'] === $sticky_at_key ) {
			$sticky_at_value = $bp['hint']; // e.g. "768px"
			break;
		}
	}

	// Sanitize heading levels to a safe comma-separated string.
	$allowed_levels  = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
	$heading_levels  = array_filter( $heading_levels, function ( $level ) use ( $allowed_levels ) {
		return in_array( $level, $allowed_levels, true );
	} );
	$levels_attr     = esc_attr( implode( ',', $heading_levels ) );

	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class'              => 'method-scrollspy',
			'data-target'        => $target_selector,
			'data-levels'        => $levels_attr,
			'data-sticky-offset' => $sticky_offset,
			'data-sticky-at'     => esc_attr( $sticky_at_value ),
			'aria-label'         => $label,
			'id'                 => $methodId,
		)
	);

	ob_start();
	?>
	<nav <?php echo $wrapper_attributes; ?>>
		<div class="method-scrollspy__inner">
			<p class="method-scrollspy__label"><?php echo $label; ?></p>
			<ol class="method-scrollspy__list" role="list"></ol>
		</div>
	</nav>
	<?php
	return ob_get_clean();
}
