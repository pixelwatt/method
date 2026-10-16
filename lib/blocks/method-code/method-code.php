<?php
/**
 * Method Code Block
 *
 * A syntax-highlighted code sample. The block stores the sample as plain
 * text in its `code` attribute and renders server-side, so the saved markup
 * is a single delimiter comment: no highlighted HTML is ever stored, and a
 * sample can be edited wherever the block markup can be (the editor, the
 * REST API, a docs pipeline). highlight.js, bundled into the view script,
 * tokenises the sample in the browser; the editor uses the same bundle, so
 * the canvas matches the page (see lib/blocks/utils/highlight.js). Without
 * JavaScript the sample is still a readable <pre><code>.
 *
 * Colors come from global.scss, where a child theme can retheme the block
 * through the --method-code-* custom properties.
 *
 * @package Method
 */


/**
 * The languages the block offers: stored value => label the header pill
 * shows when the block has no label of its own. Mirrors LANGUAGES in
 * lib/blocks/utils/highlight.js, where the matching grammars are registered:
 * a value added here only highlights once its grammar is registered there.
 *
 * @return array<string, string>
 */
function method_code_get_languages() {
	$languages = array(
		'php'          => 'PHP',
		'php-template' => 'PHP + HTML',
		'html'         => 'HTML',
		'css'          => 'CSS',
		'scss'         => 'SCSS',
		'javascript'   => 'JavaScript',
		'typescript'   => 'TypeScript',
		'json'         => 'JSON',
		'bash'         => 'Shell',
		'markdown'     => 'Markdown',
		'plaintext'    => 'Plain text',
	);

	/**
	 * Filters the languages the Code block knows. Server-side the list only
	 * supplies the pill label and sanitises the stored value; a new value
	 * needs its grammar registered in lib/blocks/utils/highlight.js to
	 * highlight.
	 *
	 * @param array $languages value => label
	 */
	return apply_filters( 'method_code_languages', $languages );
}


/**
 * Other names a language may be stored under (what another block, or a
 * person, would call it), mapped to the value the block uses. Mirrors
 * ALIASES in lib/blocks/utils/highlight.js.
 *
 * @return array<string, string>
 */
function method_code_get_language_aliases() {
	return array(
		'zsh'   => 'bash',
		'sh'    => 'bash',
		'shell' => 'bash',
		'js'    => 'javascript',
		'jsx'   => 'javascript',
		'ts'    => 'typescript',
		'tsx'   => 'typescript',
		'md'    => 'markdown',
		'xml'   => 'html',
		'svg'   => 'html',
		'text'  => 'plaintext',
		'txt'   => 'plaintext',
	);
}


/**
 * A stored language value, resolved to one the block knows: aliases first,
 * then the list, then plain text. Mirrors resolveLanguage() in
 * lib/blocks/utils/highlight.js.
 *
 * @param string $language
 * @return string
 */
function method_code_sanitize_language( $language ) {
	$language = strtolower( trim( (string) $language ) );
	$aliases  = method_code_get_language_aliases();
	if ( isset( $aliases[ $language ] ) ) {
		$language = $aliases[ $language ];
	}
	$languages = method_code_get_languages();
	return isset( $languages[ $language ] ) ? $language : 'plaintext';
}


/**
 * Register the block.
 */
function method_code_register() {
	register_block_type( __DIR__ . '/build', array(
		'render_callback' => 'method_code_render',
	) );
}
add_action( 'init', 'method_code_register' );


/**
 * Prints the sample as <pre><code class="language-…">, with the header the
 * block asks for. The view script (src/frontend.js) highlights the code and
 * wires the copy button; it reads the language from the class, so the class
 * is the one contract between the two.
 *
 * @param array     $attributes Block attributes.
 * @param string    $content    Block inner content (unused).
 * @param \WP_Block $block      Block instance.
 * @return string
 */
function method_code_render( $attributes, $content, $block ) {
	$code = (string) ( $attributes['code'] ?? '' );
	if ( '' === trim( $code ) ) {
		return '';
	}

	$methodId = uniqid( 'method-' );
	// Mirrors cssMap in src/edit.js.
	$cssargs = array(
		'#' . $methodId => array( 'margin-top', 'margin-bottom' ),
	);
	$responsive = method_get_block_responsive_styles( $attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
	method_collect_css( $responsive, '#' . $methodId, 10 );

	$language  = method_code_sanitize_language( $attributes['language'] ?? 'php' );
	$languages = method_code_get_languages();

	$label = trim( wp_strip_all_tags( (string) ( $attributes['label'] ?? '' ) ) );
	if ( '' === $label ) {
		$label = $languages[ $language ];
	}

	$show_label = ! array_key_exists( 'showLabel', $attributes ) || ! empty( $attributes['showLabel'] );
	$show_copy  = ! array_key_exists( 'showCopy', $attributes ) || ! empty( $attributes['showCopy'] );
	$wrap_lines = ! empty( $attributes['wrapLines'] );
	$has_header = $show_label || $show_copy;

	$classes = array( 'method-code' );
	if ( $wrap_lines ) {
		$classes[] = 'method-code--wrap';
	}
	if ( ! $has_header ) {
		$classes[] = 'method-code--bare';
	}

	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class'         => implode( ' ', $classes ),
			'id'            => $methodId,
			'data-language' => $language,
		)
	);

	ob_start();
	?>
	<div <?php echo $wrapper_attributes; ?>>
		<?php if ( $has_header ) : ?>
		<div class="method-code__header">
			<?php if ( $show_label ) : ?>
			<span class="method-code__label"><?php echo esc_html( $label ); ?></span>
			<?php endif; ?>
			<?php if ( $show_copy ) : ?>
			<button type="button" class="method-code__copy" data-copy-label="<?php esc_attr_e( 'Copy', 'method' ); ?>" data-copied-label="<?php esc_attr_e( 'Copied', 'method' ); ?>" aria-label="<?php esc_attr_e( 'Copy code to clipboard', 'method' ); ?>">
				<svg class="method-code__copy-icon method-code__copy-icon--copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
				<svg class="method-code__copy-icon method-code__copy-icon--copied" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5"/></svg>
				<span class="method-code__copy-text"><?php esc_html_e( 'Copy', 'method' ); ?></span>
			</button>
			<?php endif; ?>
		</div>
		<?php endif; ?>
		<pre class="method-code__pre" tabindex="0"><code class="method-code__code language-<?php echo esc_attr( $language ); ?>"><?php echo esc_html( $code ); ?></code></pre>
	</div>
	<?php
	return ob_get_clean();
}
