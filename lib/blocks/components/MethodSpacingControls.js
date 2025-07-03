import { BoxControl } from '@wordpress/components';

export default function MethodSpacingControls ({ 
	prefix, 
	attributes, 
	setAttributes, 
	includeMargin = true, 
	includePadding = true, 
	includeGap = true,
	sidesPadding = ['top', 'bottom', 'left', 'right'],
	sidesMargin = ['top', 'bottom'],
	sidesGap = ['horizontal', 'vertical'],
	resetPaddingVals = { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
	resetMarginVals = { top: '0rem', bottom: '0rem' },
	resetGapVals = { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
}) {
	const paddingKey = `${prefix}Padding`;
	const marginKey = `${prefix}Margin`;
	const gapKey = `${prefix}Gap`;

	return (
		<div style={{ width: '100%' }}>
			{includePadding && (
				<div style={{ width: '100%', marginBottom: '12px' }} className="method-box-control-wrap">
					<BoxControl
						label="Padding"
						values={attributes[paddingKey]}
						onChange={(values) => setAttributes({ [paddingKey]: values })}
						sides={sidesPadding}
						resetValues={resetPaddingVals}
					/>
				</div>
			)}
			{includeMargin && (
				<div style={{ width: '100%', marginBottom: '12px' }} className="method-box-control-wrap">
					<BoxControl
						label="Margin"
						values={attributes[marginKey]}
						onChange={(values) => setAttributes({ [marginKey]: values })}
						sides={sidesMargin}
						resetValues={resetMarginVals}
					/>
				</div>
			)}
			{includeGap && (
				<div style={{ width: '100%', marginBottom: '12px' }} className="method-box-control-wrap">
					<BoxControl
						label="Block Gap"
						values={attributes[gapKey]}
						onChange={(values) => setAttributes({ [gapKey]: values })}
						splitOnAxis={true}
						sides={sidesGap}
						resetValues={resetGapVals}
					/>
				</div>
			)}
		</div>
	);
};