/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    ToggleControl
} from '@wordpress/components';
import MethodResponsiveTabs from '../../components/MethodResponsiveV2';
import MethodSpacingControls from '../../components/MethodSpacingControlsV2';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodBackgroundControls from '../../components/MethodBackgroundControls';
import MethodShadowControl from '../../components/MethodShadowControl';
import MethodDimensionControls from '../../components/MethodDimensionControls';
import MethodAlignmentControls from '../../components/MethodAlignmentControls';
import useResponsiveSetter from '../../hooks/useResponsiveSetter';
import metadata from './block.json';

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({ className: 'method-section' }, {});
    const innerBlocksProps = useInnerBlocksProps(
        { className: 'method-section-inner-blocks' },
        {}
    );

    const cssMap = {
        [`#block-${clientId}`]: [
            'borderRadius',
            'margin-left',
            'margin-right',
            'margin-top',
            'margin-bottom',
            'boxShadow',
        ],
        [`#block-${clientId} > .method-section-content`]: [
            'textColor',
            'bgColor',
            'borderRadius',
            'border',
            'padding-left',
            'padding-right',
            'padding-top',
            'padding-bottom',
            'height',
            'minHeight',
        ],
        [`#block-${clientId} > .method-section-content > .method-section-shade`]: ['bgShade'],
        [`#block-${clientId} a`]: ['linkColor'],
    };
    let parallaxClass = '';
    let chosenImg = '';
    if (!attributes?.useParallax && !attributes?.bgVideo) {
        cssMap[`#block-${clientId} > .method-section-content > .method-section-bgimg`] = ['bgImg', 'bgPosition', 'bgSize', 'bgRepeat'];
    } else {
        parallaxClass = ' jarallax';
        const chosenSize = attributes.responsiveSettings?.base?.bgImgSize || 'full';
        if (attributes.bgImg?.[chosenSize]?.url) {
            chosenImg = attributes.bgImg[chosenSize].url;
            if (!!chosenImg) {
                chosenImg = (
                    <img src={`${chosenImg}`} alt="Chosen Image" className="jarallax-img" />
                );
            }
        }
    }
    const update = useResponsiveSetter(attributes, setAttributes);

    let extraClasses = '';
    if ((attributes?.align === 'full') && (attributes?.unconstrained === false)) {
        extraClasses = ' is-layout-constrained wp-block-block has-global-padding';
    }

    return (
        <>
            <InspectorControls>
                {attributes?.align === 'full' && (
                    <PanelBody title="Section Options" initialOpen={true}>
                        <PanelRow>
                            <ToggleControl
                                label="Unconstrain Content"
                                help="Enable this option if you would like inner content to stretch from edge to edge."
                                checked={attributes.unconstrained}
                                onChange={(value) => setAttributes({ unconstrained: value })}
                            />
                        </PanelRow>
                    </PanelBody>
                )}
                <PanelBody title="Block Spacing" initialOpen={false}>
                    <MethodSpacingControls
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                        include={['padding', 'margin']}
                        sides={{
                            padding: ['top', 'bottom', 'left', 'right'],
                            margin: ['top', 'bottom', 'left', 'right'],
                            gap: ['horizontal', 'vertical'],
                        }}
                    />
                </PanelBody>
                <PanelBody title="Dimensions" initialOpen={false}>
                    <PanelRow>
                        <MethodDimensionControls
                            breakpoint="base"
                            attributes={attributes}
                            setAttributes={setAttributes}
                            includeWidth={false}
                            includeMinWidth={false}
                        />
                    </PanelRow>
                    <MethodAlignmentControls
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                        include={['alignItems']}
                        alignItemsLabel="Content Vertical Alignment"
                    />
                </PanelBody>
                <PanelBody title="Borders" initialOpen={false}>
                    <PanelRow>
                        <MethodBorderControls
                            breakpoint="base"
                            attributes={attributes}
                            setAttributes={setAttributes}
                        />
                    </PanelRow>
                </PanelBody>
                <PanelBody title="Box Shadow" initialOpen={false}>
                    <PanelRow>
                        <MethodShadowControl
                            value={attributes.responsiveSettings?.base
                                ?.shadow}
                            onChange={update('base', 'shadow')}
                        />
                    </PanelRow>
                </PanelBody>


                <MethodColorControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['textColor', 'linkColor', 'bgColor', 'bgShadeColor']}
                />

                <PanelBody title="Background Options" initialOpen={false}>
                    <MethodBackgroundControls
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                        includeVideo={true}
                    />
                </PanelBody>
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
                                    sides={{ gap: ['vertical'] }}
                                />
                                <MethodBorderControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                                <MethodDimensionControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    includeWidth={false}
                                    includeMinWidth={false}
                                />
                                <MethodBackgroundControls
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
                                    include={['padding', 'margin']}
                                    sides={{ gap: ['vertical'] }}
                                />
                                <MethodBorderControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                                <MethodDimensionControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    includeWidth={false}
                                    includeMinWidth={false}
                                />
                                <MethodBackgroundControls
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
                                    include={['padding', 'margin']}
                                    sides={{ gap: ['vertical'] }}
                                />
                                <MethodBorderControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                                <MethodDimensionControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    includeWidth={false}
                                    includeMinWidth={false}
                                />
                                <MethodBackgroundControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                            </>
                        ),
                    }}
                />
            </InspectorControls>
            <div {...blockProps}>
                <div className={`method-section-content align-items-${attributes.responsiveSettings.base.alignItems}${parallaxClass}`}>
                    {chosenImg}
                    <div className='method-section-bgimg'>&nbsp;</div>
                    <div className='method-section-shade'>&nbsp;</div>
                    <div className={`method-section-content-inner${extraClasses}`}>
                        <div {...innerBlocksProps} />
                    </div>
                </div>
                <MethodStyleTag
                    clientId={clientId}
                    attributes={attributes}
                    selectorMap={cssMap}
                />
            </div>
        </>
    );
}
