/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps.save(
            { className: 'method-grid-item-component' },
            {}
        );
        const innerBlocksProps = useInnerBlocksProps.save(
            { className: `method-inner-blocks` },
            {}
        );
        return <div {...blockProps}><div {...innerBlocksProps} /></div>;
    },
});
