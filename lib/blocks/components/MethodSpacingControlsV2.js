import { BoxControl } from '@wordpress/components';

export default function MethodSpacingControls({
	breakpoint,
	attributes,
	setAttributes,
	include = ['padding', 'margin', 'gap'],
	sides = {
		padding: ['top', 'bottom', 'left', 'right'],
		margin: ['top', 'bottom'],
		gap: ['horizontal', 'vertical']
	},
	resetDefaults
}) {
	const settings = attributes.responsiveSettings?.[breakpoint] || {};

	const defaultReset = {
		padding: { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
		margin: { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
		gap: sides.gap.includes('horizontal') && sides.gap.includes('vertical')
			? { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' }
			: sides.gap.includes('horizontal')
			? { left: '0rem', right: '0rem' }
			: { top: '0rem', bottom: '0rem' }
	};

	const resetValues = resetDefaults || defaultReset;

	const updateSettings = (key, value) => {
		setAttributes({
			responsiveSettings: {
				...attributes.responsiveSettings,
				[breakpoint]: {
					...settings,
					[key]: value
				}
			}
		});
	};

	return (
		<div style={{ width: '100%' }}>
			{include.includes('padding') && (
				<BoxControl
					label="Padding"
					values={settings.padding || {}}
					sides={sides.padding}
					resetValues={resetValues.padding}
					onChange={(value) => updateSettings('padding', value)}
				/>
			)}
			{include.includes('margin') && (
				<BoxControl
					label="Margin"
					inputProps={{ min: -200 }}
					values={settings.margin || {}}
					sides={sides.margin}
					resetValues={resetValues.margin}
					onChange={(value) => updateSettings('margin', value)}
				/>
			)}
			{include.includes('gap') && (
				<BoxControl
					label="Block Gap"
					values={settings.gap || {}}
					splitOnAxis={true}
					sides={sides.gap}
					resetValues={resetValues.gap}
					onChange={(value) => updateSettings('gap', value)}
				/>
			)}
		</div>
	);
}