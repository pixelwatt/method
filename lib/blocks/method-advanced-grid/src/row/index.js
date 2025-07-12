import Edit from './edit';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps.save( { className: 'method-advanced-grid-row-wrap' }, {} );
		const innerBlocksProps = useInnerBlocksProps.save( { className: 'row method-advanced-grid-row' }, {} );
		return (
            <div {...innerBlocksProps} />
		);
	},
});