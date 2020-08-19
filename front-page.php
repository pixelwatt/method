<?php
	get_header();
	$layout = new SunriseLayout;
	echo $layout->build_page( $post->ID );
	get_footer();
