/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import { getAccordionElementId, getAccordionCollapseId } from '../../../utils/accordionId';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M35.14,20.03c2.74,0,4.97,2.23,4.97,4.97s-2.23,4.97-4.97,4.97H14.86c-2.74,0-4.97-2.23-4.97-4.97s2.23-4.97,4.97-4.97h20.28ZM35.14,17.03H14.86c-4.4,0-7.97,3.57-7.97,7.97s3.57,7.97,7.97,7.97h20.28c4.4,0,7.97-3.57,7.97-7.97s-3.57-7.97-7.97-7.97h0ZM35,24.29c.39,0,.71.32.71.71s-.32.71-.71.71-.71-.32-.71-.71.32-.71.71-.71h0ZM35,22.29c-1.49,0-2.71,1.21-2.71,2.71s1.21,2.71,2.71,2.71,2.71-1.21,2.71-2.71-1.21-2.71-2.71-2.71h0ZM27.27,22.99h-12.63c-1.1,0-2,.9-2,2h0c0,1.1.9,2,2,2h12.63c1.1,0,2-.9,2-2h0c0-1.1-.9-2-2-2Z" /></svg>
);

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
    icon,
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
