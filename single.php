<?php
	get_header();
	$layout = new MethodThemeLayout;
	echo $layout->build_page( $post->ID );
	get_footer();
