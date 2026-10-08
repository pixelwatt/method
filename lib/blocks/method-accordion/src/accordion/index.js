/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import { getAccordionElementId } from '../../../utils/accordionId';

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: ({ attributes }) => {
        const { accordionId } = attributes;
        const innerBlocksProps = useInnerBlocksProps.save(
            { className: 'accordion', id: getAccordionElementId(accordionId) },
            {}
        );
        return <div {...innerBlocksProps} />;
    },
});