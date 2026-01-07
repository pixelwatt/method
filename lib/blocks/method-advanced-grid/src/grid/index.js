/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M13.83,5c-4.84,0-8.77,3.92-8.77,8.77v22.47c0,4.84,3.92,8.77,8.77,8.77s8.77-3.92,8.77-8.77V13.77c0-4.84-3.92-8.77-8.77-8.77ZM18.6,36.23c0,2.63-2.14,4.77-4.77,4.77s-4.77-2.14-4.77-4.77V13.77c0-2.63,2.14-4.77,4.77-4.77s4.77,2.14,4.77,4.77v22.47ZM45.07,13.77h0c0,4.84-3.92,8.77-8.77,8.77s-8.77-3.92-8.77-8.77,3.92-8.77,8.77-8.77,8.77,3.92,8.77,8.77ZM45.07,36.23c0,4.84-3.92,8.77-8.77,8.77s-8.77-3.92-8.77-8.77,3.92-8.77,8.77-8.77,8.77,3.92,8.77,8.77Z" /></svg>
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
