/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow } from '@wordpress/components';
import MethodResponsiveTabs from '../../../components/MethodResponsive';
import MethodSpacingControls from '../../../components/MethodSpacingControls';
import MethodTypographyControls from '../../../components/MethodTypographyControls';
import MethodAlignmentControls from '../../../components/MethodAlignmentControls';
import MethodStyleTag from '../../../components/MethodStyleTag';
import useResponsiveSetter from '../../../hooks/useResponsiveSetter';

export default function Edit({ attributes, setAttributes, clientId }) {
    const ALLOWED_BLOCKS = ['method/advanced-grid-col'];
    const blockProps = useBlockProps(
        { className: 'method-advanced-grid-row-wrap' },
        {}
    );
    const innerBlocksProps = useInnerBlocksProps(
        {
            className: `row method-advanced-grid-row`,
        },
        { allowedBlocks: ALLOWED_BLOCKS }
    );
    const update = useResponsiveSetter(attributes, setAttributes);

    const cssMap = {
        [`#block-${clientId}`]: [
            'fontSize',
            'lineHeight',
            'textAlign',
            'margin-top',
            'margin-bottom',
            'padding-top',
            'padding-bottom',
            'padding-left',
            'padding-right',
        ],
        [`#block-${clientId} > .method-advanced-grid-row.row`]: ['gapAsVars', 'alignItems', 'justifyContent'],
    };

    return (
        <>
            <InspectorControls>
                <MethodAlignmentControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['alignItems', 'justifyContent']}
                />
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
                <MethodTypographyControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
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
                                    include={['alignItems', 'justifyContent']}
                                />
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
                                <MethodTypographyControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                            </>
                        ),
                        tablet: (
                            <>
                                <MethodAlignmentControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['alignItems', 'justifyContent']}
                                />
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
                                <MethodTypographyControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                            </>
                        ),
                        wide: (
                            <>
                                <MethodAlignmentControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['alignItems', 'justifyContent']}
                                />
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
