/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
import {
	BoxControl,
	CheckboxControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

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
						top: '1.5rem',
						bottom: '1.5rem',
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

	const updateMultipleSettings = (updates) => {
		// updates: array of { key, value, remove? }
		const updated = { ...settings };
		updates.forEach(({ key, value, remove }) => {
			if (remove) {
				delete updated[key];
			} else {
				updated[key] = value;
			}
		});
		setAttributes({
			responsiveSettings: {
				...attributes.responsiveSettings,
				[breakpoint]: updated,
			},
		});
	};

	const resetAll = () => {
		const keysToRemove = ['padding', 'margin', 'gap', 'allowNegative'];
		const remaining = Object.fromEntries(
			Object.entries(settings).filter(([key]) => !keysToRemove.includes(key))
		);
		setAttributes({
			responsiveSettings: {
				...attributes.responsiveSettings,
				[breakpoint]: remaining,
			},
		});
	};

	// Full-width blocks should only allow top/bottom margins
	const effectiveMarginSides = attributes.align === 'full'
		? sides.margin.filter((s) => s === 'top' || s === 'bottom')
		: sides.margin;
	const showMargin = include.includes('margin') && effectiveMarginSides.length > 0;

	const negativeAllowed = settings.allowNegative || false;
	let spMin = null;
	let spMax = null;
	if (negativeAllowed) {
		spMin = -999;
		spMax = 999;
	}
	return (
		<div className='method-control-set' style={{ width: '100%' }}>
			<ToolsPanel label="Block Spacing" resetAll={resetAll}>
				{include.includes('padding') && (
					<ToolsPanelItem
						label="Padding"
						hasValue={() => settings.padding !== undefined}
						onDeselect={() => updateSettings('padding', undefined, true)}
						onSelect={() => updateSettings('padding', resetValues.padding)}
					>
						<BoxControl
							label="Padding"
							values={settings.padding || {}}
							allowReset={false}
							sides={sides.padding}
							resetValues={resetValues.padding}
							onChange={(value) => updateSettings('padding', value)}
						/>
					</ToolsPanelItem>
				)}
				{showMargin && (
					<ToolsPanelItem
						label="Margin"
						hasValue={() => settings.margin !== undefined}
						onDeselect={() => updateMultipleSettings([
							{ key: 'margin', remove: true },
							{ key: 'allowNegative', remove: true },
						])}
						onSelect={() => updateMultipleSettings([
							{ key: 'margin', value: resetValues.margin },
							{ key: 'allowNegative', value: false },
						])}
					>
						<BoxControl
							label="Margin"
							inputProps={{ min: spMin, max: spMax }}
							values={settings.margin || {}}
							allowReset={false}
							sides={effectiveMarginSides}
							resetValues={resetValues.margin}
							onChange={(value) => updateSettings('margin', value)}
						/>
						<div style={{ marginTop: '16px' }} className="method-margin-options-wrap">
							<CheckboxControl
								label="Allow Negative Values"
								checked={negativeAllowed}
								onChange={(value) => updateSettings('allowNegative', value)}
							/>
						</div>
					</ToolsPanelItem>
				)}
				{include.includes('gap') && (
					<ToolsPanelItem
						label="Gap"
						hasValue={() => settings.gap !== undefined}
						onDeselect={() => updateSettings('gap', undefined, true)}
						onSelect={() => updateSettings('gap', resetValues.gap)}
					>
						<BoxControl
							label="Block Gap"
							values={settings.gap || {}}
							allowReset={false}
							splitOnAxis={true}
							sides={sides.gap}
							resetValues={resetValues.gap}
							onChange={(value) => updateSettings('gap', value)}
						/>
					</ToolsPanelItem>
				)}
			</ToolsPanel>
		</div>
	);
}