<?php
	get_header();
	$layout = new SunriseLayout;
	echo $layout->build_page( '', true );
	get_footer();
