/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    TextControl
} from '@wordpress/components';
import {
    Fragment
} from '@wordpress/element';
import MethodResponsiveTabs from '../../components/MethodResponsive';
import MethodSpacingControls from '../../components/MethodSpacingControls';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodBackgroundControls from '../../components/MethodBackgroundControls';
import MethodShadowControl from '../../components/MethodShadowControl';
import useResponsiveSetter from '../../hooks/useResponsiveSetter';

export default function Edit({ attributes, setAttributes, clientId }) {
    const cssMap = {
        [`#block-${clientId}`]: [
            'borderRadius',
            'margin-top',
            'margin-bottom',
            'boxShadow',
        ],
        [`#block-${clientId} > .method-fluid-video-preview`]: [
            'textColor',
            'bgColor',
            'borderRadius',
            'border',
        ],
        [`#block-${clientId} > .method-fluid-video-preview > .method-block-shade`]: ['bgShade'],
        [`#block-${clientId} > .method-fluid-video-preview > .method-invoke-target`]: ['linkColor'],
        [`#block-${clientId} > .method-fluid-video-preview > .method-invoke-target:hover`]: ['linkHoverColor'],
    };
    // 
    const playIcon = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
    </svg>);
    const update = useResponsiveSetter(attributes, setAttributes);
    const chosenSize = attributes.responsiveSettings?.base?.bgImgSize || 'full';
    let chosenImg = '';
    if (attributes.bgImg?.[chosenSize]?.url) {
        chosenImg = attributes.bgImg[chosenSize].url;
    }

    const blockProps = useBlockProps({ className: 'method-fluid-video' }, {});



    return (
        <>
            <InspectorControls>
                <PanelBody title="Block Options">
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <TextControl
                                label="Video URL"
                                value={attributes.videoUrl}
                                onChange={(value) => setAttributes({ videoUrl: value })}
                            />
                        </div>
                    </PanelRow>
                </PanelBody>
                <PanelBody title="Image Options">
                    <MethodBackgroundControls
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                        isImg={true}
                        limited={true}
                    />
                </PanelBody>
                <MethodSpacingControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['margin']}
                    sides={{
                        margin: ['top', 'bottom'],
                    }}
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
                    include={['linkColor', 'linkHoverColor', 'bgColor', 'bgShadeColor']}
                    labels={{
                        linkColor: 'Play Icon',
                        linkHoverColor: 'Play Icon (Hover)',
                        bgShadeColor: 'Image Shade',
                    }}
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
                                    include={['margin']}
                                    sides={{
                                        margin: ['top', 'bottom'],
                                    }}
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
                                    include={['margin']}
                                    sides={{
                                        margin: ['top', 'bottom'],
                                    }}
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
                                    include={['margin']}
                                    sides={{
                                        margin: ['top', 'bottom'],
                                    }}
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
            <div {...blockProps}>
                <a role="button" className='method-fluid-video-preview'>
                    <div className='method-invoke-target'>{playIcon}</div>
                    <div className='method-block-shade'>&nbsp;</div>
                    <div className={`method-fit-img-container${!chosenImg ? ' method-unset-image' : ''}`}>
                        {!!chosenImg && (
                            <img src={`${chosenImg}`} className={`method-fit-img`} alt="Chosen Image" />
                        )}
                    </div>
                </a>
                <MethodStyleTag
                    clientId={clientId}
                    attributes={attributes}
                    selectorMap={cssMap}
                />
            </div>
        </>
    );
}