/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M33.21,19.96c0,1.02-.83,1.85-1.85,1.85h-12.71c-1.02,0-1.85-.83-1.85-1.85s.83-1.85,1.85-1.85h12.71c1.02,0,1.85.83,1.85,1.85ZM31.36,23.15h-12.71c-1.02,0-1.85.83-1.85,1.85s.83,1.85,1.85,1.85h12.71c1.02,0,1.85-.83,1.85-1.85h0c0-1.02-.83-1.85-1.85-1.85ZM31.36,28.19h-12.71c-1.02,0-1.85.83-1.85,1.85s.83,1.85,1.85,1.85h12.71c1.02,0,1.85-.83,1.85-1.85s-.83-1.85-1.85-1.85ZM38.83,19.07v11.86c0,4.36-3.54,7.9-7.9,7.9h-11.86c-4.36,0-7.9-3.54-7.9-7.9v-11.86c0-4.36,3.54-7.9,7.9-7.9h11.86c4.36,0,7.9,3.54,7.9,7.9ZM35.7,19.07c0-2.63-2.14-4.77-4.77-4.77h-11.86c-2.63,0-4.77,2.14-4.77,4.77v11.86c0,2.63,2.14,4.77,4.77,4.77h0s11.86-.01,11.86-.01h0c2.63.01,4.77-2.13,4.77-4.76v-11.86Z" /></svg>
);

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: ({ attributes }) => {
        const innerBlocksProps = useInnerBlocksProps.save({ className: 'method-swiper-slide-inner' }, {});
        return (<div {...innerBlocksProps} />);
    },
});