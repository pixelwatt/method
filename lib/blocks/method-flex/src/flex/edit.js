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
import MethodResponsiveTabs from '../../../components/MethodResponsiveV2';
import MethodSpacingControls from '../../../components/MethodSpacingControlsV2';
import MethodStyleTag from '../../../components/MethodStyleTag';
import MethodAlignmentControls from '../../../components/MethodAlignmentControls';
import useResponsiveSetter from '../../../hooks/useResponsiveSetter';

export default function Edit({ attributes, setAttributes, clientId }) {
    const ALLOWED_BLOCKS = ['method/flex-item', 'method/theme-button'];
    const blockProps = useBlockProps({ className: 'method-flex' }, {});
    const innerBlocksProps = useInnerBlocksProps(
        { className: `method-flex-inner-blocks` },
        { allowedBlocks: ALLOWED_BLOCKS, }
    );
    const update = useResponsiveSetter(attributes, setAttributes);

    const cssMap = {
        [`#block-${clientId}`]: [
            'margin-top',
            'margin-bottom',

        ],
        [`#block-${clientId} > .method-flex-inner-blocks`]: ['gap', 'justifyContent', 'alignItems', 'flexDirection', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',],
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Alignment Options">
                    <MethodAlignmentControls
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                        include={['alignItems', 'justifyContent', 'flexDirection']}
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
                            margin: ['top', 'bottom', 'left', 'right'],
                            gap: ['horizontal', 'vertical'],
                        }}
                    />
                </PanelBody>
                <MethodResponsiveTabs
                    attributes={attributes}
                    setAttributes={setAttributes}
                    renderControls={{
                        mobile: (
                            <>
                                <MethodAlignmentControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['alignItems', 'justifyContent', 'flexDirection']}
                                />
                                <MethodSpacingControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom', 'left', 'right'],
                                        gap: ['horizontal', 'vertical'],
                                    }}
                                />
                            </>
                        ),
                        tablet: (
                            <>
                                <MethodAlignmentControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['alignItems', 'justifyContent', 'flexDirection']}
                                />
                                <MethodSpacingControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom', 'left', 'right'],
                                        gap: ['horizontal', 'vertical'],
                                    }}
                                />
                            </>
                        ),
                        wide: (
                            <>
                                <MethodAlignmentControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['alignItems', 'justifyContent', 'flexDirection']}
                                />
                                <MethodSpacingControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom', 'left', 'right'],
                                        gap: ['horizontal', 'vertical'],
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