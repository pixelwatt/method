import {
    useBlockProps,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    TextControl
} from '@wordpress/components';

import MethodLinkToolbar from '../../components/MethodLinkToolbar'
import MethodSpacingControls from '../../components/MethodSpacingControls';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodResponsiveTabs from '../../components/MethodResponsive';
import MethodTypographyControls from '../../components/MethodTypographyControls';

export default function Edit({ attributes, setAttributes, clientId }) {
    const cssMap = {
        [`#block-${clientId}`]: [
            'margin-top',
            'margin-bottom',
            'margin-left',
            'margin-right'
        ],
        [`#block-${clientId} > .method-looping-alert-inner`]: [
            'textColor',
            'bgColor',
            'borderRadius',
            'border',
            'padding-left',
            'padding-right',
            'padding-top',
            'padding-bottom',
            'fontFamily',
            'fontSize',
            'fontStyle',
            'fontWeight',
            'textTransform',
            'letterSpacing',
        ],
        [`#block-${clientId} a`]: ['linkColor']
    };
    const methodAlertMarkup = (
        <>
            <MethodLinkToolbar
                attributes={attributes}
                setAttributes={setAttributes}
            />
            <div className='method-looping-alert-inner'>
                <p>{attributes.alertText}</p>
            </div>
            <MethodStyleTag
                clientId={clientId}
                attributes={attributes}
                selectorMap={cssMap}
            />
        </>
    );

    const blockProps = useBlockProps(
        { className: 'method-looping-alert' },
        {}
    );
    return (
        <>
            <InspectorControls>
                <PanelBody title="Alert Options">
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <TextControl
                                label="Alert Text"
                                value={attributes.alertText}
                                onChange={(value) => setAttributes({ alertText: value })}
                            />
                        </div>
                    </PanelRow>
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <TextControl
                                label="Seperator"
                                value={attributes.seperator}
                                onChange={(value) => setAttributes({ seperator: value })}
                            />
                        </div>
                    </PanelRow>
                </PanelBody>
                <MethodSpacingControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['padding', 'margin']}
                    sides={{
                        padding: ['top', 'bottom', 'left', 'right'],
                        margin: ['top', 'bottom', 'left', 'right'],
                    }}
                />
                <MethodBorderControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <MethodTypographyControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['fontFamily', 'fontAppearance', 'fontSize', 'textTransform', 'letterSpacing']}
                />
                {!!attributes.link?.url && (
                    <MethodColorControls
                        attributes={attributes}
                        setAttributes={setAttributes}
                        include={['textColor', 'bgColor', 'bgShadeColor']}
                    />
                )}
                {!attributes.link?.url && (
                    <MethodColorControls
                        attributes={attributes}
                        setAttributes={setAttributes}
                        include={['textColor', 'linkColor', 'bgColor', 'bgShadeColor']}
                    />
                )}
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
                                    include={['padding', 'margin']}
                                />
                                <MethodBorderControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                                <MethodTypographyControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['fontFamily', 'fontAppearance', 'fontSize']}
                                />
                            </>
                        ),
                        tablet: (
                            <>
                                <MethodSpacingControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin']}
                                />
                                <MethodBorderControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                                <MethodTypographyControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['fontFamily', 'fontAppearance', 'fontSize']}
                                />
                            </>
                        ),
                        wide: (
                            <>
                                <MethodSpacingControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin']}
                                />
                                <MethodBorderControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                                <MethodTypographyControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['fontFamily', 'fontAppearance', 'fontSize']}
                                />
                            </>
                        ),
                    }}
                />
            </InspectorControls>
            {!!attributes.link?.url && (
                <a {...blockProps}>
                    {methodAlertMarkup}
                </a>
            )}
            {!attributes.link?.url && (
                <div {...blockProps}>
                    {methodAlertMarkup}
                </div>
            )}
        </>
    );
}