<?php

function method_admin_scripts() {
    wp_enqueue_style( 'method-admin', get_template_directory_uri() . '/assets/css/admin.css', '', METHOD_VERSION );
}

add_action( 'admin_enqueue_scripts', 'method_admin_scripts' );


//======================================================================
// DASHBOARD / EDITOR OPTIMIZATIONS
//======================================================================

//-----------------------------------------------------
// Remove editor button to add Ninja Forms
//-----------------------------------------------------

add_action( 'admin_head', 'method_remove_add_new_nf_button' );

function method_remove_add_new_nf_button() {
	echo '<style>
		#wp-content-media-buttons .button.nf-insert-form {display:none !important; visibility: hidden !important;}
	</style>';
}

//-----------------------------------------------------
// Remove sidebar metabox for appending a Ninja Form
//-----------------------------------------------------

add_action( 'add_meta_boxes', function() {
	remove_meta_box( 'nf_admin_metaboxes_appendaform', ['page', 'post'], 'side' );
}, 99 );


//-----------------------------------------------------
// Lower Yoast metabox priority
//-----------------------------------------------------

function method_lower_wpseo_priority( $html ) {
	return 'low';
}
add_filter( 'wpseo_metabox_prio', 'method_lower_wpseo_priority' );


//======================================================================
// LOGIN CUSTOMIZATION
//======================================================================

//-----------------------------------------------------
// Change the login page logo URL to link to the site.
//-----------------------------------------------------

function method_custom_login_url( $url ) {
	return get_site_url();
}
add_filter( 'login_headerurl', 'method_custom_login_url' );


//-----------------------------------------------------
// Enqueue scripts and styles for login.
//-----------------------------------------------------

function method_login_scripts() {
	wp_enqueue_style( 'method-login', get_template_directory_uri() . '/login.css', '', METHOD_VERSION );
}

add_action( 'login_enqueue_scripts', 'method_login_scripts' );

add_filter('update_footer', 'replace_admin_footer_version', 999);
function replace_admin_footer_version($footer_text) {
    return 'Built with Method v' . METHOD_VERSION . ' | Powered by WordPress v' . get_bloginfo('version');
}


add_action( 'cmb2_admin_init', 'method_register_breadcrumb_metabox' );

function method_register_breadcrumb_metabox() {
	$public_has_archive = get_post_types( [
		'public'      => true,
		'has_archive' => true,
		'_builtin'    => false,
	], 'names' );

	$public_no_archive = get_post_types( [
		'public'      => true,
		'has_archive' => false,
		'_builtin'    => false,
	], 'names' );

	$post_types = array_merge( $public_has_archive, $public_no_archive );
	$post_types[] = 'post';
	$post_types[] = 'page';

	$cmb_options = new_cmb2_box(
		array(
			'id'            => '_method_metabox_breadcrumb',
			'title'         => esc_html__( 'Breadcrumb Options', 'method' ),
			'object_types'  => $post_types,
		)
	);

	$cmb_options->add_field(
		array(
			'name'     => __( 'Custom Breadcrumb Title', 'cortlandt' ),
			'desc'     => __( '(Optional) If needed, provide a custom breadcrumb title for this post here.', 'cortlandt' ),
			'id'   => '_method_bc_title',
			'type'     => 'text',
		)
	);

}


add_action( 'cmb2_admin_init', 'method_register_taxonomy_breadcrumb_metabox' );

function method_register_taxonomy_breadcrumb_metabox() {
	$public_taxonomies = get_taxonomies( [
    	'public'   => true,
    	'_builtin' => false,
	], 'names' );
	$public_taxonomies[] = 'category';
	$public_taxonomies[] = 'post_tag';

	$cmb_options = new_cmb2_box(
		array(
			'id'            => '_method_metabox_taxonomy_breadcrumb',
			'title'         => esc_html__( 'Breadcrumb Options', 'method' ),
			'object_types'     => array( 'term' ), // Tells CMB2 to use term_meta vs post_meta
			'taxonomies'       => $public_taxonomies // Tells CMB2 which taxonomies should have these fields
		)
	);

	$cmb_options->add_field(
		array(
			'name'     => __( 'Custom Breadcrumb Title', 'cortlandt' ),
			'desc'     => __( '(Optional) If needed, provide a custom breadcrumb title for this post here.', 'cortlandt' ),
			'id'   => '_method_bc_title',
			'type'     => 'text',
		)
	);
}