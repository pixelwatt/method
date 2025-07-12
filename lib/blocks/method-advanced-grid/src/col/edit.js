import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl } from '@wordpress/components';
import MethodResponsive from '../../../components/MethodResponsiveV2';
import MethodSpacingControls from '../../../components/MethodSpacingControlsV2';
import MethodTypographyControls from '../../../components/MethodTypographyControlsV2';
import MethodStyleTag from '../../../components/MethodStyleTag';
import useResponsiveSetter from '../../../hooks/useResponsiveSetter';

export default function Edit({ attributes, setAttributes, clientId }) {
	let colClasses = '';
    if ( attributes.responsiveSettings.mobile.enabled ) {
        colClasses = `col-${attributes.responsiveSettings.mobile.gridCols} col-xl-${attributes.responsiveSettings.base.gridCols}`;
    } else {
        colClasses = `col-${attributes.responsiveSettings.base.gridCols} col-xl-${attributes.responsiveSettings.base.gridCols}`;
    }
    if ( attributes.responsiveSettings.tablet.enabled ) {
        colClasses += ` col-md-${attributes.responsiveSettings.tablet.gridCols}`;
    }
    if ( attributes.responsiveSettings.wide.enabled ) {
        colClasses += ` col-xxl-${attributes.responsiveSettings.wide.gridCols}`;
    }
    const blockProps = useBlockProps( { className: `${colClasses}` }, {} );
    const innerBlocksProps = useInnerBlocksProps( { className: 'method-advanced-grid-col-content' }, {} );

    const cssMap = {
        [`#block-${clientId} > .method-advanced-grid-col-content`]: ['padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'font-size', 'line-height'],
    };

	const update = useResponsiveSetter(attributes, setAttributes);
	return (
		<>
			<InspectorControls>
				<PanelBody title="Column Options">
					<PanelRow>
						<div style={{ width: '100%', marginBottom: '12px' }}>
						<RangeControl
							label="Grid Columns"
							value={attributes.responsiveSettings?.base?.gridCols}
							onChange={update('base', 'gridCols')}
							min={1}
							max={24}
						/>
						</div>
					</PanelRow>
				</PanelBody>
				<PanelBody title="Block Spacing" initialOpen={false}>
					<PanelRow>
						<MethodSpacingControls
							breakpoint="base"
							attributes={attributes}
							setAttributes={setAttributes}
							include={['padding', 'margin']}
							sides={{ gap: ['vertical'] }}
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
								<RangeControl
									label="Grid Columns"
									value={attributes.responsiveSettings?.mobile?.gridCols}
									onChange={update('mobile', 'gridCols')}
									min={1}
									max={24}
								/>
								<hr />
								<MethodSpacingControls
									breakpoint="mobile"
									attributes={attributes}
									setAttributes={setAttributes}
									include={['padding', 'margin']}
									sides={{ gap: ['vertical'] }}
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
								<RangeControl
									label="Grid Columns"
									value={attributes.responsiveSettings?.tablet?.gridCols}
									onChange={update('tablet', 'gridCols')}
									min={1}
									max={24}
								/>
								<hr />
								<MethodSpacingControls
									breakpoint="tablet"
									attributes={attributes}
									setAttributes={setAttributes}
									include={['padding', 'margin']}
									sides={{ gap: ['vertical'] }}
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
								<RangeControl
									label="Grid Columns"
									value={attributes.responsiveSettings?.wide?.gridCols}
									onChange={update('wide', 'gridCols')}
									min={1}
									max={24}
								/>
								<hr />
								<MethodSpacingControls
									breakpoint="wide"
									attributes={attributes}
									setAttributes={setAttributes}
									include={['padding', 'margin']}
									sides={{ gap: ['vertical'] }}
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