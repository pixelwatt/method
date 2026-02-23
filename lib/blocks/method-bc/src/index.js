/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useBlockProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M10.01,18.37c-3.66,0-6.63,2.97-6.63,6.63s2.97,6.63,6.63,6.63,6.63-2.97,6.63-6.63-2.97-6.63-6.63-6.63ZM10.01,27.63c-1.45,0-2.63-1.18-2.63-2.63s1.18-2.63,2.63-2.63,2.63,1.18,2.63,2.63-1.18,2.63-2.63,2.63ZM39.78,18.37c-3.66,0-6.63,2.97-6.63,6.63s2.97,6.63,6.63,6.63,6.63-2.97,6.63-6.63-2.97-6.63-6.63-6.63ZM39.78,27.63c-1.45,0-2.63-1.18-2.63-2.63s1.18-2.63,2.63-2.63,2.63,1.18,2.63,2.63-1.18,2.63-2.63,2.63ZM23.17,18.07l6.93,6.93-6.93,6.93-2.83-2.83,4.1-4.1-4.1-4.1,2.83-2.83Z" /></svg>
);

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
});