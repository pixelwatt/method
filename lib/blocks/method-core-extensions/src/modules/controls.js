/* eslint-disable prettier/prettier */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import MethodResponsiveTabs from '../../../components/MethodResponsive';
import MethodSpacingControls from '../../../components/MethodSpacingControls';
import MethodTypographyControls from '../../../components/MethodTypographyControls';
import MethodStyleTag from '../../../components/MethodStyleTag';
import { TARGET_BLOCKS, blockConfig } from '../config';

/**
 * Build the responsive tab content for a given breakpoint,
 * based on the block's config entry.
 * @param root0
 * @param root0.breakpoint
 * @param root0.config
 * @param root0.attributes
 * @param root0.setAttributes
 */
function BreakpointControls({ breakpoint, config, attributes, setAttributes }) {
    return (
        <>
            {config.spacing && (
                <MethodSpacingControls
                    breakpoint={breakpoint}
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={config.spacing.include}
                    sides={config.spacing.sides}
                />
            )}
            {config.typography && (
                <MethodTypographyControls
                    breakpoint={breakpoint}
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={config.typography.include}
                />
            )}
        </>
    );
}

const withMethodResponsiveControls = createHigherOrderComponent(
    (BlockEdit) => {
        return (props) => {
            if (!TARGET_BLOCKS.includes(props.name)) {
                return <BlockEdit {...props} />;
            }

            const { attributes, setAttributes, clientId } = props;
            const config = blockConfig[props.name];
            const cssMap = config.editorCssMap(clientId);

            return (
                <Fragment>
                    <BlockEdit {...props} />
                    <InspectorControls>
                        <MethodResponsiveTabs
                            attributes={attributes}
                            setAttributes={setAttributes}
                            renderControls={{
                                mobile: (
                                    <BreakpointControls
                                        breakpoint="mobile"
                                        config={config}
                                        attributes={attributes}
                                        setAttributes={setAttributes}
                                    />
                                ),
                                tablet: (
                                    <BreakpointControls
                                        breakpoint="tablet"
                                        config={config}
                                        attributes={attributes}
                                        setAttributes={setAttributes}
                                    />
                                ),
                                wide: (
                                    <BreakpointControls
                                        breakpoint="wide"
                                        config={config}
                                        attributes={attributes}
                                        setAttributes={setAttributes}
                                    />
                                ),
                            }}
                        />
                    </InspectorControls>
                    <MethodStyleTag
                        clientId={clientId}
                        attributes={attributes}
                        selectorMap={cssMap}
                        excludeBase={true}
                        isImportant={true}
                    />
                </Fragment>
            );
        };
    },
    'withMethodResponsiveControls'
);

addFilter(
    'editor.BlockEdit',
    'method/core-extensions/with-responsive-controls',
    withMethodResponsiveControls
);
