<?php

//======================================================================
// CMB2 OPTIONS LOADER
//======================================================================

function method_load_cmb2_options( &$obj, $temps ) {
	foreach ( $temps as $temp ) {
		$prefix = str_replace( '-', '_', $temp );
		switch ( $temp ) {
			case 'example':
				$obj->add_field(
					array(
						'name'     => __( '<span style="font-size: 1.5rem; font-weight: 900;">Example Section</span>', 'method' ),
						'id'   => '_method_example_info',
						'type'     => 'title',
					)
				);
				$obj->add_field(
					array(
						'name'     => __( 'Headline', 'method' ),
						'desc'     => __( method_get_tags_badge() . 'Provide a headline for this item.', 'method' ),
						'id'   => '_method_example_headline',
						'type'     => 'text',
					)
				);
				break;
			default:
				break;
		}
	}
	return;
}
