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
import MethodResponsiveTabs from '../../components/MethodResponsiveV2';
import MethodSpacingControls from '../../components/MethodSpacingControlsV2';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodTypographyControls from '../../components/MethodTypographyControlsV2';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodBackgroundControls from '../../components/MethodBackgroundControls';
import useResponsiveSetter from '../../hooks/useResponsiveSetter';

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({ className: 'method-container' }, {});
    const innerBlocksProps = useInnerBlocksProps(
        { className: 'method-container-inner-blocks' },
        {}
    );

    const cssMap = {
        [`#block-${clientId}`]: [
            'borderRadius',
            'margin-left',
            'margin-right',
            'margin-top',
            'margin-bottom',
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
        ],
        [`#block-${clientId} > .method-container-content > .method-fit-img`]: ['bgAlign'],
        [`#block-${clientId} > .method-container-content > .method-container-shade`]: ['bgShade'],
        [`#block-${clientId} a`]: ['linkColor'],
    };
    const update = useResponsiveSetter(attributes, setAttributes);
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

                <PanelBody title="Typography" initialOpen={false}>
                    <PanelRow>
                        <MethodTypographyControls
                            breakpoint="base"
                            attributes={attributes}
                            setAttributes={setAttributes}
                        />
                    </PanelRow>
                </PanelBody>
                <PanelBody title="Border Options" initialOpen={false}>
                    <PanelRow>
                        <MethodBorderControls
                            breakpoint="base"
                            attributes={attributes}
                            setAttributes={setAttributes}
                        />
                    </PanelRow>
                </PanelBody>
                <MethodColorControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['textColor', 'linkColor', 'bgColor', 'bgShadeColor']}
                />
                <MethodBackgroundControls
                    attributes={attributes}
                    setAttributes={setAttributes}
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
                            </>
                        ),
                    }}
                />
            </InspectorControls>

            <div {...blockProps}>
                <div className='method-container-content method-fit-img-container'>
                    {attributes.bgImg.full && (
                        <img
                            src={attributes.bgImg.full}
                            alt={'Background Image'}
                            className="method-fit-img"
                        />
                    )}
                    <div className='method-container-shade'>&nbsp;</div>
                    <div {...innerBlocksProps} />
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
