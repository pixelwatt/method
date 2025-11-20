/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 50 50"><path d="M35.23 16.23H14.77c-4.72 0-8.55 3.83-8.55 8.55v.44c0 4.72 3.83 8.55 8.55 8.55h20.47c4.72 0 8.55-3.83 8.55-8.55v-.44c0-4.72-3.83-8.55-8.55-8.55Zm4.55 8.99c0 2.51-2.04 4.55-4.55 4.55H14.77c-2.51 0-4.55-2.04-4.55-4.55v-.44c0-2.51 2.04-4.55 4.55-4.55h20.47c2.51 0 4.55 2.04 4.55 4.55v.44Zm-3-.44v.44c0 .85-.69 1.55-1.55 1.55H14.77c-.85 0-1.55-.69-1.55-1.55v-.44c0-.85.69-1.55 1.55-1.55h20.47c.85 0 1.55.69 1.55 1.55Z" /></svg>
);

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
});
