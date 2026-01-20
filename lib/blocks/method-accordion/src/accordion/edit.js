/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    store as blockEditorStore
} from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

export default function Edit({ attributes, setAttributes, clientId }) {
    const { accordionId } = attributes;

    const isDuplicate = useSelect(
        (select) => {
            if (!accordionId) return false;

            const { getBlocksByName, getBlockAttributes } = select(blockEditorStore);
            const allAccordions = getBlocksByName('method/accordion');

            // Check if another block has the same accordionId
            return allAccordions.some((blockClientId) => {
                if (blockClientId === clientId) return false;
                const attrs = getBlockAttributes(blockClientId);
                return attrs.accordionId === accordionId;
            });
        },
        [accordionId, clientId]
    );

    useEffect(() => {
        if (!accordionId || isDuplicate) {
            setAttributes({ accordionId: clientId });
        }
    }, [isDuplicate]);

    const ALLOWED_BLOCKS = ['method/accordion-item'];
    const blockProps = useBlockProps({ className: 'method-accordion' }, {});
    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'accordion',
            id: `accordion-${accordionId || clientId}`
        },
        { allowedBlocks: ALLOWED_BLOCKS, }
    );

    return (
        <div {...blockProps}>
            <div {...innerBlocksProps} />
        </div>
    );
}