/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
		<path d="M13.77,22.53c4.84,0,8.77-3.92,8.77-8.77s-3.92-8.77-8.77-8.77-8.77,3.92-8.77,8.77,3.92,8.77,8.77,8.77ZM13.77,9c2.63,0,4.77,2.14,4.77,4.77s-2.14,4.77-4.77,4.77-4.77-2.14-4.77-4.77,2.14-4.77,4.77-4.77ZM27.47,13.77c0-4.84,3.92-8.77,8.77-8.77s8.77,3.92,8.77,8.77-3.92,8.77-8.77,8.77-8.77-3.92-8.77-8.77ZM45,36.23h0c0,4.84-3.92,8.77-8.77,8.77s-8.77-3.92-8.77-8.77h0c0-4.84,3.92-8.77,8.77-8.77s8.77,3.92,8.77,8.77ZM22.53,36.23h0c0,4.84-3.92,8.77-8.77,8.77s-8.77-3.92-8.77-8.77h0c0-4.84,3.92-8.77,8.77-8.77s8.77,3.92,8.77,8.77Z" />
	</svg>
);

registerBlockType(metadata.name, {
	...metadata,
	icon,
	edit: Edit,
	save: () => {
		const blockProps = useBlockProps.save(
			{ className: 'method-advanced-grid' },
			{}
		);
		const innerBlocksProps = useInnerBlocksProps.save(
			{ className: 'method-advanced-grid-rows' },
			{}
		);
		return <div {...innerBlocksProps} />;
	},
});
