<?php
	get_header();
	$layout = new sunriseLayout;
	echo $layout->build_page( $post->ID );
	get_footer();
