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
			'title'        => esc_html__( 'Method Theme Options', 'method' ),
			'object_types' => array( 'options-page' ),

			/*
			 * The following parameters are specific to the options-page box
			 * Several of these parameters are passed along to add_menu_page()/add_submenu_page().
			 */

			'option_key'      => 'method_options', // The option key and admin menu page slug.
			'icon_url'        => 'data:image/svg+xml;base64,' . base64_encode('<svg width="153" height="153" viewBox="0 0 153 153" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M46.2419 72.7477L25.2229 53.4803V24.7544L46.2419 44.1969L77.0696 72.3973L107.897 44.1969L129.092 24.7544V127.397H107.897V72.7477L77.0696 100.948L46.2419 72.7477ZM46.2419 99.3717L25.2229 80.1043V127.397H46.2419V99.3717Z" fill="currentCOlor"/></svg>'), // Menu icon. Only applicable if 'parent_slug' is left empty.
			'menu_title'      => esc_html__( 'Theme Settings', 'method' ), // Falls back to 'title' (above).
			// 'parent_slug'     => 'themes.php', // Make options page a submenu item of the themes menu.
			// 'capability'      => 'manage_options', // Cap required to view options-page.
			'position'        => 2, // Menu position. Only applicable if 'parent_slug' is left empty.
			// 'admin_menu_hook' => 'network_admin_menu', // 'network_admin_menu' to add network-level options page.
			// 'display_cb'      => false, // Override the options-page form output (CMB2_Hookup::options_page_output()).
			// 'save_button'     => esc_html__( 'Save Theme Options', 'myprefix' ), // The text for the options-page save button. Defaults to 'Save'.
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
			'description' => __( 'Configure social account links below.', 'method' ),
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
			'show_option_none' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/></svg><span class="visually-hidden">Custom</span',
			'default' => '',
			'classes' => 'method-options-panel-social-list',
			//'desc' => __( 'Which service are you adding a link for?', 'method' ),
			'options' => array(
				'bluesky' => __( '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-square-fill" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z"/></svg><span class="visually-hidden">Bluesky</span>', 'hmco' ),
				'facebook' => __( '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/></svg><span class="visually-hidden">Facebook</span>', 'hmco' ),
				'flickr' => __( '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><ellipse cx="3.55" cy="8" rx="3.55" ry="3.5" fill="currentColor"/><ellipse cx="12.45" cy="8" rx="3.55" ry="3.5" fill="currentColor"/></svg><span class="visually-hidden">Flickr</span>', 'hmco' ),
				'instagram' => __( '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/></svg><span class="visually-hidden">Instagram</span>', 'hmco' ),
				'issuu' => __( '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8.09,3.9c-2.25-.02-4.09,1.78-4.11,4.03-.02,2.25,1.78,4.09,4.03,4.11,2.25.02,4.09-1.78,4.11-4.03.02-2.25-1.78-4.08-4.03-4.11ZM8.03,10.03c-1.14-.01-2.05-.94-2.04-2.08.01-1.14.94-2.05,2.08-2.04,1.14.01,2.05.94,2.04,2.08,0,1.13-.94,2.05-2.08,2.04Z" fill="currentColor"/><path d="M7.99,0H.66C.3,0,0,.3,0,.66v7.34c0,4.42,3.58,8,8,8s8-3.58,8-8C15.99,3.58,12.41,0,7.99,0ZM2.5,7.89c.03-3.07,2.54-5.53,5.61-5.5,3.07.03,5.53,2.54,5.5,5.61-.03,3.07-2.54,5.53-5.61,5.5-3.07-.02-5.53-2.54-5.5-5.61Z" fill="currentColor"/></svg><span class="visually-hidden">Issuu</span>', 'hmco' ),
				'linkedin' => __( '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/></svg><span class="visually-hidden">LinkedIn</span>', 'hmco' ),
				'pinterest' => __( '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pinterest" viewBox="0 0 16 16"><path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0"/></svg><span class="visually-hidden">Pinterest</span>', 'hmco' ),
				'threads' => __( '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-threads" viewBox="0 0 16 16"><path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161"/></svg><span class="visually-hidden">Threads</span>', 'hmco' ),
				'tiktok' => __( '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tiktok" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/></svg><span class="visually-hidden">TikTok</span>', 'hmco' ),
				'twitch' => __( '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitch" viewBox="0 0 16 16"><path d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142z"/><path d="M11.857 3.143h-1.143V6.57h1.143zm-3.143 0H7.571V6.57h1.143z"/></svg><span class="visually-hidden">Twitch</span>', 'hmco' ),
				'twitter' => __( '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg><span class="visually-hidden">Twitter (X)</span>', 'hmco' ),
				'vimeo' => __( '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-vimeo" viewBox="0 0 16 16"><path d="M15.992 4.204q-.106 2.334-3.262 6.393-3.263 4.243-5.522 4.243-1.4 0-2.367-2.583L3.55 7.523Q2.83 4.939 2.007 4.94q-.178.001-1.254.754L0 4.724a210 210 0 0 0 2.334-2.081q1.581-1.364 2.373-1.437 1.865-.185 2.298 2.553.466 2.952.646 3.666.54 2.447 1.186 2.445.5 0 1.508-1.587 1.006-1.587 1.077-2.415.144-1.37-1.077-1.37a3 3 0 0 0-1.185.261q1.183-3.86 4.508-3.756 2.466.075 2.324 3.2z"/></svg><span class="visually-hidden">Vimeo</span>', 'hmco' ),
				'youtube' => __( '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/></svg><span class="visually-hidden">YouTube</span>', 'hmco' ),
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

	/*
	 * Options fields ids only need
	 * to be unique within this box.
	 * Prefix is not needed.
	 */

}
