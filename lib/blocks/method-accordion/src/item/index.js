/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useInnerBlocksProps, store as blockEditorStore } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import { useSelect } from '@wordpress/data';

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: ({ attributes }) => {
        const { itemIndex, parentAccordionId, closed } = attributes;

        const innerBlocksProps = useInnerBlocksProps.save({
            className: `accordion-collapse collapse${itemIndex === 1 && !closed ? ' show' : ''}`,
            id: `collapse${itemIndex}`,
            'data-bs-parent': `#accordion-${parentAccordionId}`
        });

        return <div {...innerBlocksProps} />;
    },
});