/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M12.01,22.37c1.45,0,2.63,1.18,2.63,2.63s-1.18,2.63-2.63,2.63-2.63-1.18-2.63-2.63,1.18-2.63,2.63-2.63h0ZM12.01,18.37c-3.66,0-6.63,2.97-6.63,6.63s2.97,6.63,6.63,6.63,6.63-2.97,6.63-6.63-2.97-6.63-6.63-6.63h0ZM37.99,22.37c1.45,0,2.63,1.18,2.63,2.63s-1.18,2.63-2.63,2.63h-8.97c-1.45,0-2.63-1.18-2.63-2.63s1.18-2.63,2.63-2.63h8.97ZM37.99,18.37h-8.97c-3.66,0-6.63,2.97-6.63,6.63s2.97,6.63,6.63,6.63h8.97c3.66,0,6.63-2.97,6.63-6.63s-2.97-6.63-6.63-6.63h0Z" /></svg>
);

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: ({ attributes }) => {
        const innerBlocksProps = useInnerBlocksProps.save(
            { className: `method-flex-inner-blocks` },
            {}
        );
        return <div {...innerBlocksProps} />;
    },
});
