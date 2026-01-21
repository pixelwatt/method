/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    CheckboxControl
} from '@wordpress/components';
import {
    Fragment
} from '@wordpress/element';
import MethodResponsiveTabs from '../../components/MethodResponsiveV2';
import MethodSpacingControls from '../../components/MethodSpacingControlsV2';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodBackgroundControls from '../../components/MethodBackgroundControls';
import MethodShadowControl from '../../components/MethodShadowControl';
import MethodLinkToolbar from '../../components/MethodLinkToolbar';
import useResponsiveSetter from '../../hooks/useResponsiveSetter';
import MethodAspectRatio from '../../components/MethodAspectRatio';

export default function Edit({ attributes, setAttributes, clientId }) {
    const cssMap = {
        [`#block-${clientId}`]: [
            'borderRadius',
            'margin-left',
            'margin-right',
            'margin-top',
            'margin-bottom',
            'boxShadow',
        ],
        [`#block-${clientId} > .method-block-content`]: [
            'textColor',
            'bgColor',
            'borderRadius',
            'border',
            'padding-left',
            'padding-right',
            'padding-top',
            'padding-bottom',
        ],
        [`#block-${clientId} > .method-block-content > .method-block-shade`]: ['bgShade'],
        [`#block-${clientId} > .method-block-content > .method-fit-img-container`]: ['aspectRatio'],
    };
    const update = useResponsiveSetter(attributes, setAttributes);
    const chosenSize = attributes.responsiveSettings?.base?.bgImgSize || 'full';
    const chosenFit = attributes.responsiveSettings?.base?.bgDisplaySize || '';
    let chosenImg = '';
    if (attributes.bgImg?.[chosenSize]?.url) {
        chosenImg = attributes.bgImg[chosenSize].url;
    }
    let aspectClass = '';
    let outerClass = 'method-fit-img-container';
    if (attributes.responsiveSettings?.base?.aspectUses === 'ratio') {
        if (attributes.responsiveSettings?.base?.aspectRatio) {
            aspectClass = ` method-ratio method-ratio${attributes.responsiveSettings.base.aspectRatio}`;
        }
    } else if (!attributes.responsiveSettings?.base?.aspectUses) {
        outerClass = 'method-swiper-img';
    }
    const blockProps = useBlockProps({ className: 'method-block-fitted-image' }, {});
    const blockMarkup = (
        <Fragment>
            <MethodLinkToolbar
                attributes={attributes}
                setAttributes={setAttributes}
            />
            <div className='method-block-content'>
                <div className='method-block-shade'>&nbsp;</div>
                <div className={`${outerClass}${aspectClass}`}>
                    {!!chosenImg && (
                        <img src={`${chosenImg}`} className={`method-fit-img${chosenFit}`} alt="Chosen Image" />
                    )}
                </div>
            </div>
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
                <PanelBody title="Image Options">
                    <div style={{ width: '100%', marginBottom: '12px' }}>
                        <CheckboxControl
                            label="Use Featured Image"
                            checked={attributes.useFeaturedImage || false}
                            onChange={(value) => setAttributes({ useFeaturedImage: value })}
                        />
                    </div>
                    {!!attributes?.useFeaturedImage && (
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <CheckboxControl
                                label="Link to Post"
                                help="If checked, this block will be linked to the post that the featured image is pulled from, and the block will always display, even if there isn't an image (intended for archive template usage)."
                                checked={attributes.linkToPost || false}
                                onChange={(value) => setAttributes({ linkToPost: value })}
                            />
                        </div>
                    )}
                    <MethodBackgroundControls
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                        isImg={true}
                    />
                </PanelBody>
                <PanelBody title="Aspect Ratio" initialOpen={false}>
                    <MethodAspectRatio
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                    />
                </PanelBody>
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
                    include={['bgColor', 'bgShadeColor']}
                />
            </InspectorControls>
            {!!attributes.link?.url && (
                <a {...blockProps}>
                    {blockMarkup}
                </a>
            )}
            {!attributes.link?.url && (
                <div {...blockProps}>
                    {blockMarkup}
                </div>
            )}
        </>
    );
}