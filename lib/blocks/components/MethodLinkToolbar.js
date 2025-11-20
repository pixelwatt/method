import { BlockControls, LinkControl } from '@wordpress/block-editor';
import { Popover, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function MethodLinkToolbar({ attributes, setAttributes }) {
    const [isLinkPickerVisible, setIsLinkPickerVisible] = useState(false);

    const updateLink = (key, value, deleteKey = false) => {
        const newLink = { ...attributes.link };

        if (deleteKey) {
            delete newLink[key];
        } else {
            newLink[key] = value;
        }

        setAttributes({ link: newLink });
    };

    const unlink = () => {
        setAttributes({ link: {} });
    };

    const handleLinkChange = (link) => {
        setAttributes({
            link: {
                url: link.url,
                rel: link.rel ?? '',
                opensInNewTab: link.opensInNewTab,
            },
        });
    };

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    {attributes.link?.url ? (
                        <>
                            <ToolbarButton
                                icon="edit"
                                label="Edit Link"
                                onClick={() => setIsLinkPickerVisible(true)}
                            />
                            <ToolbarButton
                                icon="editor-unlink"
                                label="Unlink"
                                onClick={unlink}
                            />
                        </>
                    ) : (
                        <ToolbarButton
                            icon="admin-links"
                            label="Link"
                            onClick={() => setIsLinkPickerVisible(true)}
                        />
                    )}
                </ToolbarGroup>
            </BlockControls>

            {isLinkPickerVisible && (
                <Popover onClose={() => setIsLinkPickerVisible(false)}>
                    <div>
                        <LinkControl
                            searchInputPlaceholder="Search pages..."
                            value={{
                                url: attributes.link?.url || '',
                                opensInNewTab:
                                    attributes.link?.opensInNewTab || false,
                                rel: attributes.link?.rel || '',
                            }}
                            settings={[
                                {
                                    id: 'opensInNewTab',
                                    title: 'Open in new tab',
                                },
                            ]}
                            onChange={handleLinkChange}
                        />
                    </div>
                </Popover>
            )}
        </>
    );
}
