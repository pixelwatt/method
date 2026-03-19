import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './editor';

registerBlockType( metadata.name, {
	...metadata,
	edit: Edit,
} );
