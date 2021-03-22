<?php

//======================================================================
// CUSTOM POST TYPES
//======================================================================


/*

add_action( 'init', 'method_news_init' );

function method_news_init() {
	$labels = array(
		'name'               => _x( 'News', 'post type general name', 'method' ),
		'singular_name'      => _x( 'News Item', 'post type singular name', 'method' ),
		'menu_name'          => _x( 'News', 'admin menu', 'method' ),
		'name_admin_bar'     => _x( 'News Item', 'add new on admin bar', 'method' ),
		'add_new'            => _x( 'Add News Item', 'job', 'method' ),
		'add_new_item'       => __( 'Add New News Item', 'method' ),
		'new_item'           => __( 'New News Item', 'method' ),
		'edit_item'          => __( 'Edit News Item', 'method' ),
		'view_item'          => __( 'View News Item', 'method' ),
		'all_items'          => __( 'News', 'method' ),
		'search_items'       => __( 'Search News', 'method' ),
		'parent_item_colon'  => __( 'Parent News:', 'method' ),
		'not_found'          => __( 'No news found.', 'method' ),
		'not_found_in_trash' => __( 'No news found in Trash.', 'method' )
	);

	$args = array(
		'labels'             => $labels,
		'description'        => __( 'A description for the post type.', 'method' ),
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'query_var'          => true,
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position' 	 => 5,
		'menu_icon'			 => 'dashicons-megaphone',
		'supports'           => array( 'title' , 'editor' )
	);

	register_post_type( 'news', $args );
}

*/


//======================================================================
// CUSTOM TAXONOMIES
//======================================================================


// Declare custom taxonomies here.

/*
add_action( 'init', 'method_register_mytax', 0 );

function method_register_mytax() {
	// Add new taxonomy, make it hierarchical (like categories)
	$labels = array(
		'name' => _x( 'My Tax Terms', 'taxonomy general name' ),
		'singular_name' => _x( 'My Tax Term', 'taxonomy singular name' ),
		'search_items' =>  __( 'Search My Tax Terms' ),
		'all_items' => __( 'All My Tax Terms' ),
		'parent_item' => __( 'Parent My Tax Term' ),
		'parent_item_colon' => __( 'Parent My Tax Term:' ),
		'edit_item' => __( 'Edit My Tax Term' ),
		'update_item' => __( 'Update My Tax Term' ),
		'add_new_item' => __( 'Add New My Tax Term' ),
		'new_item_name' => __( 'New My Tax Term Name' ),
		'menu_name' => __( 'My Tax Term' ),
	);

	register_taxonomy('mytax',array('myposttype'), array(
		'hierarchical' => true,
		'labels' => $labels,
		'show_ui' => true,
		'query_var' => true,
		'rewrite' => array( 'slug' => 'mytax' ),
		'show_admin_column' => true
	));
}
*/
