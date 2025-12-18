/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    InspectorControls,
    RichText
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    SelectControl
} from '@wordpress/components';
import {
    Fragment, useMemo
} from '@wordpress/element';

import MethodLinkToolbar from '../../../components/MethodLinkToolbar';

export default function Edit({ attributes, setAttributes, clientId }) {
    const buttonStyleOptions = useMemo(() => {
        return Object.entries(themeButtonData.buttonStyles).map(
            ([key, label]) => ({
                value: key,
                label,
            })
        );
    }, []);
    let extraClass = '';
    if (!!attributes.btnStyle) {
        extraClass = ` method-theme-button-${attributes.btnStyle}`;
    }

    let afterLabel = '';
    const beforeLabel = '';
    if (!!themeButtonData.afterLabel) {
        afterLabel = (
            <span
                className="method-button-icon method-button-icon-after"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: themeButtonData.afterLabel }}
            />
        );
    }
    if (!!themeButtonData.beforeLabel) {
        afterLabel = (
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
                className="method-button-label"
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
                        <SelectControl
                            label="Aspect Uses"
                            value={attributes.btnStyle}
                            options={buttonStyleOptions}
                            onChange={(value) => setAttributes({ btnStyle: value })}
                        />
                    </PanelRow>
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