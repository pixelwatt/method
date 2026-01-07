/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    __experimentalUnitControl as UnitControl,
    CheckboxControl
} from '@wordpress/components';
import MethodResponsiveTabs from '../../components/MethodResponsiveV2';
import MethodSpacingControls from '../../components/MethodSpacingControlsV2';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodAlignmentControls from '../../components/MethodAlignmentControls';
import useResponsiveSetter from '../../hooks/useResponsiveSetter';


export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({ className: `method-sn-block` }, {});
    const update = useResponsiveSetter(attributes, setAttributes);

    const cssMap = {
        [`#block-${clientId}`]: [
            'margin-top',
            'margin-bottom',
        ],
        [`#block-${clientId} ul.method-sn`]: [
            'justifyContent',
            'flexDirection',
            'gap',
            'padding-left',
            'padding-right',
            'padding-top',
            'padding-bottom',
        ],
        [`#block-${clientId} ul.method-sn a .method-sn-label`]: ['textColor']
    };
    if (blockProps.className?.includes('is-style-enclosed')) {
        cssMap[`#block-${clientId} ul.method-sn a .method-sn-icon`] = ['equalDimensions', 'linkColor', 'bgColor'];
    } else {
        cssMap[`#block-${clientId} ul.method-sn a .method-sn-icon`] = ['linkColor'];
        cssMap[`#block-${clientId} ul.method-sn a .method-sn-icon svg`] = ['equalDimensions'];
    }

    const colorOpts = ['linkColor'];
    if (blockProps.className?.includes('is-style-enclosed')) {
        colorOpts.push('bgColor');
    }
    if (blockProps.className?.includes('with-text')) {
        colorOpts.push('textColor');
    }

    return (
        <>
            <InspectorControls>
                <PanelBody title="Display Options" initialOpen={false}>
                    <PanelRow>
                        <UnitControl
                            label="Icon Dimensions"
                            value={attributes.responsiveSettings?.base?.dimensions || '2.5rem'}
                            onChange={update('base', 'dimensions')}
                        />
                    </PanelRow>
                    <MethodAlignmentControls
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                        include={['justifyContent', 'flexDirection']}
                    />
                </PanelBody>
                <PanelBody title="Block Spacing" initialOpen={false}>
                    <MethodSpacingControls
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                        include={['padding', 'margin', 'gap']}
                        sides={{
                            padding: ['top', 'bottom', 'left', 'right'],
                            margin: ['top', 'bottom'],
                            gap: ['horizontal', 'vertical'],
                        }}
                    />
                </PanelBody>

                <MethodColorControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={colorOpts}
                />
                <MethodResponsiveTabs
                    attributes={attributes}
                    setAttributes={setAttributes}
                    renderControls={{
                        mobile: (
                            <>
                                <UnitControl
                                    label="Icon Dimensions"
                                    value={attributes.responsiveSettings?.mobile?.dimensions || '0rem'}
                                    onChange={update('mobile', 'dimensions')}
                                />
                                <MethodAlignmentControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['justifyContent', 'flexDirection']}
                                />
                                <MethodSpacingControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom'],
                                        gap: ['horizontal', 'vertical'],
                                    }}
                                />
                            </>
                        ),
                        tablet: (
                            <>
                                <UnitControl
                                    label="Icon Dimensions"
                                    value={attributes.responsiveSettings?.tablet?.dimensions || '0rem'}
                                    onChange={update('tablet', 'dimensions')}
                                />
                                <MethodAlignmentControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['justifyContent', 'flexDirection']}
                                />
                                <MethodSpacingControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom'],
                                        gap: ['horizontal', 'vertical'],
                                    }}
                                />
                            </>
                        ),
                        wide: (
                            <>
                                <UnitControl
                                    label="Icon Dimensions"
                                    value={attributes.responsiveSettings?.wide?.dimensions || '0rem'}
                                    onChange={update('wide', 'dimensions')}
                                />
                                <MethodAlignmentControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['justifyContent', 'flexDirection']}
                                />
                                <MethodSpacingControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom'],
                                        gap: ['horizontal', 'vertical'],
                                    }}
                                />
                            </>
                        ),
                    }}
                />
            </InspectorControls>
            <div {...blockProps}>
                <ul className='method-sn' dangerouslySetInnerHTML={{ __html: methodGlobalData.socialNavItems }}></ul>
                <MethodStyleTag
                    clientId={clientId}
                    attributes={attributes}
                    selectorMap={cssMap}
                />
            </div>
        </>
    );
}