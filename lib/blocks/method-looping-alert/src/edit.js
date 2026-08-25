import {
    useBlockProps,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    TextControl,
    RangeControl
} from '@wordpress/components';

import MethodLinkToolbar from '../../components/MethodLinkToolbar'
import MethodSpacingControls from '../../components/MethodSpacingControls';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodResponsiveTabs from '../../components/MethodResponsive';
import MethodTypographyControls from '../../components/MethodTypographyControls';
import LoopingAlertMarquee from './LoopingAlertMarquee';

export default function Edit({ attributes, setAttributes, clientId }) {
    const cssMap = {
        [`#block-${clientId}`]: [
            'margin-top',
            'margin-bottom',
        ],
        [`#block-${clientId} > .method-looping-alert-inner`]: [
            'textColor',
            'bgColor',
            'borderRadius',
            'border',
            'padding-top',
            'padding-bottom',
            'fontFamily',
            'fontSize',
            'fontStyle',
            'fontWeight',
            'textTransform',
            'letterSpacing',
        ],
    };
    if (!!attributes.link?.url) {
        cssMap[`a#block-${clientId}`] = ['textColor'];
    }
    const methodAlertMarkup = (
        <>
            <MethodLinkToolbar
                attributes={attributes}
                setAttributes={setAttributes}
            />
            <LoopingAlertMarquee
                text={attributes.alertText ?? ''}
                separator={attributes.seperator ?? ''}
                speed={attributes.speed ?? 0}
            />
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
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <RangeControl
                                help="How quickly would you like the text to horizontally scroll? (0-100)"
                                label="Scroll Speed"
                                initialPosition={25}
                                max={100}
                                min={0}
                                value={attributes.speed}
                                onChange={(value) => setAttributes({ speed: value })}
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
                        padding: ['top', 'bottom'],
                        margin: ['top', 'bottom'],
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
                        include={['textColor', 'bgColor']}
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
                                    sides={{
                                        padding: ['top', 'bottom'],
                                        margin: ['top', 'bottom'],
                                    }}
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
                                    include={['fontFamily', 'fontAppearance', 'fontSize', 'textTransform', 'letterSpacing']}
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
                                    sides={{
                                        padding: ['top', 'bottom'],
                                        margin: ['top', 'bottom'],
                                    }}
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
                                    include={['fontFamily', 'fontAppearance', 'fontSize', 'textTransform', 'letterSpacing']}
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
                                    sides={{
                                        padding: ['top', 'bottom'],
                                        margin: ['top', 'bottom'],
                                    }}
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
                                    include={['fontFamily', 'fontAppearance', 'fontSize', 'textTransform', 'letterSpacing']}
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