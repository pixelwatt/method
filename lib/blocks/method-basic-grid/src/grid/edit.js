/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    RangeControl,
    PanelBody,
    PanelRow,
} from '@wordpress/components';
import MethodResponsiveTabs from '../../../components/MethodResponsive';
import MethodSpacingControls from '../../../components/MethodSpacingControls';
import MethodAlignmentControls from '../../../components/MethodAlignmentControls';
import MethodStyleTag from '../../../components/MethodStyleTag';
import useResponsiveSetter from '../../../hooks/useResponsiveSetter';

export default function Edit({ attributes, setAttributes, clientId }) {
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
            'alignItems',
            'justifyContent',
        ],
    };

    let mobileOuterClass = '';
    let tabletOuterClass = '';
    let wideOuterClass = '';

    const baseOuterClass = attributes.responsiveSettings?.base?.gridCols ? ` method-layout-${attributes.responsiveSettings?.base?.gridCols}` : '';

    if (attributes.responsiveSettings?.mobile?.enabled === true) {
        mobileOuterClass = attributes.responsiveSettings?.mobile?.gridCols ? ` method-layout-mobile-${attributes.responsiveSettings?.mobile?.gridCols}` : '';
    }
    if (attributes.responsiveSettings?.tablet?.enabled === true) {
        tabletOuterClass = attributes.responsiveSettings?.tablet?.gridCols ? ` method-layout-tablet-${attributes.responsiveSettings?.tablet?.gridCols}` : '';
    }
    if (attributes.responsiveSettings?.wide?.enabled === true) {
        wideOuterClass = attributes.responsiveSettings?.wide?.gridCols ? ` method-layout-wide-${attributes.responsiveSettings?.wide?.gridCols}` : '';
    }

    const ALLOWED_BLOCKS = ['method/basic-grid-item'];
    const blockProps = useBlockProps(
        { className: `method-basic-grid${baseOuterClass}${mobileOuterClass}${tabletOuterClass}${wideOuterClass}` },
        {}
    );
    const innerBlocksProps = useInnerBlocksProps(
        {
            className: `method-inner-blocks`,
        },
        { allowedBlocks: ALLOWED_BLOCKS }
    );
    console.log(attributes);
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
                </PanelBody>
                <MethodAlignmentControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <MethodSpacingControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['padding', 'margin', 'gap']}
                />
                <MethodResponsiveTabs
                    attributes={attributes}
                    setAttributes={setAttributes}
                    renderControls={{
                        mobile: (
                            <>
                                <div
                                    style={{
                                        width: '100%',
                                        marginBottom: '12px',
                                        paddingLeft: '16px',
                                        paddingRight: '16px',
                                        paddingTop: '8px',
                                    }}
                                >
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
                                <MethodSpacingControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                />
                            </>
                        ),
                        tablet: (
                            <>
                                <div
                                    style={{
                                        width: '100%',
                                        marginBottom: '12px',
                                        paddingLeft: '16px',
                                        paddingRight: '16px',
                                        paddingTop: '8px',
                                    }}
                                >
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
                                <MethodSpacingControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                />
                            </>
                        ),
                        wide: (
                            <>
                                <div
                                    style={{
                                        width: '100%',
                                        marginBottom: '12px',
                                        paddingLeft: '16px',
                                        paddingRight: '16px',
                                        paddingTop: '8px',
                                    }}
                                >
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
                                <MethodSpacingControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
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
