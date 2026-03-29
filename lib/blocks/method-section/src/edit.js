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
import { useEffect, useRef } from '@wordpress/element';
import { useMergeRefs } from '@wordpress/compose';
import MethodResponsiveTabs from '../../components/MethodResponsive';
import MethodSpacingControls from '../../components/MethodSpacingControls';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodBackgroundControls from '../../components/MethodBackgroundControls';
import MethodShadowControl from '../../components/MethodShadowControl';
import MethodDimensionControls from '../../components/MethodDimensionControls';
import MethodAlignmentControls from '../../components/MethodAlignmentControls';
import MethodAddtControls from '../../components/MethodAddtControls';
import FeaturedImage from '../../components/MethodFeaturedImage';
import useResponsiveSetter from '../../hooks/useResponsiveSetter';
import metadata from './block.json';

export default function Edit({ attributes, setAttributes, clientId, context }) {
    // Ref for jarallax initialization
    const sectionRef = useRef(null);

    let extraClasses = '';
    let innerLayoutType = 'default';
    let innerLayoutAligns = [];
    if ((attributes?.align === 'full') && (attributes?.unconstrained === false)) {
        extraClasses = ' is-layout-constrained wp-block-block has-global-padding';
        innerLayoutType = 'constrained';
        innerLayoutAligns = ['wide', 'full'];
    }

    const blockProps = useBlockProps({ className: 'method-section' });
    const innerBlocksProps = useInnerBlocksProps(
        { className: `method-section-inner-blocks${extraClasses}` },
        {
            layout: {
                alignments: innerLayoutAligns
            },
            allowedBlocks: undefined, // Allow all blocks, or specify your child blocks
            templateLock: false, // Allow adding/removing blocks
        }
    );

    // Merge blockProps ref with our custom ref to preserve WordPress toolbar functionality
    const mergedRef = useMergeRefs([blockProps.ref, sectionRef]);

    const cssMap = {
        [`#block-${clientId}`]: [
            'borderRadius',
            'margin-left',
            'margin-right',
            'margin-top',
            'margin-bottom',
            'boxShadow',
            'zIndex'
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
            'alignItems',
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
        if (attributes?.useFeaturedImage === true) {
            // No need to do anything yet
        } else {
            const chosenSize = attributes.responsiveSettings?.base?.bgImgSize || 'full';
            if (attributes.bgImg?.[chosenSize]?.url) {
                chosenImg = attributes.bgImg[chosenSize].url;
            }
        }
    }
    const update = useResponsiveSetter(attributes, setAttributes);



    // Jarallax initialization and cleanup
    useEffect(() => {
        let timeoutId;
        let attempts = 0;
        const maxAttempts = 20;

        const tryInit = () => {
            const jarallaxEl = sectionRef.current?.querySelector(':scope > .method-section-content.jarallax');

            if (jarallaxEl && window.jarallax) {
                // Destroy any existing instance first
                window.jarallax(jarallaxEl, 'destroy');

                // Build jarallax options
                const jarallaxOptions = {
                    speed: 0.5,
                };

                // Add video source if available (requires jarallax-video.js)
                if (attributes.bgVideo) {
                    jarallaxOptions.videoSrc = attributes.bgVideo;
                    jarallaxOptions.videoLoop = true;
                    jarallaxOptions.videoPlayOnlyVisible = true;
                    jarallaxOptions.videoVolume = 0;
                }

                // Initialize jarallax
                window.jarallax(jarallaxEl, jarallaxOptions);
            } else if (attempts < maxAttempts) {
                // Retry if jarallax library isn't loaded yet
                attempts++;
                timeoutId = setTimeout(tryInit, 150);
            }
        };

        timeoutId = setTimeout(tryInit, 150);

        // Cleanup function
        return () => {
            clearTimeout(timeoutId);
            const jarallaxEl = sectionRef.current?.querySelector(':scope > .method-section-content.jarallax');
            if (jarallaxEl && window.jarallax) {
                window.jarallax(jarallaxEl, 'destroy');
            }
        };
    }, [attributes.useParallax, attributes.bgVideo, attributes.bgImg]);

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
                <MethodAlignmentControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['alignItems']}
                    alignItemsLabel="Content Vertical Alignment"
                />
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
                <MethodDimensionControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['height', 'minHeight', 'mhGroup']}
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
                <MethodAddtControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['zIndex']}
                />
                <PanelBody title="Background Media" initialOpen={false}>
                    <MethodBackgroundControls
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                        includeVideo={true}
                        includeFeaturedImage={true}
                    />
                </PanelBody>
                <MethodColorControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['textColor', 'linkColor', 'bgColor', 'bgShadeColor']}
                />
                <MethodResponsiveTabs
                    attributes={attributes}
                    setAttributes={setAttributes}
                    renderControls={{
                        mobile: (
                            <>
                                <MethodAlignmentControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['alignItems']}
                                    alignItemsLabel="Content Vertical Alignment"
                                />
                                <MethodSpacingControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom', 'left', 'right'],
                                    }}
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
                                    include={['height', 'minHeight']}
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
                                <MethodAlignmentControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['alignItems']}
                                    alignItemsLabel="Content Vertical Alignment"
                                />
                                <MethodSpacingControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom', 'left', 'right'],
                                    }}
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
                                    include={['height', 'minHeight']}
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
                                <MethodAlignmentControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['alignItems']}
                                    alignItemsLabel="Content Vertical Alignment"
                                />
                                <MethodSpacingControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom', 'left', 'right'],
                                    }}
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
                                    include={['height', 'minHeight']}
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
            <div {...blockProps} ref={mergedRef}>
                <div
                    key={`section-content-${attributes.useParallax ? 'parallax' : 'static'}-${attributes.bgVideo || 'no-video'}`}
                    className={`method-section-content${parallaxClass}`}
                    {...(attributes.bgVideo ? { 'data-jarallax-video': attributes.bgVideo } : {})}
                >
                    {attributes?.useFeaturedImage === true && attributes?.useParallax === true && (
                        <FeaturedImage
                            postId={context.postId}
                            postType={context.postType}
                            size={attributes?.responsiveSettings?.base?.featuredImageSize || 'full'}
                            format="img"
                            className="jarallax-img"
                        />
                    )}
                    {attributes?.useFeaturedImage !== true && !!chosenImg && attributes?.useParallax === true && (
                        <img src={`${chosenImg}`} alt="Chosen Image" className="jarallax-img" />
                    )}
                    <div className='method-section-bgimg'>&nbsp;</div>
                    <div className='method-section-shade'>&nbsp;</div>
                    <div className={`method-section-content-inner`}>
                        <div {...innerBlocksProps} />
                    </div>
                </div>
                <MethodStyleTag
                    clientId={clientId}
                    attributes={attributes}
                    selectorMap={cssMap}
                    postId={context.postId}
                    postType={context.postType}
                />
            </div>
        </>
    );
}