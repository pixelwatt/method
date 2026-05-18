/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useBlockProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M4.5,15.58h4c0-3.37,2.74-6.11,6.11-6.11v-4c-5.57,0-10.11,4.53-10.11,10.11Z" /><path d="M41.5,15.58h4c0-5.57-4.53-10.11-10.11-10.11v4c3.37,0,6.11,2.74,6.11,6.11Z" /><path d="M35.39,42.48v4c5.57,0,10.11-4.53,10.11-10.11h-4c0,3.37-2.74,6.11-6.11,6.11Z" /><path d="M8.5,36.37h-4c0,5.57,4.53,10.11,10.11,10.11v-4c-3.37,0-6.11-2.74-6.11-6.11Z" /><path d="M21.96,35.09c-.47,0-.92-.11-1.33-.33-1.06-.55-1.66-1.71-1.66-3.17v-11.07c0-1.46.61-2.61,1.66-3.17,1.05-.55,2.35-.39,3.55.44l7.39,5.12c1.12.78,1.77,1.93,1.77,3.15s-.65,2.37-1.77,3.15l-7.39,5.12c-.73.5-1.49.76-2.22.76ZM22.46,20.87v10.39l7.11-4.93c.2-.14.26-.25.26-.28,0-.01-.07-.13-.26-.26l-7.11-4.92Z" /></svg>
);

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
});