<?php get_header();

	get_header();
	$layout = new spitfire_layout;
	echo $layout->build_page( $post->ID );
	get_footer();

get_footer();