const { registerBlockType } = wp.blocks;
const { InspectorControls, PanelColorSettings, MediaUpload, RichText, InnerBlocks } = wp.blockEditor;
const { PanelBody, PanelRow, TextControl, SelectControl, CheckboxControl, Button, ToggleControl } = wp.components;
const { Fragment, RawHTML, useState } = wp.element;
let { __ } = wp.i18n;
import MethodResponsive from '../../components/MethodResponsive';
import MethodSpacingControls from '../../components/MethodSpacingControls';
import MethodTypographyControls from '../../components/MethodTypographyControls';

registerBlockType('method/container-full', {
    title: 'Responsive Container (Full-Width)',
    icon: 'align-full-width',
    category: 'method-container-blocks',
    attributes: {
        fullWidthContent: {
            type: 'bool',
            default: false,
        },
        basePadding: {
            type: 'object',
            default: {
                top: '0rem',
                bottom: '0rem',
                left: '0rem',
                right: '0rem',
            },
        },
        baseMargin: {
            type: 'object',
            default: {
                top: '0rem',
                bottom: '0rem',
            },
        },
        baseFontSize: {
            type: 'string',
            default: '1.25rem',
        },
        baseLineHeight: {
            type: 'string',
            default: '1.55',
        },
        customMobile: {
            type: 'boolean',
            default: false,
        },
        mobilePadding: {
            type: 'object',
            default: {
                top: '0rem',
                bottom: '0rem',
                left: '0rem',
                right: '0rem',
            },
        },
        mobileMargin: {
            type: 'object',
            default: {
                top: '0rem',
                bottom: '0rem',
            },
        },
        mobileFontSize: {
            type: 'string',
            default: '1.25rem',
        },
        mobileLineHeight: {
            type: 'string',
            default: '1.55',
        },
        customTablet: {
            type: 'boolean',
            default: false,
        },
        tabletPadding: {
            type: 'object',
            default: {
                top: '0rem',
                bottom: '0rem',
                left: '0rem',
                right: '0rem',
            },
        },
        tabletMargin: {
            type: 'object',
            default: {
                top: '0rem',
                bottom: '0rem',
            },
        },
        tabletFontSize: {
            type: 'string',
            default: '1.25rem',
        },
        tabletLineHeight: {
            type: 'string',
            default: '1.55',
        },
        customWide: {
            type: 'boolean',
            default: false,
        },
        widePadding: {
            type: 'object',
            default: {
                top: '0rem',
                bottom: '0rem',
                left: '0rem',
                right: '0rem',
            },
        },
        wideMargin: {
            type: 'object',
            default: {
                top: '0rem',
                bottom: '0rem',
            },
        },
        wideFontSize: {
            type: 'string',
            default: '1.25rem',
        },
        wideLineHeight: {
            type: 'string',
            default: '1.55',
        },
    },
    supports: {
        align: ['full'], // Allow wide and full alignments
        spacing: {
            margin: false,  // Enable margin UI control.
            padding: false, // Enable padding UI control.
            blockGap: false,  // Enables block spacing UI control for blocks that also use `layout`.
        },
        color: {
            background: true,
            text: true,
            link: true,
        },
    },
    edit({ attributes, setAttributes, clientId }) {
        const { fullWidthContent, baseMargin, basePadding, baseFontSize, baseLineHeight, customMobile, mobileMargin, mobilePadding, mobileFontSize, mobileLineHeight, customTablet, tabletMargin, tabletPadding, tabletFontSize, tabletLineHeight, customWide, wideMargin, widePadding, wideFontSize, wideLineHeight } = attributes;
        setAttributes({ align: 'full' });
        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="Container Settings">
                        <PanelRow>
                            <ToggleControl
                                label={fullWidthContent ? 'Inner content full-width ' : 'Inner content constrained'}
                                checked={fullWidthContent || false}
                                onChange={(value) =>
                                setAttributes({ fullWidthContent: value })
                                }
                            />
                        </PanelRow>
                    </PanelBody>
                    <PanelBody title="Block Spacing" initialOpen={false}>
                        <PanelRow>
                            <MethodSpacingControls
                                prefix="base"
                                attributes={attributes}
                                setAttributes={setAttributes}
                                includeGap={false}

                            />
                        </PanelRow>
                    </PanelBody>
                    <PanelBody title="Typography" initialOpen={false}>
                        <PanelRow>
                            <MethodTypographyControls
                                prefix="base"
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        </PanelRow>
                    </PanelBody>
                    <MethodResponsive
                        attributes={attributes}
                        setAttributes={setAttributes}
                        breakpoints={methodContainerFullData.breakpoints}
                        renderMobile={
                            <>
                                <hr />
                                <MethodSpacingControls
                                    prefix="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    includeGap={false}
                                />
                                <hr />
                                <MethodTypographyControls
                                    prefix="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                            </>
                        }
                        renderTablet={
                            <>
                                <hr />
                                <MethodSpacingControls
                                    prefix="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    includeGap={false}
                                />
                                <hr />
                                <MethodTypographyControls
                                    prefix="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                            </>
                        }
                        renderWide={
                            <>
                                <hr />
                                <MethodSpacingControls
                                    prefix="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    includeGap={false}
                                />
                                <hr />
                                <MethodTypographyControls
                                    prefix="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                            </>
                        }
                    />
                </InspectorControls>
                <div>
                    <div className={`method-container-full`}>
                        <div className={`method-container-full-inner-wrap`}>
                            {! fullWidthContent && (
                                <div className="has-global-padding is-layout-constrained wp-block-block alignfull">
                                    <div className="method-inner-blocks">
                                        <InnerBlocks />
                                    </div>
                                </div>
                            )}
                            { fullWidthContent && (
                                <div className="method-inner-blocks">
                                    <InnerBlocks />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                        #block-${clientId} {
                            margin-top: ${baseMargin.top ? baseMargin.top : '0'};
                            margin-bottom: ${baseMargin.bottom ? baseMargin.bottom : '0'};
                            padding-top: ${basePadding.top ? basePadding.top : '0'};
                            padding-bottom: ${basePadding.bottom ? basePadding.bottom : '0'};
                            ${baseFontSize ? 'font-size: ' + baseFontSize + ';' : ''}
                            ${baseLineHeight ? 'line-height: ' + baseLineHeight + ';' : ''}
                        }
                        #block-${clientId} .method-container-full {
                            padding-left: ${basePadding.left ? basePadding.left : '0'};
                            padding-right: ${basePadding.right ? basePadding.right : '0'};
                        }
                        `,
                    }}
                />
                {customMobile && (
                        <style
                            dangerouslySetInnerHTML={{
                                __html: `
                                @media ( max-width: ${methodContainerFullData.breakpoints.mobile_max} ) {
                                    #block-${clientId} {
                                        margin-top: ${mobileMargin.top ? mobileMargin.top : '0'};
                                        margin-bottom: ${mobileMargin.bottom ? mobileMargin.bottom : '0'};
                                        padding-top: ${mobilePadding.top ? mobilePadding.top : '0'};
                                        padding-bottom: ${mobilePadding.bottom ? mobilePadding.bottom : '0'};
                                        ${mobileFontSize ? 'font-size: ' + mobileFontSize + ';' : ''}
                                        ${mobileLineHeight ? 'line-height: ' + mobileLineHeight + ';' : ''}
                                    }
                                    #block-${clientId} .method-container-full {
                                        padding-left: ${mobilePadding.left ? mobilePadding.left : '0'};
                                        padding-right: ${mobilePadding.right ? mobilePadding.right : '0'};
                                    }
                                }
                                `,
                            }}
                        />
                    )}
                    {customTablet && (
                        <style
                            dangerouslySetInnerHTML={{
                                __html: `
                                @media ( min-width: ${methodContainerFullData.breakpoints.tablet_min} ) and ( max-width: ${methodContainerFullData.breakpoints.tablet_max} ) {
                                    #block-${clientId} {
                                        margin-top: ${tabletMargin.top ? tabletMargin.top : '0'};
                                        margin-bottom: ${tabletMargin.bottom ? tabletMargin.bottom : '0'};
                                        padding-top: ${tabletPadding.top ? tabletPadding.top : '0'};
                                        padding-bottom: ${tabletPadding.bottom ? tabletPadding.bottom : '0'};
                                        ${tabletFontSize ? 'font-size: ' + tabletFontSize + ';' : ''}
                                        ${tabletLineHeight ? 'line-height: ' + tabletLineHeight + ';' : ''}
                                    }
                                    #block-${clientId} .method-container-full {
                                        padding-left: ${tabletPadding.left ? tabletPadding.left : '0'};
                                        padding-right: ${tabletPadding.right ? tabletPadding.right : '0'};
                                    }
                                }
                                `,
                            }}
                        />
                    )}
                    {customWide && (
                        <style
                            dangerouslySetInnerHTML={{
                                __html: `
                                @media ( min-width: ${methodContainerFullData.breakpoints.wide_min} ) {
                                    #block-${clientId} {
                                        margin-top: ${wideMargin.top ? wideMargin.top : '0'};
                                        margin-bottom: ${wideMargin.bottom ? wideMargin.bottom : '0'};
                                        padding-top: ${widePadding.top ? widePadding.top : '0'};
                                        padding-bottom: ${widePadding.bottom ? widePadding.bottom : '0'};
                                        ${wideFontSize ? 'font-size: ' + wideFontSize + ';' : ''}
                                        ${wideLineHeight ? 'line-height: ' + wideLineHeight + ';' : ''}
                                    }
                                    #block-${clientId} .method-container-full {
                                        padding-left: ${widePadding.left ? widePadding.left : '0'};
                                        padding-right: ${widePadding.right ? widePadding.right : '0'};
                                    }
                                }
                                `,
                            }}
                        />
                    )}
            </Fragment>
        );
    },

    save({ attributes }) {
        return <InnerBlocks.Content />
    },
});