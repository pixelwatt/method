<?php

//======================================================================
//
// FUNCTIONS.PHP
//
// File Overview:
//
// 1.  lib/config.php
//     Default theme config used if not set in child theme.
//
// 2.  lib/theme-setup.php
//     This file includes functions that setup theme features, custom
//     image sizes, required plugins, enqueued styles and scripts, and
//     navigation menu theme locations.
//
// 3.  lib/theme-options.php
//     This file is where theme options are declared.
//
// 4.  lib/blocks.php
//     This file is where custom block types are imported, block
//     categories are configured, and other things related to the
//     block editor happen.
//
// 5.  lib/class-method-utility.php
//     This file contains the Method_Utility php class, which
//     provides methods for easily interacting with and using
//     post meta and theme options.
//
// 6.  lib/class-method-bs-accordion.php
//     A php class for generating Bootstrap 5 accordions.
//
// 7.  lib/class-method-css-collector.php
//     A php class for collecting and minifying block CSS for each
//     page.
//
// 8.  lib/admin-customization.php
//     This file contains admin customizations and optimizations.
//
// 9.  lib/helper-functions.php
//     This file contains a number of useful functions to assist in
//     a variety of tasks.
//
//======================================================================

//======================================================================
// THEME SETUP
//======================================================================

//-----------------------------------------------------
// Import a custom navwalker for Bootstrap 5
//-----------------------------------------------------

require_once get_template_directory() . '/inc/bootstrap-5-navwalker/class-bootstrap_5_wp_nav_menu_walker.php';

//-----------------------------------------------------
// Import theme files.
//-----------------------------------------------------

require_once('lib/config.php');
require_once('lib/theme-setup.php');
require_once('lib/theme-options.php');
require_once('lib/blocks.php');
require_once('lib/class-method-utility.php');
require_once('lib/class-method-bs-accordion.php');
require_once('lib/class-method-css-collector.php');
require_once('lib/admin-customization.php');
require_once('lib/helper-functions.php');
