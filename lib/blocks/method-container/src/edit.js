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
import {
    Fragment
} from '@wordpress/element';
import MethodResponsiveTabs from '../../components/MethodResponsiveV2';
import MethodSpacingControls from '../../components/MethodSpacingControlsV2';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodTypographyControls from '../../components/MethodTypographyControlsV2';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodBackgroundControls from '../../components/MethodBackgroundControls';
import MethodShadowControl from '../../components/MethodShadowControl';
import MethodDimensionControls from '../../components/MethodDimensionControls';
import MethodAlignmentControls from '../../components/MethodAlignmentControls';
import MethodLinkToolbar from '../../components/MethodLinkToolbar';
import useResponsiveSetter from '../../hooks/useResponsiveSetter';
import metadata from './block.json';

export default function Edit({ attributes, setAttributes, clientId }) {
    if (!attributes.methodId) {
        setAttributes({ methodId: `method-${clientId}` });
    } else if (attributes.methodId !== `method-${clientId}`) {
        setAttributes({ methodId: `method-${clientId}` });
    }
    const blockProps = useBlockProps({ className: 'method-container' }, {});
    const innerBlocksProps = useInnerBlocksProps(
        { className: 'method-container-inner-blocks' },
        {}
    );

    console.log(metadata);

    const cssMap = {
        [`#block-${clientId}`]: [
            'borderRadius',
            'margin-top',
            'margin-bottom',
            'boxShadow',
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
        ],
        [`#block-${clientId} > .method-container-content > .method-container-bgimg`]: ['bgImg', 'bgPosition', 'bgSize', 'bgRepeat'],
        [`#block-${clientId} > .method-container-content > .method-container-shade`]: ['bgShade'],
        [`#block-${clientId} a`]: ['linkColor'],
    };
    const update = useResponsiveSetter(attributes, setAttributes);
    //console.log(attributes.responsiveSettings);
    const methodContainerMarkup = (
        <Fragment>
            <MethodLinkToolbar
                attributes={attributes}
                setAttributes={setAttributes}
            />
            <div className={`method-container-content method-fit-img-container align-items-${attributes.responsiveSettings.base.alignItems}`}>
                <div className='method-container-bgimg'>&nbsp;</div>
                <div className='method-container-shade'>&nbsp;</div>
                <div {...innerBlocksProps} />
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
                <PanelBody title="Typography" initialOpen={false}>
                    <PanelRow>
                        <MethodTypographyControls
                            breakpoint="base"
                            attributes={attributes}
                            setAttributes={setAttributes}
                        />
                    </PanelRow>
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

                <PanelBody title="Background Image" initialOpen={false}>
                    <MethodBackgroundControls
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
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
            {!!attributes.link?.url && (
                <a {...blockProps}>
                    {methodContainerMarkup}
                </a>
            )}
            {!attributes.link?.url && (
                <div {...blockProps}>
                    {methodContainerMarkup}
                </div>
            )}

        </>
    );
}
