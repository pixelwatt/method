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
import MethodStyleTag from '../../../components/MethodStyleTag';

export default function Edit({ attributes, setAttributes, clientId }) {
    if (!attributes.methodId) {
        setAttributes({ methodId: `method-${clientId}` });
    } else if (attributes.methodId !== `method-${clientId}`) {
        setAttributes({ methodId: `method-${clientId}` });
    }
    const blockProps = useBlockProps(
        { className: `method-grid-item-component` },
        {}
    );
    const innerBlocksProps = useInnerBlocksProps(
        {
            className: `method-inner-blocks`,
        },
        {}
    );

    const cssMap = {
        [`#block-${clientId} > .method-inner-blocks`]: [
            'padding-top',
            'padding-bottom',
            'padding-left',
            'padding-right',
        ],
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Grid Options">
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <p>Full width option to go here.</p>
                        </div>
                    </PanelRow>
                </PanelBody>
                <PanelBody title="Block Spacing" initialOpen={false}>
                    <MethodSpacingControls
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                        include={['padding']}
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
                                <MethodSpacingControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding']}
                                    sides={{
                                        gap: ['horizontal', 'vertical'],
                                        margin: ['top', 'bottom'],
                                        padding: ['top', 'bottom', 'left', 'right'],
                                    }}
                                />
                            </>
                        ),
                        tablet: (
                            <>
                                <hr />
                                <MethodSpacingControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding']}
                                    sides={{
                                        gap: ['horizontal', 'vertical'],
                                        margin: ['top', 'bottom'],
                                        padding: ['top', 'bottom', 'left', 'right'],
                                    }}
                                />
                            </>
                        ),
                        wide: (
                            <>
                                <hr />
                                <MethodSpacingControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding']}
                                    sides={{
                                        gap: ['horizontal', 'vertical'],
                                        margin: ['top', 'bottom'],
                                        padding: ['top', 'bottom', 'left', 'right'],
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
