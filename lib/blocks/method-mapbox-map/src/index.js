/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import icon from './icon';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
});
