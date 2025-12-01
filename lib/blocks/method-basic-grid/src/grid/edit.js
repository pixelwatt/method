/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    RangeControl
} from '@wordpress/components';
import { PanelBody, PanelRow } from '@wordpress/components';
import MethodResponsiveTabs from '../../../components/MethodResponsiveV2';
import MethodSpacingControls from '../../../components/MethodSpacingControlsV2';
import MethodAlignmentControls from '../../../components/MethodAlignmentControls';
import MethodStyleTag from '../../../components/MethodStyleTag';
import useResponsiveSetter from '../../../hooks/useResponsiveSetter';

export default function Edit({ attributes, setAttributes, clientId }) {
    if (!attributes.methodId) {
        setAttributes({ methodId: `method-${clientId}` });
    } else if (attributes.methodId !== `method-${clientId}`) {
        setAttributes({ methodId: `method-${clientId}` });
    }
    const update = useResponsiveSetter(attributes, setAttributes);

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

    const cssMap = {
        [`#block-${clientId}`]: [
            'margin-top',
            'margin-bottom',
        ],
        [`#block-${clientId} > .method-inner-blocks`]: [
            'gapAsVars',
            'padding-top',
            'padding-bottom',
            'padding-left',
            'padding-right',
        ],
    };

    let mobileOuterClass = '';
    let mobileAlignClass = '';
    let mobileJustifyClass = '';

    let tabletOuterClass = '';
    let tabletAlignClass = '';
    let tabletJustifyClass = '';

    let wideOuterClass = '';
    let wideAlignClass = '';
    let wideJustifyClass = '';

    let baseOuterClass = attributes.responsiveSettings?.base?.gridCols ? ` method-layout-${attributes.responsiveSettings?.base?.gridCols}` : '';
    let baseAlignClass = attributes.responsiveSettings?.base?.alignItems ? ` method-align-${attributes.responsiveSettings?.base?.alignItems}` : '';
    let baseJustifyClass = attributes.responsiveSettings?.base?.justifyContent ? ` method-justify-${attributes.responsiveSettings?.base?.justifyContent}` : '';

    if (attributes.responsiveSettings?.mobile?.enabled === true) {
        mobileOuterClass = attributes.responsiveSettings?.mobile?.gridCols ? ` method-layout-mobile-${attributes.responsiveSettings?.mobile?.gridCols}` : '';
        mobileAlignClass = attributes.responsiveSettings?.mobile?.alignItems ? ` method-mobile-align-${attributes.responsiveSettings?.mobile?.alignItems}` : '';
        mobileJustifyClass = attributes.responsiveSettings?.mobile?.justifyContent ? ` method-mobile-justify-${attributes.responsiveSettings?.mobile?.justifyContent}` : '';
    }
    if (attributes.responsiveSettings?.tablet?.enabled === true) {
        tabletOuterClass = attributes.responsiveSettings?.tablet?.gridCols ? ` method-layout-tablet-${attributes.responsiveSettings?.tablet?.gridCols}` : '';
        tabletAlignClass = attributes.responsiveSettings?.tablet?.alignItems ? ` method-tablet-align-${attributes.responsiveSettings?.tablet?.alignItems}` : '';
        tabletJustifyClass = attributes.responsiveSettings?.tablet?.justifyContent ? ` method-tablet-justify-${attributes.responsiveSettings?.tablet?.justifyContent}` : '';
    }
    if (attributes.responsiveSettings?.wide?.enabled === true) {
        wideOuterClass = attributes.responsiveSettings?.wide?.gridCols ? ` method-layout-wide-${attributes.responsiveSettings?.wide?.gridCols}` : '';
        wideAlignClass = attributes.responsiveSettings?.wide?.alignItems ? ` method-wide-align-${attributes.responsiveSettings?.wide?.alignItems}` : '';
        wideJustifyClass = attributes.responsiveSettings?.wide?.justifyContent ? ` method-wide-justify-${attributes.responsiveSettings?.wide?.justifyContent}` : '';
    }

    const ALLOWED_BLOCKS = ['method/basic-grid-item'];
    const blockProps = useBlockProps(
        { className: `method-basic-grid${baseOuterClass}${mobileOuterClass}${tabletOuterClass}${wideOuterClass}${baseAlignClass}${mobileAlignClass}${tabletAlignClass}${wideAlignClass}${baseJustifyClass}${mobileJustifyClass}${tabletJustifyClass}${wideJustifyClass}` },
        {}
    );
    const innerBlocksProps = useInnerBlocksProps(
        {
            className: `method-inner-blocks`,
        },
        { allowedBlocks: ALLOWED_BLOCKS }
    );

    return (
        <>
            <InspectorControls>
                <PanelBody title="Grid Options">
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <RangeControl
                                label="Items Per Row"
                                value={attributes.responsiveSettings?.base?.gridCols}
                                onChange={update('base', 'gridCols')}
                                initialPosition={attributes.responsiveSettings?.base?.gridCols}
                                max={6}
                                min={1}
                                withInputField={false}
                                marks={gridMarks}
                            />
                        </div>
                    </PanelRow>
                    <MethodAlignmentControls
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
                        include={['padding', 'margin', 'gap']}
                        sides={{
                            gap: ['horizontal', 'vertical'],
                            margin: ['top', 'bottom'],
                            padding: ['top', 'bottom', 'left', 'right'],
                        }}
                    />
                </PanelBody>
                <MethodResponsiveTabs
                    attributes={attributes}
                    setAttributes={setAttributes}
                    renderControls={{
                        mobile: (
                            <>
                                <hr />
                                <div style={{ width: '100%', marginBottom: '12px' }}>
                                    <RangeControl
                                        label="Items Per Row"
                                        value={attributes.responsiveSettings?.mobile?.gridCols}
                                        onChange={update('mobile', 'gridCols')}
                                        initialPosition={attributes.responsiveSettings?.mobile?.gridCols}
                                        max={6}
                                        min={1}
                                        withInputField={false}
                                        marks={gridMarks}
                                    />
                                </div>
                                <MethodAlignmentControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                                <hr />
                                <MethodSpacingControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                    sides={{
                                        gap: ['horizontal', 'vertical'],
                                        margin: ['top', 'bottom'],
                                        padding: [
                                            'top',
                                            'bottom',
                                            'left',
                                            'right',
                                        ],
                                    }}
                                />
                            </>
                        ),
                        tablet: (
                            <>
                                <hr />
                                <div style={{ width: '100%', marginBottom: '12px' }}>
                                    <RangeControl
                                        label="Items Per Row"
                                        value={attributes.responsiveSettings?.tablet?.gridCols}
                                        onChange={update('tablet', 'gridCols')}
                                        initialPosition={attributes.responsiveSettings?.tablet?.gridCols}
                                        max={6}
                                        min={1}
                                        withInputField={false}
                                        marks={gridMarks}
                                    />
                                </div>
                                <MethodAlignmentControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                                <hr />
                                <MethodSpacingControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                    sides={{
                                        gap: ['horizontal', 'vertical'],
                                        margin: ['top', 'bottom'],
                                        padding: [
                                            'top',
                                            'bottom',
                                            'left',
                                            'right',
                                        ],
                                    }}
                                />
                            </>
                        ),
                        wide: (
                            <>
                                <hr />
                                <div style={{ width: '100%', marginBottom: '12px' }}>
                                    <RangeControl
                                        label="Items Per Row"
                                        value={attributes.responsiveSettings?.wide?.gridCols}
                                        onChange={update('wide', 'gridCols')}
                                        initialPosition={attributes.responsiveSettings?.wide?.gridCols}
                                        max={6}
                                        min={1}
                                        withInputField={false}
                                        marks={gridMarks}
                                    />
                                </div>
                                <MethodAlignmentControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                                <hr />
                                <MethodSpacingControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                    sides={{
                                        gap: ['horizontal', 'vertical'],
                                        margin: ['top', 'bottom'],
                                        padding: [
                                            'top',
                                            'bottom',
                                            'left',
                                            'right',
                                        ],
                                    }}
                                />
                            </>
                        ),
                    }}
                />
            </InspectorControls>

            <div {...blockProps}>
                <div {...innerBlocksProps} />
            </div>
            <MethodStyleTag
                clientId={clientId}
                attributes={attributes}
                selectorMap={cssMap}
            />
        </>
    );
}
