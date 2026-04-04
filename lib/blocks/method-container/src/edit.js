/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
} from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { useMergeRefs } from '@wordpress/compose';
import MethodResponsiveTabs from '../../components/MethodResponsive';
import MethodSpacingControls from '../../components/MethodSpacingControls';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodTypographyControls from '../../components/MethodTypographyControls';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodBackgroundControls from '../../components/MethodBackgroundControls';
import MethodShadowControl from '../../components/MethodShadowControl';
import MethodDimensionControls from '../../components/MethodDimensionControls';
import MethodAlignmentControls from '../../components/MethodAlignmentControls';
import MethodAddtControls from '../../components/MethodAddtControls';
import MethodLinkToolbar from '../../components/MethodLinkToolbar';
import useResponsiveSetter from '../../hooks/useResponsiveSetter';
import metadata from './block.json';

// MethodAddtControls

export default function Edit({ attributes, setAttributes, clientId }) {
    // Ref for jarallax initialization
    const sectionRef = useRef(null);


    const blockProps = useBlockProps({ className: 'method-container' }, {});
    const innerBlocksProps = useInnerBlocksProps(
        { className: 'method-container-inner-blocks' },
        {}
    );

    // Merge blockProps ref with our custom ref to preserve WordPress toolbar functionality
    const mergedRef = useMergeRefs([blockProps.ref, sectionRef]);

    const cssMap = {
        [`#block-${clientId}`]: [
            'borderRadius',
            'margin-top',
            'margin-bottom',
            'margin-left',
            'margin-right',
            'boxShadow',
            'zIndex',
        ],
        [`#block-${clientId} > .method-container-content`]: [
            'textColor',
            'bgColor',
            'borderRadius',
            'border',
            'padding-left',
            'padding-right',
            'padding-top',
            'padding-bottom',
            'fontSize',
            'lineHeight',
            'height',
            'minHeight',
            'width',
            'minWidth',
            'alignItems',
            'overflow',
            'aspectRatioDimension',
        ],
        [`#block-${clientId} > .method-container-content > .method-container-shade`]: ['bgShade'],
        [`#block-${clientId} a`]: ['linkColor'],
    };

    let parallaxClass = '';
    let chosenImg = '';
    if (!attributes?.useParallax && !attributes?.bgVideo) {
        cssMap[`#block-${clientId} > .method-container-content > .method-container-bgimg`] = ['bgImg', 'bgPosition', 'bgSize', 'bgRepeat'];
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

    // Jarallax initialization and cleanup
    useEffect(() => {
        let timeoutId;
        let attempts = 0;
        const maxAttempts = 20;

        const tryInit = () => {
            const jarallaxEl = sectionRef.current?.querySelector(':scope > .method-container-content.jarallax');

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
            const jarallaxEl = sectionRef.current?.querySelector(':scope > .method-container-content.jarallax');
            if (jarallaxEl && window.jarallax) {
                window.jarallax(jarallaxEl, 'destroy');
            }
        };
    }, [attributes.useParallax, attributes.bgVideo, attributes.bgImg]);

    const methodContainerMarkup = (
        <>
            <MethodLinkToolbar
                attributes={attributes}
                setAttributes={setAttributes}
            />
            <div
                key={`container-content-${attributes.useParallax ? 'parallax' : 'static'}-${attributes.bgVideo || 'no-video'}`}
                className={`method-container-content${parallaxClass}`}
                {...(attributes.bgVideo ? { 'data-jarallax-video': attributes.bgVideo } : {})}
            >
                {chosenImg}
                <div className='method-container-bgimg'>&nbsp;</div>
                <div className='method-container-shade'>&nbsp;</div>
                <div {...innerBlocksProps} />
            </div>
            <MethodStyleTag
                clientId={clientId}
                attributes={attributes}
                selectorMap={cssMap}
            />
        </>
    );

    return (
        <>
            <InspectorControls>
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
                    include={['height', 'minHeight', 'width', 'minWidth', 'mhGroup', 'aspectRatio']}
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
                <MethodAddtControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <PanelBody title="Background Media" initialOpen={false}>
                    <MethodBackgroundControls
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                        includeVideo={true}
                    />
                </PanelBody>
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
                                <MethodDimensionControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['height', 'minHeight', 'width', 'minWidth', 'mhGroup', 'aspectRatio']}
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
                                    breakpoint="mobile"
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
                                <MethodDimensionControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['height', 'minHeight', 'width', 'minWidth', 'mhGroup', 'aspectRatio']}
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
                                    breakpoint="mobile"
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
                                <MethodDimensionControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['height', 'minHeight', 'width', 'minWidth', 'mhGroup', 'aspectRatio']}
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
            {!!attributes.link?.url && (
                <a {...blockProps} ref={mergedRef}>
                    {methodContainerMarkup}
                </a>
            )}
            {!attributes.link?.url && (
                <div {...blockProps} ref={mergedRef}>
                    {methodContainerMarkup}
                </div>
            )}

        </>
    );
}
