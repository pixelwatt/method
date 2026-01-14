<?php

//======================================================================
// METHOD OPTIONS
//======================================================================

add_action( 'cmb2_admin_init', 'method_register_theme_options_metabox' );

function method_register_theme_options_metabox() {

	/**
	 * Registers options page menu item and form.
	 */
	$cmb_options = new_cmb2_box(
		array(
			'id'           => 'method_theme_options_metabox',
			'title'        => __( '<span class="method-logo-wrap">&nbsp;</span><span class="visually-hidden">Method </span>Framework Settings | v' . METHOD_VERSION, 'method' ),
			'object_types' => array( 'options-page' ),

			/*
			 * The following parameters are specific to the options-page box
			 * Several of these parameters are passed along to add_menu_page()/add_submenu_page().
			 */

			'option_key'      => 'method_options', // The option key and admin menu page slug.
			'icon_url'        => 'data:image/svg+xml;base64,' . base64_encode('<svg width="153" height="153" viewBox="0 0 153 153" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M46.2419 72.7477L25.2229 53.4803V24.7544L46.2419 44.1969L77.0696 72.3973L107.897 44.1969L129.092 24.7544V127.397H107.897V72.7477L77.0696 100.948L46.2419 72.7477ZM46.2419 99.3717L25.2229 80.1043V127.397H46.2419V99.3717Z" fill="currentColor"/></svg>'), // Menu icon. Only applicable if 'parent_slug' is left empty.
			'menu_title'      => esc_html__( 'Method Settings', 'method' ), // Falls back to 'title' (above).
			// 'parent_slug'     => 'themes.php', // Make options page a submenu item of the themes menu.
			// 'capability'      => 'manage_options', // Cap required to view options-page.
			'position'        => 2, // Menu position. Only applicable if 'parent_slug' is left empty.
			// 'admin_menu_hook' => 'network_admin_menu', // 'network_admin_menu' to add network-level options page.
			// 'display_cb'      => false, // Override the options-page form output (CMB2_Hookup::options_page_output()).
			'save_button'     => esc_html__( 'Update Settings', 'myprefix' ), // The text for the options-page save button. Defaults to 'Save'.
			'classes' => 'method-options-panel',
		)
	);

	$cmb_options->add_field(
		array(
			'name'     => __( 'Social Media Links', 'method' ),
			'id'       => 'social_info',
			'type'     => 'title',
		)
	);

	$group_field_social_accounts = $cmb_options->add_field(
		array(
			'id'          => 'social_accounts',
			'type'        => 'group',
			'description' => __( 'Configure social account links below. To display these links, use the Social Nav block.', 'method' ),
			// 'repeatable'  => false, // use false if you want non-repeatable group
			'options'     => array(
				'group_title'       => __( 'Link {#}', 'method' ), // since version 1.1.4, {#} gets replaced by row number
				'add_button'        => __( '+ Add Another Account', 'method' ),
				'remove_button'     => __( 'Remove Account', 'method' ),
				'sortable'          => true,
				'closed'         => true, // true to have the groups closed by default
				// 'remove_confirm' => esc_html__( 'Are you sure you want to remove?', 'method' ), // Performs confirmation before removing group.
			),
		)
	);

	$cmb_options->add_group_field(
		$group_field_social_accounts,
		array(
			'name' => 'Service',
			'id'   => 'service',
			'type' => 'radio_inline',
			'show_option_none' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ban" viewBox="0 0 16 16"><path d="M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0"/></svg><span class="service-label">None (Disabled)</span>',
			'default' => '',
			'classes' => 'method-options-panel-social-list',
			//'desc' => __( 'Which service are you adding a link for?', 'method' ),
			'options' => method_get_options_page_social_options()
		)
	);

	$cmb_options->add_group_field(
		$group_field_social_accounts,
		array(
			'name' => __( 'Profile URL', 'method' ),
			'desc' => __( 'Enter the full URL for your profile.', 'method' ),
			'id'   => 'url',
			'type' => 'text_url',
		)
	);

	$cmb_options->add_field(
		array(
			'name'     => __( 'Additional Information', 'method' ),
			'id'       => 'dia_info',
			'type'     => 'title',
		)
	);

if ( defined( 'METHOD_CHILD_OPTIONS' ) ) {
	$theme_data = METHOD_CHILD_OPTIONS;
	$theme_data_desc = __( 'Using child theme overrides.', 'method' );
} else {
	$theme_data = METHOD_OPTIONS;
	$theme_data_desc = __( 'Using Method\'s default configuration.', 'method' );
}

$childv = '';
if (defined('THEME_VERSION')) {
$childv = '
Child Theme Version: v' . THEME_VERSION;
}

$dia = 'Method Version: v' . METHOD_VERSION . $childv . '
WordPress Version: v' . get_bloginfo('version') . '
User Agent: ' . $_SERVER['HTTP_USER_AGENT'] . '
';

	$cmb_options->add_field(
		array(
			'name'     => __( 'Diagnostic Details', 'method' ),
			//'desc'     => __( 'Click to copy details to clipboard.', 'method' ),
			'id'       => 'dia_data',
			'type'     => 'textarea',
			'save_field' => false,
			'default' => $dia,
			'attributes' => array(
				'disabled' => true,
				'rows' => 5
			)
		)
	);

	$cmb_options->add_field(
		array(
			'name'     => __( 'Loaded Theme Data', 'method' ),
			//'desc'     => __( 'Click to copy details to clipboard.', 'method' ),
			'id'       => 'dia_themedata',
			'type'     => 'textarea',
			'save_field' => false,
			'default' => print_r( $theme_data, true ),
			'desc' => $theme_data_desc,
			'attributes' => array(
				'disabled' => true,
				'rows' => 5
			)
		)
	);
	
	$cmb_options->add_field(
		array(
			'name'     => __( 'HTTP Auth Support', 'method' ),
			'id'       => 'http_auth_title',
			'desc'	   => 'If this hosting environment has basic http auth enabled, provide credentials below to enable support if encountering broken block editor styles or other failed asset loads.',
			'type'     => 'title',
		)
	);

	$cmb_options->add_field(
		array(
			'name'     => __( 'Enable Support', 'method' ),
			'id'       => 'http_auth_enabled',
			'desc'     => 'Check here to enable basic http auth support.',
			'type'     => 'checkbox',
		)
	);

	$cmb_options->add_field(
		array(
			'name'     => __( 'User', 'method' ),
			'id'       => 'http_auth_user',
			'desc'     => 'NOTE: Do not provide your WordPress account username here.',
			'type'     => 'text',
		)
	);

	$cmb_options->add_field(
		array(
			'name'     => __( 'Password', 'method' ),
			'id'       => 'http_auth_pass',
			'desc'     => 'NOTE: Do not provide your WordPress account password here.',
			'type'     => 'text',
		)
	);

	/*
	 * Options fields ids only need
	 * to be unique within this box.
	 * Prefix is not needed.
	 */

}
