import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow } from '@wordpress/components';
import MethodResponsive from '../../../components/MethodResponsiveV2';
import MethodSpacingControls from '../../../components/MethodSpacingControlsV2';
import MethodTypographyControls from '../../../components/MethodTypographyControlsV2';
import MethodStyleTag from '../../../components/MethodStyleTag';

export default function Edit({ attributes, setAttributes, clientId }) {
    const ALLOWED_BLOCKS = ['method/advanced-grid-col'];
    const blockProps = useBlockProps({ className: 'method-advanced-grid-row-wrap' }, {});
    const innerBlocksProps = useInnerBlocksProps({ className: 'row method-advanced-grid-row' }, { allowedBlocks: ALLOWED_BLOCKS });

    const cssMap = {
        [`#block-${clientId}`]: ['margin-top', 'margin-bottom', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'font-size', 'line-height'],
        [`#block-${clientId} .method-advanced-grid-row.row`]: ['gapAsVars'],
    };
    return (
        <>
            <InspectorControls>
                <PanelBody title="Block Spacing" initialOpen={false}>
                    <PanelRow>
                        <MethodSpacingControls
                            breakpoint="base"
                            attributes={attributes}
                            setAttributes={setAttributes}
                            include={['padding', 'margin', 'gap']}
                            sides={{ gap: ['vertical'], margin: ['top', 'bottom'], padding: ['top', 'bottom', 'left', 'right'] }}
                        />
                    </PanelRow>
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

                <MethodResponsive
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
                                    include={['padding', 'margin', 'gap']}
                                    sides={{ gap: ['vertical'], margin: ['top', 'bottom'], padding: ['top', 'bottom', 'left', 'right'] }}
                                />
                                <hr />
                                <MethodTypographyControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
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
                                    include={['padding', 'margin', 'gap']}
                                    sides={{ gap: ['vertical'], margin: ['top', 'bottom'], padding: ['top', 'bottom', 'left', 'right'] }}
                                />
                                <hr />
                                <MethodTypographyControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
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
                                    include={['padding', 'margin', 'gap']}
                                    sides={{ gap: ['vertical'], margin: ['top', 'bottom'], padding: ['top', 'bottom', 'left', 'right'] }}
                                />
                                <hr />
                                <MethodTypographyControls
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