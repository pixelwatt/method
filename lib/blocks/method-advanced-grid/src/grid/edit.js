import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow } from '@wordpress/components';
import MethodResponsive from '../../../components/MethodResponsiveV2';
import MethodSpacingControls from '../../../components/MethodSpacingControlsV2';
import MethodTypographyControls from '../../../components/MethodTypographyControlsV2';
import MethodStyleTag from '../../../components/MethodStyleTag';

export default function Edit({ attributes, setAttributes, clientId }) {
	const ALLOWED_BLOCKS = ['method/advanced-grid-row'];
	const blockProps = useBlockProps({ className: 'method-advanced-grid' }, {});
	const innerBlocksProps = useInnerBlocksProps({ className: 'method-advanced-grid-rows' }, { allowedBlocks: ALLOWED_BLOCKS });

    const cssMap = {
        [`#block-${clientId}`]: ['margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'padding-top', 'padding-bottom', 'font-size', 'line-height'],
        [`#block-${clientId} > .row > .col-24 > .method-advanced-grid-rows`]: ['padding-left', 'padding-right', 'gapAsVars'],
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
				<div className="row g-0">
					<div className="col-24">
						<div {...innerBlocksProps} />
					</div>
				</div>
			</div>
            <MethodStyleTag
                clientId={clientId}
                attributes={attributes}
                selectorMap={cssMap}
            />
		</>
	);
}