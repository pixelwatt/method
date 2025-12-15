import Edit from './edit';
import { useInnerBlocksProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<path d="M4 4h5v4H4V4zm6 0h5v4h-5V4zm6 0h4v4h-4V4zM4 10h16v10H4V10z" />
	</svg>
);

registerBlockType(metadata.name, {
	...metadata,
	icon,
	edit: Edit,
	save: () => {
		const innerBlocksProps = useInnerBlocksProps.save(
			{ className: 'tab-content' },
			{}
		);
		return <div {...innerBlocksProps} />;
	},
});
