/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    RichText,
    store as blockEditorStore
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes, clientId }) {
    const { blockIndex, parentAccordionId } = useSelect(
        (select) => {
            const { getBlockRootClientId, getBlockIndex, getBlockAttributes } = select(blockEditorStore);
            const parentId = getBlockRootClientId(clientId);
            const parentAttrs = parentId ? getBlockAttributes(parentId) : {};

            return {
                blockIndex: getBlockIndex(clientId),
                parentAccordionId: parentAttrs.accordionId,
            };
        },
        [clientId]
    );
    const blockNumber = blockIndex + 1;
    useEffect(() => {
        const updates = {};
        if (attributes.itemIndex !== blockNumber) {
            updates.itemIndex = blockNumber;
        }
        if (attributes.parentAccordionId !== parentAccordionId) {
            updates.parentAccordionId = parentAccordionId;
        }
        if (Object.keys(updates).length > 0) {
            setAttributes(updates);
        }
    }, [blockNumber, parentAccordionId]);

    const blockProps = useBlockProps({ className: 'accordion-item' }, {});
    const innerBlocksProps = useInnerBlocksProps(
        {
            className: `accordion-collapse collapse${blockNumber === 1 ? ' show' : ''}`,
            id: `collapse${blockNumber}`,
            'data-bs-parent': `#accordion-${parentAccordionId}`
        },
        {
            template: [['method/accordion-body', {}]],
            templateLock: 'all',
            renderAppender: false,
        }
    );

    return (
        <div {...blockProps}>
            <h2 className='accordion-header'>
                <button
                    className={`accordion-button${blockNumber === 1 ? '' : ' collapse'}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${blockNumber}`}
                    aria-expanded={`${blockNumber === 1 ? 'true' : 'false'}`}
                    aria-controls={`collapse${blockNumber}`}
                >
                    <RichText
                        tagName="span"
                        className={`accordion-button-headline`}
                        value={attributes.headline}
                        onChange={(value) => setAttributes({ headline: value })}
                        placeholder="Add a headline..."
                        allowedFormats={[
                            'core/bold',
                            'core/italic',
                        ]}
                    />
                </button>
            </h2>
            <div {...innerBlocksProps} />
        </div>
    );
}