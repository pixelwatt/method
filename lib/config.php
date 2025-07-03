<?php

//======================================================================
//
// CONFIG.PHP
//
// CUSTOMIZE ALL THE THINGS!!!
//
//======================================================================

//-----------------------------------------------------
// Create a constant for easily referencing the theme
// version number. To update the version number, edit
// the "Version" value in style.css
//-----------------------------------------------------

define( 'METHOD_VERSION', wp_get_theme()->get( 'Version' ) );

//-----------------------------------------------------
// The METHOD_OPTIONS constant can be used to customize
// several different parts of Method, including many og
// the blocks that are included with it.
//-----------------------------------------------------

define('METHOD_OPTIONS', array(
    'breakpoints' => array(
        'units' => 'px',
        'dimensions' => array(
            'xs' => 0,
            'sm' => 576,
            'md' => 768,
            'lg' => 992,
            'xl' => 1200,
            'xxl' => 1600,
        ),
        'mobile_max' => 'md',
        'tablet_min' => 'md',
        'tablet_max' => 'xl',
        'wide_min' => 'xxl',
    ),
    'blocks' => array(
        'method/accordion-item' => array(
            'arrow-svg' => '',
            'open-svg' => '',
            'close-svg' => '',
        ),
        'method/collapse' => array(
            'arrow-svg' => '',
            'open-svg' => '',
            'close-svg' => '',
        ),
    ),
));