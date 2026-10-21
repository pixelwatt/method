/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M35.37,14.4c2.58,0,4.69,2.1,4.69,4.69v11.83c0,2.58-2.1,4.69-4.69,4.69H14.63c-2.58,0-4.69-2.1-4.69-4.69v-11.83c0-2.58,2.1-4.69,4.69-4.69h20.74ZM35.37,10.4H14.63c-4.8,0-8.69,3.89-8.69,8.69v11.83c0,4.8,3.89,8.69,8.69,8.69h20.74c4.8,0,8.69-3.89,8.69-8.69v-11.83c0-4.8-3.89-8.69-8.69-8.69h0ZM36.65,21.47c0-.55-.45-1-1-1H14.35c-.55,0-1,.45-1,1s.45,1,1,1h21.29c.55,0,1-.45,1-1ZM36.65,28.53c0-.55-.45-1-1-1H14.35c-.55,0-1,.45-1,1s.45,1,1,1h21.29c.55,0,1-.45,1-1Z" /></svg>
);

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
});