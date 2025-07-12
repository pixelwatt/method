const { registerBlockType } = wp.blocks;
const { InspectorControls, PanelColorSettings, MediaUpload, RichText, InnerBlocks } = wp.blockEditor;
const { PanelBody, PanelRow, SelectControl, RangeControl, ColorPicker } = wp.components;
const { Fragment, RawHTML, useState } = wp.element;
let { __ } = wp.i18n;
import MethodResponsive from '../../components/MethodResponsive';
import MethodSpacingControls from '../../components/MethodSpacingControls';
import MethodTypographyControls from '../../components/MethodTypographyControls';

registerBlockType('method/grid', {
    title: 'Method Grid',
    icon: 'grid-view',
    category: 'method-layout-blocks',
    attributes: {
        itemsPerRow: {
            type: 'string',
            default: 'three',
        },
        gridCols: {
            type: 'integer',
            default: 3,
        },
        verticalAlign: {
            type: 'string',
            default: 'align-start',
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
        baseGap: {
            type: 'object',
            default: {
                top: '0rem',
                bottom: '0rem',
                left: '1.5rem',
                right: '1.5rem',
            },
        },
        mobileGap: {
            type: 'object',
            default: {
                top: '0rem',
                bottom: '0rem',
                left: '1.5rem',
                right: '1.5rem',
            },
        },
        tabletGap: {
            type: 'object',
            default: {
                top: '0rem',
                bottom: '0rem',
                left: '1.5rem',
                right: '1.5rem',
            },
        },
        wideGap: {
            type: 'object',
            default: {
                top: '0rem',
                bottom: '0rem',
                left: '1.5rem',
                right: '1.5rem',
            },
        },
        mobileGridCols: {
            type: 'integer',
            default: 1,
        },
        mobileVerticalAlign: {
            type: 'string',
            default: 'align-start',
        },
        tabletGridCols: {
            type: 'integer',
            default: 1,
        },
        tabletVerticalAlign: {
            type: 'string',
            default: 'align-start',
        },
        wideGridCols: {
            type: 'integer',
            default: 1,
        },
        wideVerticalAlign: {
            type: 'string',
            default: 'align-start',
        },
        // REQUIRED FOR 
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
        baseFontSize: {
            type: 'string',
            default: '1.25rem',
        },
        mobileFontSize: {
            type: 'string',
            default: '1.25rem',
        },
        tabletFontSize: {
            type: 'string',
            default: '1.25rem',
        },
        wideFontSize: {
            type: 'string',
            default: '1.25rem',
        },
        baseLineHeight: {
            type: 'string',
            default: '1.55',
        },
        mobileLineHeight: {
            type: 'string',
            default: '1.55',
        },
        tabletLineHeight: {
            type: 'string',
            default: '1.55',
        },
        wideLineHeight: {
            type: 'string',
            default: '1.55',
        },
        justifyContent: {
            type: 'string',
            default: 'justify-start',
        },
        mobileJustifyContent: {
            type: 'string',
            default: 'justify-start',
        },
        tabletJustifyContent: {
            type: 'string',
            default: 'justify-start',
        },
        wideJustifyContent: {
            type: 'string',
            default: 'justify-start',
        },
    },
    supports: {
        spacing: {
            margin: false,  // Enable margin UI control.
            padding: false, // Enable padding UI control.
            blockGap: false,  // Enables block spacing UI control for blocks that also use `layout`.
        },
        color: {
            background: false,
            text: true,
            link: true,
        },
    },
    edit({ attributes, setAttributes, clientId }) {
        const { gridCols, verticalAlign, basePadding, baseMargin, baseGap, mobileGridCols, tabletGridCols, wideGridCols, mobileVerticalAlign, tabletVerticalAlign, wideVerticalAlign, customMobile, mobilePadding, mobileMargin, customTablet, tabletPadding, tabletMargin, customWide, widePadding, wideMargin, mobileGap, tabletGap, wideGap, baseFontSize, mobileFontSize, tabletFontSize, wideFontSize, baseLineHeight, mobileLineHeight, tabletLineHeight, wideLineHeight, justifyContent, mobileJustifyContent, tabletJustifyContent, wideJustifyContent } = attributes;
        const resetVals = {
            top: '0rem',
            bottom: '0rem',
            left: '0rem',
            right: '0rem',
        };
        const resetGapVals = {
            top: '0rem',
            bottom: '0rem',
            left: '1.5rem',
            right: '1.5rem',
        };
        const verticalAlignments = [
            { label: 'Start (Top)', value: 'align-start' },
            { label: 'Center', value: 'align-center' },
            { label: 'End (Bottom)', value: 'align-end' },
        ];
        const horizontalJustifications = [
            { label: 'Start (Left)', value: 'justify-start' },
            { label: 'Center', value: 'justify-center' },
            { label: 'End (Right)', value: 'justify-end' },
            { label: 'Space Between', value: 'justify-between' },
        ];
        const gridMarks = [
            {
                "value": 1,
                "label": "1"
            },
            {
                "value": 2,
                "label": "2"
            },
            {
                "value": 3,
                "label": "3"
            },
            {
                "value": 4,
                "label": "4"
            },
            {
                "value": 5,
                "label": "5"
            },
            {
                "value": 6,
                "label": "6"
            }
        ]; 

        // Prevent 5 items per row from being selected.
        //if ( gridCols === 5 ) {
        //    setAttributes({ gridCols: 6 });
        //}
        //if ( mobileGridCols === 5 ) {
        //    setAttributes({ mobileGridCols: 6 });
        //}
        //if ( tabletGridCols === 5 ) {
        //    setAttributes({ tabletGridCols: 6 });
        //}
        //if ( wideGridCols === 5 ) {
        //    setAttributes({ wideGridCols: 6 });
        //}

        const breakpoints = window?.methodGlobalData?.breakpoints || {};

        // Determine whether different responsive classes should be added, and what they should be.
        let mobileOuterClass = customMobile && mobileGridCols ? ` method-layout-mobile-${mobileGridCols}` : '';
        let tabletOuterClass = customTablet && tabletGridCols ? ` method-layout-tablet-${tabletGridCols}` : '';
        let wideOuterClass = customWide && wideGridCols ? ` method-layout-wide-${wideGridCols}` : '';

        let mobileAlignClass = customMobile && mobileVerticalAlign ? ` method-mobile-${mobileVerticalAlign}` : '';
        let tabletAlignClass = customTablet && tabletVerticalAlign ? ` method-tablet-${tabletVerticalAlign}` : '';
        let wideAlignClass = customWide && wideVerticalAlign ? ` method-wide-${wideVerticalAlign}` : '';

        let mobileJustifyClass = customMobile && mobileJustifyContent ? ` method-mobile-${mobileJustifyContent}` : '';
        let tabletJustifyClass = customTablet && tabletJustifyContent ? ` method-tablet-${tabletJustifyContent}` : '';
        let wideJustifyClass = customWide && wideJustifyContent ? ` method-wide-${wideJustifyContent}` : '';
        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="Grid Settings">
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <RangeControl
                                    label="Items Per Row"
                                    value={gridCols}
                                    initialPosition={gridCols}
                                    max={ 6 }
                                    min={ 1 }
                                    onChange={(value) => setAttributes({ gridCols: value })}
                                    withInputField={false}
                                    marks={gridMarks}
                                />
                            </div>
                        </PanelRow>
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <SelectControl
                                    label="Item Vertical Alignment"
                                    value={verticalAlign}
                                    options={verticalAlignments}
                                    onChange={(value) => setAttributes({ verticalAlign: value })}
                                    size="compact"
                                />
                            </div>
                        </PanelRow>
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <SelectControl
                                    label="Row Content Justify"
                                    value={justifyContent}
                                    options={horizontalJustifications}
                                    onChange={(value) => setAttributes({ justifyContent: value })}
                                    size="compact"
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>
                    <PanelBody title="Block Spacing" initialOpen={false}>
                        <PanelRow>
                            <MethodSpacingControls
                                prefix="base"
                                attributes={attributes}
                                setAttributes={setAttributes}
                                resetGapVals = {{ top: '0rem', bottom: '0rem', left: '1.5rem', right: '1.5rem' }}
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
                        breakpoints={breakpoints}
                        resetGapVals = {{ top: '0rem', bottom: '0rem', left: '1.5rem', right: '1.5rem' }}
                        renderMobile={
                            <>
                                <hr />
                                <RangeControl
                                    label="Items Per Row"
                                    value={mobileGridCols}
                                    initialPosition={mobileGridCols}
                                    max={ 6 }
                                    min={ 1 }
                                    onChange={(value) => setAttributes({ mobileGridCols: value })}
                                    withInputField={false}
                                    marks={gridMarks}
                                />
                                <SelectControl
                                    label="Item Vertical Alignment"
                                    value={attributes.mobileVerticalAlign}
                                    options={verticalAlignments}
                                    onChange={(value) => setAttributes({ mobileVerticalAlign: value })}
                                    size="compact"
                                />
                                <SelectControl
                                    label="Row Content Justify"
                                    value={attributes.mobileJustifyContent}
                                    options={horizontalJustifications}
                                    onChange={(value) => setAttributes({ mobileJustifyContent: value })}
                                    size="compact"
                                />
                                <hr />
                                <MethodSpacingControls
                                    prefix="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    resetGapVals = {{ top: '0rem', bottom: '0rem', left: '1.5rem', right: '1.5rem' }}
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
                                <RangeControl
                                    label="Items Per Row"
                                    value={attributes.tabletGridCols}
                                    initialPosition={attributes.tabletGridCols}
                                    max={ 6 }
                                    min={ 1 }
                                    onChange={(value) => setAttributes({ tabletGridCols: value })}
                                    withInputField={false}
                                    marks={gridMarks}
                                />
                                <SelectControl
                                    label="Item Vertical Alignment"
                                    value={attributes.tabletVerticalAlign}
                                    options={verticalAlignments}
                                    onChange={(value) => setAttributes({ tabletVerticalAlign: value })}
                                    size="compact"
                                />
                                <SelectControl
                                    label="Row Content Justify"
                                    value={attributes.tabletJustifyContent}
                                    options={horizontalJustifications}
                                    onChange={(value) => setAttributes({ tabletJustifyContent: value })}
                                    size="compact"
                                />
                                <hr />
                                <MethodSpacingControls
                                    prefix="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    resetGapVals = {{ top: '0rem', bottom: '0rem', left: '1.5rem', right: '1.5rem' }}
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
                                <RangeControl
                                    label="Items Per Row"
                                    value={attributes.wideGridCols}
                                    initialPosition={attributes.wideGridCols}
                                    max={ 6 }
                                    min={ 1 }
                                    onChange={(value) => setAttributes({ wideGridCols: value })}
                                    withInputField={false}
                                    marks={gridMarks}
                                />
                                <SelectControl
                                    label="Item Vertical Alignment"
                                    value={attributes.wideVerticalAlign}
                                    options={verticalAlignments}
                                    onChange={(value) => setAttributes({ wideVerticalAlign: value })}
                                    size="compact"
                                />
                                <SelectControl
                                    label="Row Content Justify"
                                    value={attributes.wideJustifyContent}
                                    options={horizontalJustifications}
                                    onChange={(value) => setAttributes({ wideJustifyContent: value })}
                                    size="compact"
                                />
                                <hr />
                                <MethodSpacingControls
                                    prefix="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    resetGapVals = {{ top: '0rem', bottom: '0rem', left: '1.5rem', right: '1.5rem' }}
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
                    <div className={`method-grid method-layout-${gridCols} method-${verticalAlign} method-${justifyContent}${mobileOuterClass}${tabletOuterClass}${wideOuterClass}${mobileAlignClass}${tabletAlignClass}${wideAlignClass}${mobileJustifyClass}${tabletJustifyClass}${wideJustifyClass}`}>
                            <div className="row g-0">
                                <div className="col-24">
                                    <div className="method-inner-blocks">
                                        <InnerBlocks
                                            allowedBlocks={['method/grid-item']}
                                        />
                                    </div>
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
                            #block-${clientId} .method-grid {
                                padding-left: ${basePadding.left ? basePadding.left : '0'};
                                padding-right: ${basePadding.right ? basePadding.right : '0'};
                            }
                            div[data-type="method/grid"]#block-${clientId} .method-grid .method-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout {
                                 --bs-gutter-x: ${baseGap.left ? baseGap.left : '0'};
                                 --bs-gutter-y: ${baseGap.top ? baseGap.top : '0'};
                            }
                            `,
                        }}
                    />
                    {customMobile && (
                        <style
                            dangerouslySetInnerHTML={{
                                __html: `
                                @media ( max-width: ${breakpoints.mobile_max} ) {
                                    #block-${clientId} {
                                        margin-top: ${mobileMargin.top ? mobileMargin.top : '0'};
                                        margin-bottom: ${mobileMargin.bottom ? mobileMargin.bottom : '0'};
                                        padding-top: ${mobilePadding.top ? mobilePadding.top : '0'};
                                        padding-bottom: ${mobilePadding.bottom ? mobilePadding.bottom : '0'};
                                        ${mobileFontSize ? 'font-size: ' + mobileFontSize + ';' : ''}
                                        ${mobileLineHeight ? 'line-height: ' + mobileLineHeight + ';' : ''}
                                    }
                                    #block-${clientId} .method-grid {
                                        padding-left: ${mobilePadding.left ? mobilePadding.left : '0'};
                                        padding-right: ${mobilePadding.right ? mobilePadding.right : '0'};
                                    }
                                    div[data-type="method/grid"]#block-${clientId} .method-grid .method-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout {
                                        --bs-gutter-x: ${mobileGap.left ? mobileGap.left : '0'};
                                        --bs-gutter-y: ${mobileGap.top ? mobileGap.top : '0'};
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
                                @media ( min-width: ${breakpoints.tablet_min} ) and ( max-width: ${breakpoints.tablet_max} ) {
                                    #block-${clientId} {
                                        margin-top: ${tabletMargin.top ? tabletMargin.top : '0'};
                                        margin-bottom: ${tabletMargin.bottom ? tabletMargin.bottom : '0'};
                                        padding-top: ${tabletPadding.top ? tabletPadding.top : '0'};
                                        padding-bottom: ${tabletPadding.bottom ? tabletPadding.bottom : '0'};
                                        ${tabletFontSize ? 'font-size: ' + tabletFontSize + ';' : ''}
                                        ${tabletLineHeight ? 'line-height: ' + tabletLineHeight + ';' : ''}
                                    }
                                    #block-${clientId} .method-grid {
                                        padding-left: ${tabletPadding.left ? tabletPadding.left : '0'};
                                        padding-right: ${tabletPadding.right ? tabletPadding.right : '0'};
                                    }
                                    div[data-type="method/grid"]#block-${clientId} .method-grid .method-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout {
                                        --bs-gutter-x: ${tabletGap.left ? tabletGap.left : '0'};
                                        --bs-gutter-y: ${tabletGap.top ? tabletGap.top : '0'};
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
                                @media ( min-width: ${breakpoints.wide_min} ) {
                                    #block-${clientId} {
                                        margin-top: ${wideMargin.top ? wideMargin.top : '0'};
                                        margin-bottom: ${wideMargin.bottom ? wideMargin.bottom : '0'};
                                        padding-top: ${widePadding.top ? widePadding.top : '0'};
                                        padding-bottom: ${widePadding.bottom ? widePadding.bottom : '0'};
                                        ${wideFontSize ? 'font-size: ' + wideFontSize + ';' : ''}
                                        ${wideLineHeight ? 'line-height: ' + wideLineHeight + ';' : ''}
                                    }
                                    #block-${clientId} .method-grid {
                                        padding-left: ${widePadding.left ? widePadding.left : '0'};
                                        padding-right: ${widePadding.right ? widePadding.right : '0'};
                                    }
                                    div[data-type="method/grid"]#block-${clientId} .method-grid .method-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout {
                                        --bs-gutter-x: ${wideGap.left ? wideGap.left : '0'};
                                        --bs-gutter-y: ${wideGap.top ? wideGap.top : '0'};
                                    }
                                }
                                `,
                            }}
                        />
                    )}
                </div>
            </Fragment>
        );
    },

    save({ attributes }) {
        return <InnerBlocks.Content />
    },
});