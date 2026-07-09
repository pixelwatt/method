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
import MethodResponsiveTabs from '../../components/MethodResponsive';
import MethodSpacingControls from '../../components/MethodSpacingControls';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodBackgroundControls from '../../components/MethodBackgroundControls';
import MethodShadowControl from '../../components/MethodShadowControl';
import MethodDimensionControls from '../../components/MethodDimensionControls';
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
            'zeroHeight',
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
        [`#block-${clientId} > .method-block-content > .method-block-shade`]: ['bgShade', 'borderRadius', 'boxShadow'],
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
        } else {
            aspectClass = ' method-ratio method-ratio-1-1';
        }
    } else if (!attributes.responsiveSettings?.base?.aspectUses) {
        aspectClass = ' method-ratio method-ratio-1-1';
    }
    if (!chosenImg) {
        outerClass = 'method-fit-img-container method-unset-image';
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
                    include={['zeroHeight']}
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
                    include={['bgColor', 'bgShadeColor']}
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
                                    include={['padding', 'margin']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom', 'left', 'right'],
                                    }}
                                />
                                <MethodDimensionControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['zeroHeight']}
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
                                    include={['padding', 'margin']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom', 'left', 'right'],
                                    }}
                                />
                                <MethodDimensionControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['zeroHeight']}
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
                                    include={['padding', 'margin']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom', 'left', 'right'],
                                    }}
                                />
                                <MethodDimensionControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['zeroHeight']}
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