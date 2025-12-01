/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
        <path d="M13.77,22.53c4.84,0,8.77-3.92,8.77-8.77s-3.92-8.77-8.77-8.77-8.77,3.92-8.77,8.77,3.92,8.77,8.77,8.77ZM13.77,9c2.63,0,4.77,2.14,4.77,4.77s-2.14,4.77-4.77,4.77-4.77-2.14-4.77-4.77,2.14-4.77,4.77-4.77ZM27.47,13.77c0-4.84,3.92-8.77,8.77-8.77s8.77,3.92,8.77,8.77-3.92,8.77-8.77,8.77-8.77-3.92-8.77-8.77ZM45,36.23h0c0,4.84-3.92,8.77-8.77,8.77s-8.77-3.92-8.77-8.77h0c0-4.84,3.92-8.77,8.77-8.77s8.77,3.92,8.77,8.77ZM22.53,36.23h0c0,4.84-3.92,8.77-8.77,8.77s-8.77-3.92-8.77-8.77h0c0-4.84,3.92-8.77,8.77-8.77s8.77,3.92,8.77,8.77Z" />
    </svg>
);

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: ({ attributes, setAttributes }) => {
        let mobileOuterClass = '';
        let mobileAlignClass = '';
        let mobileJustifyClass = '';

        let tabletOuterClass = '';
        let tabletAlignClass = '';
        let tabletJustifyClass = '';

        let wideOuterClass = '';
        let wideAlignClass = '';
        let wideJustifyClass = '';

        let baseOuterClass = attributes.responsiveSettings?.base?.gridCols ? ` method-layout-${attributes.responsiveSettings?.base?.gridCols}` : '';
        let baseAlignClass = attributes.responsiveSettings?.base?.alignItems ? ` method-align-${attributes.responsiveSettings?.base?.alignItems}` : '';
        let baseJustifyClass = attributes.responsiveSettings?.base?.justifyContent ? ` method-justify-${attributes.responsiveSettings?.base?.justifyContent}` : '';

        if (attributes.responsiveSettings?.mobile?.enabled === true) {
            mobileOuterClass = attributes.responsiveSettings?.mobile?.gridCols ? ` method-layout-mobile-${attributes.responsiveSettings?.mobile?.gridCols}` : '';
            mobileAlignClass = attributes.responsiveSettings?.mobile?.alignItems ? ` method-mobile-align-${attributes.responsiveSettings?.mobile?.alignItems}` : '';
            mobileJustifyClass = attributes.responsiveSettings?.mobile?.justifyContent ? ` method-mobile-justify-${attributes.responsiveSettings?.mobile?.justifyContent}` : '';
        }
        if (attributes.responsiveSettings?.tablet?.enabled === true) {
            tabletOuterClass = attributes.responsiveSettings?.tablet?.gridCols ? ` method-layout-tablet-${attributes.responsiveSettings?.tablet?.gridCols}` : '';
            tabletAlignClass = attributes.responsiveSettings?.tablet?.alignItems ? ` method-tablet-align-${attributes.responsiveSettings?.tablet?.alignItems}` : '';
            tabletJustifyClass = attributes.responsiveSettings?.tablet?.justifyContent ? ` method-tablet-justify-${attributes.responsiveSettings?.tablet?.justifyContent}` : '';
        }
        if (attributes.responsiveSettings?.wide?.enabled === true) {
            wideOuterClass = attributes.responsiveSettings?.wide?.gridCols ? ` method-layout-wide-${attributes.responsiveSettings?.wide?.gridCols}` : '';
            wideAlignClass = attributes.responsiveSettings?.wide?.alignItems ? ` method-wide-align-${attributes.responsiveSettings?.wide?.alignItems}` : '';
            wideJustifyClass = attributes.responsiveSettings?.wide?.justifyContent ? ` method-wide-justify-${attributes.responsiveSettings?.wide?.justifyContent}` : '';
        }

        const blockProps = useBlockProps.save(
            { className: `method-basic-grid${baseOuterClass}${mobileOuterClass}${tabletOuterClass}${wideOuterClass}${baseAlignClass}${mobileAlignClass}${tabletAlignClass}${wideAlignClass}${baseJustifyClass}${mobileJustifyClass}${tabletJustifyClass}${wideJustifyClass}` },
            {}
        );
        const innerBlocksProps = useInnerBlocksProps.save(
            { className: `method-inner-blocks` },
            {}
        );
        return <div {...blockProps}><div {...innerBlocksProps} /></div>;
    },
});
