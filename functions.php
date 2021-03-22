<?php

//======================================================================
//
// FUNCTIONS.PHP
//
// Required Files:
//
// 1.  lib/class-method-layout.php
//     The Method_Layout class, which contains the foundation for your
//     theme layout class. This file should not be edited so that class
//     updates can easily be applied.
//
// 2.  lib/class-theme-layout.php
//     This is your theme's layout class, which extends the Method_Layout
//     class. All your frontend code goes into this file.
//
// 3.  lib/theme-setup.php
//     This file includes functions that setup theme features, custom
//     image sizes, required plugins, enqueued styles and scripts, and
//     navigation menu theme locations.
//
// 4.  lib/admin-customization.php
//     This file contains admin customizations and optimizations.
//
// 5.  lib/theme-customization.php
//     This file is where theme options are declared.
//
// 6.  lib/post-types-and-taxonomies.php
//     This file is where custom post types and taxonomies are declared.
//
// 7.  lib/helper-functions.php
//     This file contains a number of useful functions to assist in
//     a variety of tasks.
//
// 8.  lib/cmb2-helper-functions.php
//     Helper functions for CMB2.
//
// 9.  lib/cmb2-options-loader.php
//     This is where you set up options for CMB2 metaboxes.
//
// 10. lib/cmb2-metaboxes.php
//     This is where you declare CMB2 metaboxes and specify which
//     of the options each box loads.
//
//======================================================================


//======================================================================
// THEME SETUP
//======================================================================

//-----------------------------------------------------
// Import a custom navwalker for Bootstrap 4
//-----------------------------------------------------

require_once get_template_directory() . '/inc/wp-bootstrap-navwalker/class-wp-bootstrap-navwalker.php';

//-----------------------------------------------------
// Import theme files.
//-----------------------------------------------------

require_once('lib/class-method-layout.php');
require_once('lib/class-theme-layout.php');
require_once('lib/theme-setup.php');
require_once('lib/admin-customization.php');
require_once('lib/theme-customization.php');
require_once('lib/post-types-and-taxonomies.php');
require_once('lib/helper-functions.php');
require_once('lib/cmb2-helper-functions.php');
require_once('lib/cmb2-options-loader.php');
require_once('lib/cmb2-metaboxes.php');
