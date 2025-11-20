/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
		<path d="M14.77,22.53h20.47c4.72,0,8.55-3.83,8.55-8.55v-.44c0-4.72-3.83-8.55-8.55-8.55H14.77c-4.72,0-8.55,3.83-8.55,8.55v.44c0,4.72,3.83,8.55,8.55,8.55ZM10.22,13.55c0-2.51,2.04-4.55,4.55-4.55h20.47c2.51,0,4.55,2.04,4.55,4.55v.44c0,2.51-2.04,4.55-4.55,4.55H14.77c-2.51,0-4.55-2.04-4.55-4.55v-.44ZM43.78,36.01v.44c0,4.72-3.83,8.55-8.55,8.55H14.77c-4.72,0-8.55-3.83-8.55-8.55v-.44c0-4.72,3.83-8.55,8.55-8.55h20.47c4.72,0,8.55,3.83,8.55,8.55Z" />
	</svg>
);

registerBlockType(metadata.name, {
	...metadata,
	icon,
	edit: Edit,
	save: ({ attributes, setAttributes }) => {
		const blockProps = useBlockProps.save(
			{ className: 'method-advanced-grid-row-wrap' },
			{}
		);
		const innerBlocksProps = useInnerBlocksProps.save(
			{ className: `row method-advanced-grid-row align-items-${attributes.responsiveSettings.base.alignItems} justify-content-${attributes.responsiveSettings.base.justifyContent}` },
			{}
		);
		return <div {...innerBlocksProps} />;
	},
});
