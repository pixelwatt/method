/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    RichText,
    store as blockEditorStore
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    TextControl
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes, clientId }) {
    const { updateBlockAttributes } = useDispatch(blockEditorStore);

    const { blockIndex, parentAccordionId, parentClientId, openItem } = useSelect(
        (select) => {
            const { getBlockRootClientId, getBlockIndex, getBlockAttributes } = select(blockEditorStore);
            const parentId = getBlockRootClientId(clientId);
            const parentAttrs = parentId ? getBlockAttributes(parentId) : {};

            return {
                blockIndex: getBlockIndex(clientId),
                parentAccordionId: parentAttrs.accordionId,
                parentClientId: parentId,
                openItem: parentAttrs.openItem || 1,
            };
        },
        [clientId]
    );

    const blockNumber = blockIndex + 1;
    const isOpen = openItem === blockNumber;

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

    const handleToggle = () => {
        if (parentClientId) {
            updateBlockAttributes(parentClientId, {
                openItem: isOpen ? 0 : blockNumber
            });
        }
    };

    const blockProps = useBlockProps({ className: 'accordion-item' });
    const innerBlocksProps = useInnerBlocksProps(
        {
            className: `accordion-collapse collapse${isOpen ? ' show' : ''}`,
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
        <>
            <InspectorControls>
                <PanelBody title="Item Options">
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <TextControl
                                label="Toggle Headline"
                                value={attributes.headline}
                                onChange={(value) => setAttributes({ headline: value })}
                            />
                        </div>
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <h2 className="accordion-header">
                    <button
                        className={`accordion-button${isOpen ? '' : ' collapsed'}`}
                        type="button"
                        onClick={handleToggle}
                        aria-expanded={isOpen ? 'true' : 'false'}
                        aria-controls={`collapse${blockNumber}`}
                    >
                        <RichText
                            tagName="span"
                            className="accordion-button-headline"
                            value={attributes.headline}
                            onChange={(value) => setAttributes({ headline: value })}
                            placeholder="Add a headline..."
                            allowedFormats={['core/bold', 'core/italic']}
                        />
                    </button>
                </h2>
                <div {...innerBlocksProps} />
            </div>
        </>
    );
}