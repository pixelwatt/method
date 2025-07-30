/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
        <path d="M13.77,6.22c-4.84,0-8.77,3.92-8.77,8.77v20.03c0,4.84,3.92,8.77,8.77,8.77s8.77-3.92,8.77-8.77V14.98c0-4.84-3.92-8.77-8.77-8.77ZM18.53,35.02c0,2.63-2.14,4.77-4.77,4.77s-4.77-2.14-4.77-4.77V14.98c0-2.63,2.14-4.77,4.77-4.77s4.77,2.14,4.77,4.77v20.03ZM45,14.98v20.03c0,4.84-3.92,8.77-8.77,8.77s-8.77-3.92-8.77-8.77V14.98c0-4.84,3.92-8.77,8.77-8.77s8.77,3.92,8.77,8.77Z" />
    </svg>
);

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: ({ attributes }) => {
        let colClasses = '';
        if (attributes.responsiveSettings.mobile.enabled) {
            colClasses = `col-${attributes.responsiveSettings.mobile.gridCols} col-xl-${attributes.responsiveSettings.base.gridCols}`;
        } else {
            colClasses = `col-${attributes.responsiveSettings.base.gridCols} col-xl-${attributes.responsiveSettings.base.gridCols}`;
        }
        if (attributes.responsiveSettings.tablet.enabled) {
            colClasses += ` col-md-${attributes.responsiveSettings.tablet.gridCols}`;
        }
        if (attributes.responsiveSettings.wide.enabled) {
            colClasses += ` col-xxl-${attributes.responsiveSettings.wide.gridCols}`;
        }
        const blockProps = useBlockProps.save(
            { className: `${colClasses}` },
            {}
        );
        const innerBlocksProps = useInnerBlocksProps.save(
            { className: 'method-advanced-grid-col-content' },
            {}
        );
        return <div {...innerBlocksProps} />;
    },
});
