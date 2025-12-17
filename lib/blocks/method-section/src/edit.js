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

    const sectionRef = useRef(null);

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

    // Jarallax initialization and cleanup
    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            const jarallaxEl = sectionRef.current?.querySelector('.jarallax');

            console.log('Jarallax element found:', jarallaxEl);
            console.log('window.jarallax available:', !!window.jarallax);

            if (jarallaxEl && window.jarallax) {
                // Destroy any existing instance first
                window.jarallax(jarallaxEl, 'destroy');

                // Build jarallax options
                const jarallaxOptions = {
                    speed: 0.5,
                    disableVideo: false,
                };

                // Add video source if available (requires jarallax-video.js)
                if (attributes.bgVideo) {
                    // Set the data attribute that jarallax-video looks for
                    jarallaxEl.setAttribute('data-jarallax-video', attributes.bgVideo);

                    jarallaxOptions.videoSrc = attributes.bgVideo;
                    jarallaxOptions.videoLoop = true;
                    jarallaxOptions.videoPlayOnlyVisible = false; // Try to play even if not fully visible in editor
                    jarallaxOptions.videoStartTime = 0;
                    jarallaxOptions.videoVolume = 0;
                    jarallaxOptions.videoLazyLoading = false; // Load immediately
                } else {
                    // Remove video attribute if no video
                    jarallaxEl.removeAttribute('data-jarallax-video');
                }

                // Initialize jarallax
                window.jarallax(jarallaxEl, jarallaxOptions);

                // For videos, we need to wait for the video element to be created, then force autoplay
                if (attributes.bgVideo) {
                    const checkForVideo = setInterval(() => {
                        // Check for self-hosted video element
                        const videoEl = jarallaxEl.querySelector('video');
                        if (videoEl) {
                            videoEl.muted = true;
                            videoEl.setAttribute('muted', '');
                            videoEl.setAttribute('playsinline', '');
                            videoEl.setAttribute('autoplay', '');
                            videoEl.play().catch((e) => {
                                console.log('Video play error:', e);
                            });
                            clearInterval(checkForVideo);
                        }

                        // Check for YouTube/Vimeo iframe
                        const iframeEl = jarallaxEl.querySelector('iframe');
                        if (iframeEl) {

                            // Add allow="autoplay" attribute - required for autoplay in iframe context
                            if (!iframeEl.hasAttribute('allow')) {
                                iframeEl.setAttribute('allow', 'autoplay; fullscreen; encrypted-media');
                            }

                            // Wait for iframe to load, then send play command via postMessage
                            const sendPlayCommand = () => {
                                try {
                                    // Vimeo postMessage API
                                    if (iframeEl.src.includes('vimeo')) {
                                        iframeEl.contentWindow?.postMessage(JSON.stringify({
                                            method: 'play'
                                        }), '*');
                                    }
                                    // YouTube postMessage API
                                    if (iframeEl.src.includes('youtube')) {
                                        console.log('Sending YouTube play command');
                                        iframeEl.contentWindow?.postMessage(JSON.stringify({
                                            event: 'command',
                                            func: 'playVideo',
                                            args: []
                                        }), '*');
                                    }
                                } catch (e) {
                                    console.log('postMessage error:', e);
                                }
                            };

                            // Try immediately and also after a delay
                            sendPlayCommand();
                            setTimeout(sendPlayCommand, 500);
                            setTimeout(sendPlayCommand, 1000);
                            setTimeout(sendPlayCommand, 2000);

                            // Also listen for iframe load event
                            iframeEl.addEventListener('load', () => {
                                setTimeout(sendPlayCommand, 100);
                            }, { once: true });

                            // For jarallax video API
                            if (jarallaxEl.jarallax && jarallaxEl.jarallax.video) {
                                const api = jarallaxEl.jarallax.video;
                                if (api.play) {
                                    api.play();
                                }
                            }
                            clearInterval(checkForVideo);
                        }
                    }, 100);

                    // Clear interval after 5 seconds to prevent memory leak
                    setTimeout(() => clearInterval(checkForVideo), 5000);
                }
            }
        }, 150);

        // Cleanup function
        return () => {
            clearTimeout(timeoutId);
            const jarallaxEl = sectionRef.current?.querySelector('.jarallax');
            if (jarallaxEl && window.jarallax) {
                window.jarallax(jarallaxEl, 'destroy');
                jarallaxEl.removeAttribute('data-jarallax-video');
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
            <div {...blockProps} ref={sectionRef}>
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
