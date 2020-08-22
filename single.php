<?php
	get_header();
	$layout = new MethodLayout;
	echo $layout->build_page( $post->ID );
	get_footer();
