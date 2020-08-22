<?php
	get_header();
	$layout = new MethodLayout;
	echo $layout->build_page( '', true );
	get_footer();
