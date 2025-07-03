const { registerBlockType } = wp.blocks;
const { InspectorControls, InnerBlocks } = wp.blockEditor;
const { PanelBody, SelectControl, Button } = wp.components;
const { Fragment } = wp.element;

registerBlockType('method/buttons', {
    title: 'Buttons',
    icon: 'button',
    category: 'method-component-blocks',
    selectors: {
        root: '.method-buttons',
    },
    supports: {
        spacing: {
            margin: true,  // Enable margin UI control.
            padding: false, // Enable padding UI control.
            blockGap: true,  // Enables block spacing UI control for blocks that also use `layout`.
        },
        color: {
            text: true,
            background: false,
        },
        layout: {
            default: {
                type: 'flex',
            },
        },
    },
    edit() {
        return (
            <Fragment>
                <div>
                    <InnerBlocks
                        allowedBlocks={['method/button']} // Limit to specific blocks, or remove for all blocks
                    />
                </div>
            </Fragment>
        );
    },

    save() {
        return (<InnerBlocks.Content />);
    },
});