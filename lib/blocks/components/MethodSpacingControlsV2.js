/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
import { BoxControl, CheckboxControl, PanelRow, Button } from '@wordpress/components';
import MethodOptInControl from './MethodOptInControl';

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
		...(include.includes('padding') && {
			padding: { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
		}),
		...(include.includes('margin') && {
			margin: { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
		}),
		...(include.includes('gap') && {
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
		}),
	};

	const resetValues = resetDefaults || defaultReset;

	const updateSettings = (key, value, remove = false) => {
		if (remove) {
			const { [key]: _, ...remainingSettings } = settings;
			setAttributes({
				responsiveSettings: {
					...attributes.responsiveSettings,
					[breakpoint]: remainingSettings,
				},
			});
		} else {
			setAttributes({
				responsiveSettings: {
					...attributes.responsiveSettings,
					[breakpoint]: {
						...settings,
						[key]: value,
					},
				},
			});
		}
	};

	const negativeAllowed = settings.allowNegative || false;
	let spMin = null;
	let spMax = null;
	if (negativeAllowed) {
		spMin = -999;
		spMax = 999;
	}

	let isEnabled;
	if (breakpoint === 'base') {
		isEnabled = true;
	} else {
		isEnabled = attributes?.responsiveSettings?.[breakpoint]?.customSpacing;
	}

	return (
		<div style={{ width: '100%' }}>
			{breakpoint !== 'base' && (
				<PanelRow>
					<CheckboxControl
						label="Custom Spacing"
						checked={!!isEnabled}
						onChange={(value) =>
							updateSettings('customSpacing', value)
						}
						style={{ marginBottom: '0' }}
					/>
				</PanelRow>
			)}
			{include.includes('padding') && (
				<MethodOptInControl label="Padding" settingKey="padding" isEnabled={isEnabled} settings={settings} resetValue={resetValues.padding} updateSettings={updateSettings}>
					<BoxControl
						label="Padding"
						values={settings.padding || {}}
						allowReset={false}
						sides={sides.padding}
						resetValues={resetValues.padding}
						onChange={(value) => updateSettings('padding', value)}
					/>
				</MethodOptInControl>
			)}
			{include.includes('margin') && (
				<MethodOptInControl label="Margin" settingKey="margin" isEnabled={isEnabled} settings={settings} resetValue={resetValues.margin} updateSettings={updateSettings}>
					<BoxControl
						label="Margin"
						values={settings.margin || {}}
						allowReset={false}
						sides={sides.margin}
						resetValues={resetValues.margin}
						onChange={(value) => updateSettings('margin', value)}
					/>
				</MethodOptInControl>
			)}
			{include.includes('gap') && (
				<MethodOptInControl label="Gap" settingKey="gap" isEnabled={isEnabled} settings={settings} resetValue={resetValues.gap} updateSettings={updateSettings}>
					<BoxControl
						label="Block Gap"
						values={settings.gap || {}}
						splitOnAxis={true}
						sides={sides.gap}
						resetValues={resetValues.gap}
						onChange={(value) => updateSettings('gap', value)}
					/>
				</MethodOptInControl>
			)}
		</div>
	);
}
