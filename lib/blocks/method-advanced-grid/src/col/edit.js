import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import MethodResponsiveTabs from '../../../components/MethodResponsiveV2';
import MethodSpacingControls from '../../../components/MethodSpacingControlsV2';
import MethodTypographyControls from '../../../components/MethodTypographyControlsV2';
import MethodColorControls from '../../../components/MethodColorControls';
import MethodStyleTag from '../../../components/MethodStyleTag';
import useResponsiveSetter from '../../../hooks/useResponsiveSetter';

export default function Edit({ attributes, setAttributes, clientId }) {
	const baseCols = attributes.responsiveSettings.base?.gridCols || 8;
	const baseOffset = attributes.responsiveSettings.base?.offset || 0;
	const colClasses = Object.entries(methodGlobalData.breakpointPrefixes || [])
		.map(([range, prefix]) => {
			let breakpointCols = '';
			let breakpointOffset = '';
			if (
				'base' != range &&
				!!attributes.responsiveSettings[range]?.enabled
			) {
				breakpointCols =
					attributes.responsiveSettings[range]?.gridCols || baseCols;
				breakpointOffset =
					attributes.responsiveSettings[range]?.offset || baseOffset;
			} else {
				breakpointCols = baseCols;
				breakpointOffset = baseOffset;
			}
			if ('mobile' == range) {
				return ` col-${breakpointCols} offset-${breakpointOffset}`;
			}
			return ` col-${prefix}-${breakpointCols} offset-${prefix}-${breakpointOffset}`;
		})
		.join('');

	const blockProps = useBlockProps({ className: `${colClasses}` }, {});
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'method-advanced-grid-col-content' },
		{}
	);

	const cssMap = {
		[`#block-${clientId}`]: ['order'],
		[`#block-${clientId} > .method-advanced-grid-col-content`]: [
			'textColor',
			'padding-left',
			'padding-right',
			'padding-top',
			'padding-bottom',
			'fontSize',
			'lineHeight',
			'textAlign',
		],
		[`#block-${clientId} > .method-advanced-grid-col-content a`]: [
			'linkColor',
		],
	};

	const gridMarks = [
		{
			value: 2,
			label: '',
		},
		{
			value: 4,
			label: '',
		},
		{
			value: 6,
			label: '6',
		},
		{
			value: 8,
			label: '',
		},
		{
			value: 10,
			label: '',
		},
		{
			value: 12,
			label: '12',
		},
		{
			value: 14,
			label: '',
		},
		{
			value: 16,
			label: '',
		},
		{
			value: 18,
			label: '18',
		},
		{
			value: 20,
			label: '',
		},
		{
			value: 22,
			label: '',
		},
		{
			value: 24,
			label: '24',
		},
	];
	//console.log(methodGlobalData.breakpointPrefixes);
	/*
		<PanelRow>
			<div style={{ width: '100%', marginBottom: '12px' }}>
				<TextControl
					label="(Optional) Column Order"
					type="number"
					value={
						attributes.responsiveSettings?.base?.order
					}
					onChange={update('base', 'order')}
				/>
			</div>
		</PanelRow>
	*/
	const update = useResponsiveSetter(attributes, setAttributes);
	return (
		<>
			<InspectorControls>
				<PanelBody title="Column Options">
					<PanelRow>
						<div style={{ width: '100%', marginBottom: '12px' }}>
							<RangeControl
								label="Grid Columns"
								value={
									attributes.responsiveSettings?.base
										?.gridCols
								}
								onChange={update('base', 'gridCols')}
								min={1}
								max={24}
								marks={gridMarks}
							/>
						</div>
					</PanelRow>
					<PanelRow>
						<div style={{ width: '100%', marginBottom: '12px' }}>
							<RangeControl
								label="Offset"
								value={
									attributes.responsiveSettings?.base
										?.offset || 0
								}
								onChange={update('base', 'offset')}
								min={0}
								max={24}
								marks={gridMarks}
							/>
						</div>
					</PanelRow>
				</PanelBody>
				<PanelBody title="Block Spacing" initialOpen={false}>
					<MethodSpacingControls
						breakpoint="base"
						attributes={attributes}
						setAttributes={setAttributes}
						include={['padding', 'margin']}
						sides={{
							padding: ['top', 'bottom', 'left', 'right'],
							margin: ['top', 'bottom'],
							gap: ['horizontal', 'vertical'],
						}}
					/>
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
				<MethodColorControls
					attributes={attributes}
					setAttributes={setAttributes}
					include={['textColor', 'linkColor']}
				/>
				<MethodResponsiveTabs
					attributes={attributes}
					setAttributes={setAttributes}
					renderControls={{
						mobile: (
							<>
								<div
									style={{
										width: '100%',
										marginBottom: '12px',
									}}
								>
									<RangeControl
										label="Grid Columns"
										value={
											attributes.responsiveSettings
												?.mobile?.gridCols
										}
										onChange={update('mobile', 'gridCols')}
										min={1}
										max={24}
										marks={gridMarks}
									/>
								</div>
								<div
									style={{
										width: '100%',
										marginBottom: '12px',
									}}
								>
									<RangeControl
										label="Offset"
										value={
											attributes.responsiveSettings
												?.mobile?.offset || 0
										}
										onChange={update('mobile', 'offset')}
										min={0}
										max={24}
										marks={gridMarks}
									/>
								</div>
								<div
									style={{
										width: '100%',
										marginBottom: '12px',
									}}
								>
									<TextControl
										label="(Optional) Column Order"
										type="number"
										value={
											attributes.responsiveSettings
												?.mobile?.order
										}
										onChange={update('mobile', 'order')}
									/>
								</div>
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
								<div
									style={{
										width: '100%',
										marginBottom: '12px',
									}}
								>
									<RangeControl
										label="Grid Columns"
										value={
											attributes.responsiveSettings
												?.tablet?.gridCols
										}
										onChange={update('tablet', 'gridCols')}
										min={1}
										max={24}
										marks={gridMarks}
									/>
								</div>
								<div
									style={{
										width: '100%',
										marginBottom: '12px',
									}}
								>
									<RangeControl
										label="Offset"
										value={
											attributes.responsiveSettings
												?.tablet?.offset || 0
										}
										onChange={update('tablet', 'offset')}
										min={0}
										max={24}
										marks={gridMarks}
									/>
								</div>
								<div
									style={{
										width: '100%',
										marginBottom: '12px',
									}}
								>
									<TextControl
										label="(Optional) Column Order"
										type="number"
										value={
											attributes.responsiveSettings
												?.tablet?.order
										}
										onChange={update('tablet', 'order')}
									/>
								</div>
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
								<div
									style={{
										width: '100%',
										marginBottom: '12px',
									}}
								>
									<RangeControl
										label="Grid Columns"
										value={
											attributes.responsiveSettings?.wide
												?.gridCols
										}
										onChange={update('wide', 'gridCols')}
										min={1}
										max={24}
										marks={gridMarks}
									/>
								</div>
								<div
									style={{
										width: '100%',
										marginBottom: '12px',
									}}
								>
									<RangeControl
										label="Offset"
										value={
											attributes.responsiveSettings?.wide
												?.offset || 0
										}
										onChange={update('wide', 'offset')}
										min={0}
										max={24}
										marks={gridMarks}
									/>
								</div>
								<div
									style={{
										width: '100%',
										marginBottom: '12px',
									}}
								>
									<TextControl
										label="(Optional) Column Order"
										type="number"
										value={
											attributes.responsiveSettings?.wide
												?.order
										}
										onChange={update('wide', 'order')}
									/>
								</div>
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
				<MethodStyleTag
					clientId={clientId}
					attributes={attributes}
					selectorMap={cssMap}
				/>
			</div>
		</>
	);
}
