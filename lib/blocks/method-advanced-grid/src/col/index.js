import Edit from './edit';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save: ({attributes}) => {
        let colClasses = '';
        if ( attributes.responsiveSettings.mobile.enabled ) {
            colClasses = `col-${attributes.responsiveSettings.mobile.gridCols} col-xl-${attributes.responsiveSettings.base.gridCols}`;
        } else {
            colClasses = `col-${attributes.responsiveSettings.base.gridCols} col-xl-${attributes.responsiveSettings.base.gridCols}`;
        }
        if ( attributes.responsiveSettings.tablet.enabled ) {
            colClasses += ` col-md-${attributes.responsiveSettings.tablet.gridCols}`;
        }
        if ( attributes.responsiveSettings.wide.enabled ) {
            colClasses += ` col-xxl-${attributes.responsiveSettings.wide.gridCols}`;
        }
        const blockProps = useBlockProps.save( { className: `${colClasses}` }, {} );
		const innerBlocksProps = useInnerBlocksProps.save( { className: 'method-advanced-grid-col-content' }, {} );
		return (
            <div {...innerBlocksProps} />
		);
	},
});