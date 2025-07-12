import Edit from './edit';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save: () => {
        const blockProps = useBlockProps.save( { className: 'method-advanced-grid' }, {} );
		const innerBlocksProps = useInnerBlocksProps.save( { className: 'method-advanced-grid-rows' }, {} );
		return (
            <div {...innerBlocksProps} />
		);
	},
});