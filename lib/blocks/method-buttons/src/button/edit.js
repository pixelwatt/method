/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    InspectorControls,
    RichText
} from '@wordpress/block-editor';
import {
    Fragment
} from '@wordpress/element';
import MethodResponsiveTabs from '../../../components/MethodResponsive';
import MethodSpacingControls from '../../../components/MethodSpacingControls';
import MethodBorderControls from '../../../components/MethodBorderControls';
import MethodTypographyControls from '../../../components/MethodTypographyControls';
import MethodColorControls from '../../../components/MethodColorControls';
import MethodStyleTag from '../../../components/MethodStyleTag';
import MethodShadowControl from '../../../components/MethodShadowControl';
import MethodLinkToolbar from '../../../components/MethodLinkToolbar';
import useResponsiveSetter from '../../../hooks/useResponsiveSetter';

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({ className: 'method-button' }, {});
    const update = useResponsiveSetter(attributes, setAttributes);

    const cssMap = {
        [`#block-${clientId}`]: [
            'borderRadius',
            'boxShadow',
            'textColor',
            'bgColor',
            'border',
            'padding-left',
            'padding-right',
            'padding-top',
            'padding-bottom',
            'fontSize',
            'lineHeight',
        ],
    }

    const methodButtonMarkup = (
        <Fragment>
            <MethodLinkToolbar
                attributes={attributes}
                setAttributes={setAttributes}
            />
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
            <MethodStyleTag
                clientId={clientId}
                attributes={attributes}
                selectorMap={cssMap}
            />
        </Fragment>
    );
    return (
        <>
            <InspectorControls>
                <MethodSpacingControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['padding']}
                />
                <MethodTypographyControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <MethodBorderControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <MethodShadowControl
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <MethodColorControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['textColor', 'bgColor']}
                />

                <MethodResponsiveTabs
                    attributes={attributes}
                    setAttributes={setAttributes}
                    renderControls={{
                        mobile: (
                            <>
                                <MethodSpacingControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding']}
                                />
                                <MethodTypographyControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                                <MethodBorderControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                            </>
                        ),
                        tablet: (
                            <>
                                <MethodSpacingControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding']}
                                />
                                <MethodTypographyControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                                <MethodBorderControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                            </>
                        ),
                        wide: (
                            <>
                                <MethodSpacingControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding']}
                                />
                                <MethodTypographyControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                                <MethodBorderControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                            </>
                        ),
                    }}
                />
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