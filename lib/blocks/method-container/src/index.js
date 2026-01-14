/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M8.5,15.5h-4c0-5.57,4.53-10.11,10.11-10.11v4c-3.37,0-6.11,2.74-6.11,6.11ZM41.5,15.5h4c0-5.57-4.53-10.11-10.11-10.11v4c3.37,0,6.11,2.74,6.11,6.11ZM35.39,42.39v4c5.57,0,10.11-4.53,10.11-10.11h-4c0,3.37-2.74,6.11-6.11,6.11ZM8.5,36.28h-4c0,5.57,4.53,10.11,10.11,10.11v-4c-3.37,0-6.11-2.74-6.11-6.11ZM16.87,20.92h16.26c1.31,0,2.37-1.06,2.37-2.37s-1.06-2.37-2.37-2.37h-16.26c-1.31,0-2.37,1.06-2.37,2.37,0,1.31,1.06,2.37,2.37,2.37ZM33.13,22.63h-16.26c-1.31,0-2.37,1.06-2.37,2.37h0c0,1.31,1.06,2.37,2.37,2.37h16.26c1.31,0,2.37-1.06,2.37-2.37h0c0-1.31-1.06-2.37-2.37-2.37ZM33.13,29.08h-16.26c-1.31,0-2.37,1.06-2.37,2.37,0,1.31,1.06,2.37,2.37,2.37h16.26c1.31,0,2.37-1.06,2.37-2.37s-1.06-2.37-2.37-2.37Z" /></svg>
);

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: ({ attributes }) => {
        const innerBlocksProps = useInnerBlocksProps.save(
            { className: 'method-container-inner-blocks' },
            {}
        );
        return <div {...innerBlocksProps} />;
    },
});
