<?php

//======================================================================
//
// FUNCTIONS.PHP
//
// File Overview:
//
// 1.  lib/theme-setup.php
//     This file includes functions that setup theme features, custom
//     image sizes, required plugins, enqueued styles and scripts, and
//     navigation menu theme locations.
//
// 2.  lib/theme-options.php
//     This file is where theme options are declared.
//
// 3.  lib/blocks.php
//     This file is where custom block types are imported, block
//     categories are configured, and other things related to the
//     block editor happen.
//
// 4.  lib/class-method-utility.php
//     This file contains the Method_Utility php class, which
//     provides methods for easily interacting with and using
//     post meta and theme options.
//
// 5.  lib/class-method-bs-accordion.php
//     A php class for generating Bootstrap 5 accordions.
//
// 6.  lib/admin-customization.php
//     This file contains admin customizations and optimizations.
//
// 7.  lib/post-types-and-taxonomies.php
//     This file is where custom post types and taxonomies are declared.
//
// 8.  lib/helper-functions.php
//     This file contains a number of useful functions to assist in
//     a variety of tasks.
//
// 9.  lib/cmb2-helper-functions.php
//     Helper functions for CMB2.
//
// 10. lib/cmb2-options-loader.php
//     This is where you set up options for CMB2 metaboxes.
//
// 11. lib/cmb2-metaboxes.php
//     This is where you declare CMB2 metaboxes and specify which
//     of the options each box loads.
//
//======================================================================

//======================================================================
// THEME SETUP
//======================================================================

//-----------------------------------------------------
// Create a constant for easily referencing the theme
// version number. To update the version number, edit
// the "Version" value in style.css
//-----------------------------------------------------

define( 'METHOD_VERSION', wp_get_theme()->get( 'Version' ) );

//-----------------------------------------------------
// Import a custom navwalker for Bootstrap 5
//-----------------------------------------------------

require_once get_template_directory() . '/inc/bootstrap-5-navwalker/class-bootstrap_5_wp_nav_menu_walker.php';

//-----------------------------------------------------
// Import theme files.
//-----------------------------------------------------

require_once('lib/theme-setup.php');
require_once('lib/theme-options.php');
require_once('lib/blocks.php');
require_once('lib/class-method-utility.php');
require_once('lib/class-method-bs-accordion.php');
require_once('lib/admin-customization.php');
require_once('lib/post-types-and-taxonomies.php');
require_once('lib/helper-functions.php');
require_once('lib/cmb2-helper-functions.php');
require_once('lib/cmb2-options-loader.php');
require_once('lib/cmb2-metaboxes.php');
