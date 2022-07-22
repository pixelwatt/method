<?php

//======================================================================
// THEME OPTIONS
//======================================================================

add_action( 'cmb2_admin_init', 'method_register_theme_options_metabox' );

function method_register_theme_options_metabox() {

	/**
	 * Registers options page menu item and form.
	 */
	$cmb_options = new_cmb2_box(
		array(
			'id'           => 'method_theme_options_metabox',
			'title'        => esc_html__( 'method Theme Options', 'method' ),
			'object_types' => array( 'options-page' ),

			/*
			 * The following parameters are specific to the options-page box
			 * Several of these parameters are passed along to add_menu_page()/add_submenu_page().
			 */

			'option_key'      => 'method_options', // The option key and admin menu page slug.
			// 'icon_url'        => 'dashicons-palmtree', // Menu icon. Only applicable if 'parent_slug' is left empty.
			'menu_title'      => esc_html__( 'Theme Options', 'method' ), // Falls back to 'title' (above).
			'parent_slug'     => 'themes.php', // Make options page a submenu item of the themes menu.
			// 'capability'      => 'manage_options', // Cap required to view options-page.
			// 'position'        => 1, // Menu position. Only applicable if 'parent_slug' is left empty.
			// 'admin_menu_hook' => 'network_admin_menu', // 'network_admin_menu' to add network-level options page.
			// 'display_cb'      => false, // Override the options-page form output (CMB2_Hookup::options_page_output()).
			// 'save_button'     => esc_html__( 'Save Theme Options', 'myprefix' ), // The text for the options-page save button. Defaults to 'Save'.
		)
	);

	$cmb_options->add_field(
		array(
			'name'     => __( '<span style="font-size: 1.25rem; font-weight: 800; line-height: 1; text-transform: none;">Social Media Accounts</span>', 'method' ),
			'id'       => 'social_info',
			'type'     => 'title',
		)
	);

	$group_field_social_accounts = $cmb_options->add_field(
		array(
			'id'          => 'social_accounts',
			'type'        => 'group',
			'description' => __( 'Configure social account links below.', 'method' ),
			// 'repeatable'  => false, // use false if you want non-repeatable group
			'options'     => array(
				'group_title'       => __( 'Account {#}', 'method' ), // since version 1.1.4, {#} gets replaced by row number
				'add_button'        => __( 'Add Another Account', 'method' ),
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
			'type' => 'select',
			'show_option_none' => true,
			'default' => '',
			'desc' => __( 'Which service are you adding a link for?', 'method' ),
			'options' => array(
				'facebook' => esc_attr__( 'Facebook', 'method' ),
				'twitter' => esc_attr__( 'Twitter', 'method' ),
				'linkedin' => esc_attr__( 'LinkedIn', 'method' ),
				'instagram' => esc_attr__( 'Instagram', 'method' ),
				'pinterest' => esc_attr__( 'Pinterest', 'method' ),
				'youtube' => esc_attr__( 'YouTube', 'method' ),
				'twitch' => esc_attr__( 'Twitch', 'method' ),
				'tiktok' => esc_attr__( 'TikTok', 'method' ),
			),
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
			'name'     => __( '<span style="font-size: 1.25rem; font-weight: 800; line-height: 1; text-transform: none;">Footer Options</span>', 'method' ),
			'id'       => 'footer_info',
			'type'     => 'title',
		)
	);

	$cmb_options->add_field(
		array(
			'name'     => __( 'Copyright', 'method' ),
			'id'       => 'footer_copyright',
			'type'     => 'wysiwyg',
		)
	);

	/*
	 * Options fields ids only need
	 * to be unique within this box.
	 * Prefix is not needed.
	 */

}
