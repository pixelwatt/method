import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './editor';

const icon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M38.18,13.88h-19.28c-1.38,0-2.5,1.12-2.5,2.5s1.12,2.5,2.5,2.5h19.28c1.38,0,2.5-1.12,2.5-2.5s-1.12-2.5-2.5-2.5Z" /><circle cx="11.82" cy="16.38" r="2.5" /><rect x="22.58" y="32.12" width="18.1" height="4" rx="2" ry="2" /><rect x="16.43" y="32.12" width="4" height="4" rx="2" ry="2" /><rect x="22.58" y="23.75" width="18.1" height="4" rx="2" ry="2" /><rect x="16.43" y="23.75" width="4" height="4" rx="2" ry="2" /></svg>
);

registerBlockType(metadata.name, {
	...metadata,
	icon,
	edit: Edit,
});
