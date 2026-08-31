/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    InspectorControls,
    RichText
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    SelectControl,
    TextControl
} from '@wordpress/components';
import {
    Fragment, useMemo
} from '@wordpress/element';

import MethodLinkToolbar from '../../../components/MethodLinkToolbar';

export default function Edit({ attributes, setAttributes, clientId }) {
    // Move useMemo calls to top level, unconditionally
    const buttonStyleOptions = useMemo(() => {
        if (!themeButtonData?.buttonStyles) return [];
        return Object.entries(themeButtonData.buttonStyles).map(
            ([key, label]) => ({
                value: key,
                label,
            })
        );
    }, []);

    const labelStyleOptions = useMemo(() => {
        if (!themeButtonData?.labelStyles) return [];
        return Object.entries(themeButtonData.labelStyles).map(
            ([key, label]) => ({
                value: key,
                label,
            })
        );
    }, []);

    const buttonIconOptions = useMemo(() => {
        if (!methodGlobalData?.icons) return [{ value: '', label: 'None' }];
        return [
            { value: '', label: 'None' },
            ...Object.entries(methodGlobalData.icons).map(
                ([key, data]) => ({
                    value: key,
                    label: data.label,
                })
            ),
        ];
    }, []);
    let extraClass = '';
    if (!!attributes.btnStyle) {
        extraClass = ` method-theme-button-${attributes.btnStyle}`;
    }

    let extraLabelClass = '';
    if (!!attributes.labelStyle) {
        extraLabelClass = ` ${attributes.labelStyle}`;
    }

    let afterLabel = '';
    let beforeLabel = '';
    if ((!!methodGlobalData.icons) && (!!attributes.afterIcon)) {
        afterLabel = (
            <span
                className="method-button-icon method-button-icon-after"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: methodGlobalData.icons[attributes.afterIcon].svg }}
            />
        );
    } else if (!!themeButtonData.afterLabel) {
        afterLabel = (
            <span
                className="method-button-icon method-button-icon-after"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: themeButtonData.afterLabel }}
            />
        );
    }

    if ((!!methodGlobalData.icons) && (!!attributes.beforeIcon)) {
        beforeLabel = (
            <span
                className="method-button-icon method-button-icon-before"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: methodGlobalData.icons[attributes.beforeIcon].svg }}
            />
        );
    } else if (!!themeButtonData.beforeLabel) {
        beforeLabel = (
            <span
                className="method-button-icon method-button-icon-before"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: themeButtonData.beforeLabel }}
            />
        );
    }

    const blockProps = useBlockProps({ className: `method-theme-button${extraClass}` }, {});
    const methodButtonMarkup = (
        <Fragment>
            <MethodLinkToolbar
                attributes={attributes}
                setAttributes={setAttributes}
            />
            {beforeLabel}
            <RichText
                tagName="span"
                className={`method-button-label${extraLabelClass}`}
                value={attributes.btnLabel}
                onChange={(value) => setAttributes({ btnLabel: value })}
                placeholder="Add a label..."
                allowedFormats={[
                    'core/bold',
                    'core/italic',
                ]}
            />
            {afterLabel}
        </Fragment>
    );
    return (
        <>
            <InspectorControls>
                <PanelBody title="Button Options">
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <TextControl
                                label="Label"
                                value={attributes.btnLabel}
                                onChange={(value) => setAttributes({ btnLabel: value })}
                            />
                        </div>
                    </PanelRow>
                    {!!themeButtonData.buttonStyles && (
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <SelectControl
                                    label={themeButtonData.buttonStylesLabel}
                                    value={attributes.btnStyle}
                                    options={buttonStyleOptions}
                                    onChange={(value) => setAttributes({ btnStyle: value })}
                                />
                            </div>
                        </PanelRow>
                    )}
                    {!!themeButtonData.labelStyles && (
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <SelectControl
                                    label="Label Style"
                                    value={attributes.labelStyle}
                                    options={labelStyleOptions}
                                    onChange={(value) => setAttributes({ labelStyle: value })}
                                />
                            </div>
                        </PanelRow>
                    )}
                    {!!methodGlobalData.icons && (
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <SelectControl
                                    label="Icon (Before Label)"
                                    value={attributes.beforeIcon}
                                    options={buttonIconOptions}
                                    onChange={(value) => setAttributes({ beforeIcon: value })}
                                />
                            </div>
                        </PanelRow>
                    )}
                    {!!methodGlobalData.icons && (
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <SelectControl
                                    label="Icon (After Label)"
                                    value={attributes.afterIcon}
                                    options={buttonIconOptions}
                                    onChange={(value) => setAttributes({ afterIcon: value })}
                                />
                            </div>
                        </PanelRow>
                    )}
                </PanelBody>
            </InspectorControls>
            {!!attributes.link?.url && (
                <a {...blockProps}>
                    {methodButtonMarkup}
                </a>
            )}
            {!attributes.link?.url && (
                <div {...blockProps}>
                    {methodButtonMarkup}
                </div>
            )}
        </>
    );
}