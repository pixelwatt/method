<?php
	get_header();
	$layout = new MethodThemeLayout;
	echo $layout->build_page( '', true );
	get_footer();
