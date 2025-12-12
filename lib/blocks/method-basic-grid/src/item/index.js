/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: ({ attributes, setAttributes, clientId }) => {
        const innerBlocksProps = useInnerBlocksProps.save(
            { className: `method-inner-blocks` },
            {}
        );
        return <div {...innerBlocksProps} />;
    },
});
