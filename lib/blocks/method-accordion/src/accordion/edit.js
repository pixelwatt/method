/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    store as blockEditorStore,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    ToggleControl,
    SelectControl,
} from '@wordpress/components';
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
        <>
            <InspectorControls>
                <PanelBody title="Accordion Options" initialOpen={true}>
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <ToggleControl
                                label="Initially Closed"
                                help="If you would like this accordion to appear with all accordion items initially closed, enable this option (this will only be reflected on the frontend). Otherwise, the first item in the accordion will appear as open."
                                checked={attributes.closed}
                                onChange={(value) => setAttributes({ closed: value })}
                            />
                        </div>
                    </PanelRow>
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <SelectControl
                                label="Headline Tag"
                                value={attributes.hTag}
                                options={[
                                    { label: 'h1', value: 'h1' },
                                    { label: 'h2', value: 'h2' },
                                    { label: 'h3', value: 'h3' },
                                    { label: 'h4', value: 'h4' },
                                    { label: 'h5', value: 'h5' },
                                    { label: 'h6', value: 'h6' },
                                ]}
                                onChange={(value) => setAttributes({ hTag: value })}
                            />
                        </div>
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <div {...innerBlocksProps} />
            </div>
        </>
    );
}