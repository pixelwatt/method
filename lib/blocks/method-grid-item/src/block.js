const { registerBlockType } = wp.blocks;
const { InnerBlocks, InspectorControls } = wp.blockEditor;
const { PanelBody, PanelRow, CheckboxControl } = wp.components;
const { Fragment, RawHTML } = wp.element;

registerBlockType('method/grid-item', {
    title: 'Grid Item',
    icon: 'text',
    category: 'method-component-blocks',
    parent: [ 'method/grid' ],
    attributes: {
        fullWidthItem: {
            type: 'boolean',
            default: false,
        },
    },
    supports: {
        spacing: {
            margin: false,  // Enable margin UI control.
            padding: true, // Enable padding UI control.
            blockGap: false,  // Enables block spacing UI control for blocks that also use `layout`.
        },
        color: {
            background: true,
            text: true,
            link: true,
        },
    },

    edit({ attributes, setAttributes }) {
        const { fullWidthItem } = attributes;
        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="Grid Item Settings">
                        <PanelRow>
                            <CheckboxControl
                                label="Full-Width Item"
                                checked={fullWidthItem || false}
                                onChange={(value) => setAttributes({ fullWidthItem: value })}
                            />
                        </PanelRow>
                    </PanelBody>
                </InspectorControls>
                <div>
                    <div className="method-grid-item method-grid-item-component" data-gfw={fullWidthItem && 'true'}>
                        <InnerBlocks />
                    </div>
                </div>
            </Fragment>
        );
    },

    save({ attributes }) {
        return <InnerBlocks.Content />
    },
});