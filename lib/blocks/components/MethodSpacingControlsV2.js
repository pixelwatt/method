/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
import { BoxControl, CheckboxControl, PanelRow } from '@wordpress/components';

export default function MethodSpacingControls({
	breakpoint,
	attributes,
	setAttributes,
	include = ['padding', 'margin', 'gap'],
	sides = {
		padding: ['top', 'bottom', 'left', 'right'],
		margin: ['top', 'bottom'],
		gap: ['horizontal', 'vertical'],
	},
	resetDefaults,
}) {
	const settings = attributes.responsiveSettings?.[breakpoint] || {};

	const defaultReset = {
		padding: { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
		margin: { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
		gap:
			sides.gap.includes('horizontal') && sides.gap.includes('vertical')
				? {
					top: '0rem',
					bottom: '0rem',
					left: '1.5rem',
					right: '1.5rem',
				}
				: sides.gap.includes('horizontal')
					? { left: '1.5rem', right: '1.5rem' }
					: { top: '0rem', bottom: '0rem' },
	};

	const resetValues = resetDefaults || defaultReset;

	const updateSettings = (key, value) => {
		setAttributes({
			responsiveSettings: {
				...attributes.responsiveSettings,
				[breakpoint]: {
					...settings,
					[key]: value,
				},
			},
		});
	};

	const negativeAllowed = settings.allowNegative || false;
	let spMin = null;
	let spMax = null;
	if (negativeAllowed) {
		spMin = -999;
		spMax = 999;
	}

	return (
		<>
			{include.includes('padding') && (
				<PanelRow>
					<div
						style={{
							width: '100%',
							marginTop: '12px',
							marginBottom: '12px',
						}}
						className="method-box-control-wrap"
					>
						<BoxControl
							label="Padding"
							values={settings.padding || {}}
							sides={sides.padding}
							resetValues={resetValues.padding}
							onChange={(value) =>
								updateSettings('padding', value)
							}
						/>
					</div>
				</PanelRow>
			)}
			{include.includes('margin') && (
				<PanelRow>
					<div
						style={{
							width: '100%',
							marginTop: '12px',
							marginBottom: '12px',
						}}
						className="method-box-control-wrap"
					>
						<BoxControl
							label="Margin"
							inputProps={{ min: spMin, max: spMax }}
							values={settings.margin || {}}
							sides={sides.margin}
							resetValues={resetValues.margin}
							onChange={(value) =>
								updateSettings('margin', value)
							}
						/>
						<div
							style={{ marginTop: '16px' }}
							className="method-margin-options-wrap"
						>
							<CheckboxControl
								label="Allow Negative Values"
								checked={settings.allowNegative || false}
								onChange={(value) =>
									updateSettings('allowNegative', value)
								}
							/>
						</div>
					</div>
				</PanelRow>
			)}
			{include.includes('gap') && (
				<PanelRow>
					<div
						style={{
							width: '100%',
							marginTop: '12px',
							marginBottom: '12px',
						}}
						className="method-box-control-wrap"
					>
						<BoxControl
							label="Block Gap"
							values={settings.gap || {}}
							splitOnAxis={true}
							sides={sides.gap}
							resetValues={resetValues.gap}
							onChange={(value) => updateSettings('gap', value)}
						/>
					</div>
				</PanelRow>
			)}
		</>
	);
}
