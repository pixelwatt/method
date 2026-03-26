/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
} from '@wordpress/components';

//MethodFlexControls
import MethodResponsiveTabs from '../../../components/MethodResponsive';
import MethodFlexControls from '../../../components/MethodFlexControls';
import MethodStyleTag from '../../../components/MethodStyleTag';

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({ className: `method-flex-item` }, {});
    const innerBlocksProps = useInnerBlocksProps(
        { className: `method-flex-item-inner-blocks` },
        {}
    );
    const cssMap = {
        [`#block-${clientId}`]: [
            'flexGrow',
            'flexShrink',
            'flexBasis',
        ],
    };
    return (
        <>
            <InspectorControls>
                <MethodFlexControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['flexGrow', 'flexShrink', 'flexBasis']}
                />
                <MethodResponsiveTabs
                    attributes={attributes}
                    setAttributes={setAttributes}
                    renderControls={{
                        mobile: (
                            <>
                                <MethodFlexControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['flexGrow', 'flexShrink', 'flexBasis']}
                                />
                            </>
                        ),
                        tablet: (
                            <>
                                <MethodFlexControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['flexGrow', 'flexShrink', 'flexBasis']}
                                />
                            </>
                        ),
                        wide: (
                            <>
                                <MethodFlexControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['flexGrow', 'flexShrink', 'flexBasis']}
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