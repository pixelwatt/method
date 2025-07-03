const { registerBlockType } = wp.blocks;
const { InspectorControls, RichText, BlockControls, LinkControl } = wp.blockEditor;
const { PanelBody, PanelRow, TextControl, CheckboxControl, SelectControl, Button, Popover, ToolbarGroup, ToolbarButton, ToggleControl } = wp.components;
const { useState } = wp.element;

registerBlockType('method/button', {
    title: 'Button',
    icon: 'block-default',
    category: 'method-component-blocks',
    parent: [ 'method/buttons' ],
    attributes: {
        text: {
            type: 'string',
            default: '',
        },
        url: {
            type: 'string',
            default: '',
        },
        opensInNewTab: {
            type: 'boolean',
            default: false,
        },
        rel: {
            type: 'string',
            default: '',
        },
        isOutlined: {
            type: 'boolean',
            default: false,
        },
    },
    selectors: {
        root: '.method-button',
    },
    supports: {
        spacing: {
            margin: false,  // Enable margin UI control.
            padding: false, // Enable padding UI control.
            blockGap: false,  // Enables block spacing UI control for blocks that also use `layout`.
        },
        color: {
            text: true,
            background: true,
        },
    },

    edit({ attributes, setAttributes, isSelected }) {
        const { text, url, opensInNewTab, rel, isOutlined } = attributes;
        
	    const [isLinkPickerVisible, setIsLinkPickerVisible] = useState(false);
        const unlink = () => {
            setAttributes({ url: '', rel: '', opensInNewTab: false });
        };

        const handleLinkChange = (link) => {
            setAttributes({
                url: link.url,
                opensInNewTab: link.opensInNewTab,
                rel: link.rel ?? ''
            });
            //setIsLinkPickerVisible(false);
        };

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title={__('Button Settings', 'recent-posts-block')}>
                        <PanelRow>

                        </PanelRow>
                    </PanelBody>
                </InspectorControls>
                <div>
                    <BlockControls>
                        <ToolbarGroup>
                            {url ? (
                                <>
                                <ToolbarButton icon='edit' label="Edit Link" onClick={() => setIsLinkPickerVisible(true)} />
                                <ToolbarButton icon='editor-unlink' label="Unlink" onClick={unlink} />
                                </>
                            ) : (
                                <ToolbarButton icon='admin-links' label="Link" onClick={() => setIsLinkPickerVisible(true)} />
                            )}
                        </ToolbarGroup>
                    </BlockControls>

                    {isLinkPickerVisible && (
                        <Popover onClose={() => setIsLinkPickerVisible(false)}>
                            <div>
                                <LinkControl
                                    searchInputPlaceholder="Search pages..."
                                    value={{ url, opensInNewTab, rel }}
                                    settings={[
                                        {
                                            id: 'opensInNewTab',
                                            title: 'Open in new tab',
                                        }
                                    ]}
                                    onChange={handleLinkChange}
                                />
                            </div>
                        </Popover>
                    )}
                
                    <RichText
                        tagName="span"
                        value={text}
                        onChange={(value) => setAttributes({ text: value })}
                        placeholder="Button text"
                        allowedFormats={[]}
                    />
                </div>
            </Fragment>
        );
    },
});