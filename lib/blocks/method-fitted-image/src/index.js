/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useBlockProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M8.5,15.5h-4c0-5.57,4.53-10.11,10.11-10.11v4c-3.37,0-6.11,2.74-6.11,6.11ZM41.5,15.5h4c0-5.57-4.53-10.11-10.11-10.11v4c3.37,0,6.11,2.74,6.11,6.11ZM35.39,42.39v4c5.57,0,10.11-4.53,10.11-10.11h-4c0,3.37-2.74,6.11-6.11,6.11ZM8.5,36.28h-4c0,5.57,4.53,10.11,10.11,10.11v-4c-3.37,0-6.11-2.74-6.11-6.11ZM37.39,38.81c.81-.52,1.05-1.6.53-2.42l-5.72-8.97c-.32-.5-.88-.81-1.48-.81s-1.15.3-1.48.81l-1.83,2.87-4.18-6.55c-.32-.5-.88-.81-1.48-.81s-1.15.3-1.48.81l-8.07,12.65c-.52.81-.28,1.9.53,2.42.82.52,1.9.28,2.42-.53l6.59-10.33,6.6,10.33c.33.52.9.81,1.48.81.32,0,.65-.09.94-.27.81-.52,1.05-1.6.53-2.42l-1.82-2.85,1.23-1.93,4.25,6.66c.33.52.9.81,1.48.81.32,0,.65-.09.94-.27ZM29.15,17.73c0-2.48,2.02-4.5,4.5-4.5s4.5,2.02,4.5,4.5-2.02,4.5-4.5,4.5-4.5-2.02-4.5-4.5ZM32.15,17.73c0,.83.67,1.5,1.5,1.5s1.5-.67,1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5,1.5Z" /></svg>
);

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save(
            { className: 'method-block-fitted-image' },
            {}
        );
        return;
    },
});