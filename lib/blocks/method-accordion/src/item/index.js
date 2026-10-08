/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import { getAccordionElementId, getAccordionCollapseId } from '../../../utils/accordionId';

/**
 * Markup saved before 2.0.0-beta28, when a panel's id was `collapse{itemIndex}`
 * and so repeated whenever a page held more than one accordion. The attributes
 * are unchanged, so no migration is needed: content matching this save stays
 * valid in the editor and is re-saved in the current format on its next update.
 * Until then the PHP render (method-accordion.php) rewrites the panel's id.
 */
const v1 = {
    // A deprecation inherits nothing from the block. Without apiVersion the
    // generated `wp-block-*` class is added to this output and nothing matches.
    apiVersion: metadata.apiVersion,
    attributes: metadata.attributes,
    supports: metadata.supports,
    save: ({ attributes }) => {
        const { itemIndex, parentAccordionId, closed } = attributes;

        const innerBlocksProps = useInnerBlocksProps.save({
            className: `accordion-collapse collapse${itemIndex === 1 && !closed ? ' show' : ''}`,
            id: `collapse${itemIndex}`,
            'data-bs-parent': `#accordion-${parentAccordionId}`
        });

        return <div {...innerBlocksProps} />;
    },
};

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: ({ attributes }) => {
        const { itemIndex, parentAccordionId, closed } = attributes;

        const innerBlocksProps = useInnerBlocksProps.save({
            className: `accordion-collapse collapse${itemIndex === 1 && !closed ? ' show' : ''}`,
            id: getAccordionCollapseId(parentAccordionId, itemIndex),
            'data-bs-parent': `#${getAccordionElementId(parentAccordionId)}`
        });

        return <div {...innerBlocksProps} />;
    },
    deprecated: [v1],
});
