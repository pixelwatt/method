import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';
import MethodResponsiveTabs from '../../../components/MethodResponsive';
import MethodSpacingControls from '../../../components/MethodSpacingControls';
import MethodTypographyControls from '../../../components/MethodTypographyControls';
import MethodStyleTag from '../../../components/MethodStyleTag';

export default function Edit({ attributes, setAttributes, clientId }) {
	if (!attributes.methodId) {
		setAttributes({ methodId: `method-${clientId}` });
	} else if (attributes.methodId !== `method-${clientId}`) {
		setAttributes({ methodId: `method-${clientId}` });
	}
	const { highlightGrid } = attributes;
	const ALLOWED_BLOCKS = ['method/advanced-grid-row'];
	const blockProps = useBlockProps(
		{
			className: `method-advanced-grid${highlightGrid ? ' method-structure-visible' : ''}`,
		},
		{}
	);
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'method-advanced-grid-rows' },
		{ allowedBlocks: ALLOWED_BLOCKS }
	);

	const cssMap = {
		[`#block-${clientId}`]: [
			'margin-top',
			'margin-bottom',
			'margin-left',
			'margin-right',
			'padding-top',
			'padding-bottom',
			'fontSize',
			'lineHeight',
			'textAlign',
		],
		[`#block-${clientId} > .row > .col-24 > .method-advanced-grid-rows`]: [
			'padding-left',
			'padding-right',
			'gapAsVars',
		],
	};
	return (
		<>
			<InspectorControls>
				<PanelBody title="Grid Utilities">
					<ToggleControl
						label="Highlight Grid Structure"
						help="Enabling this option will outline this grid and all contained rows, columns, and child grids. This setting has no impact on the live version of this page."
						checked={highlightGrid}
						onChange={(value) =>
							setAttributes({ highlightGrid: value })
						}
					/>
				</PanelBody>
				<MethodSpacingControls
					breakpoint="base"
					attributes={attributes}
					setAttributes={setAttributes}
					include={['padding', 'margin']}
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
								<MethodSpacingControls
									breakpoint="mobile"
									attributes={attributes}
									setAttributes={setAttributes}
									include={['padding', 'margin']}
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
								<MethodSpacingControls
									breakpoint="tablet"
									attributes={attributes}
									setAttributes={setAttributes}
									include={['padding', 'margin']}
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
								<MethodSpacingControls
									breakpoint="wide"
									attributes={attributes}
									setAttributes={setAttributes}
									include={['padding', 'margin']}
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
