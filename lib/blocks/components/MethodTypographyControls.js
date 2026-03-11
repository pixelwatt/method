import {
	FontSizePicker,
	RangeControl,
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

export default function MethodTypographyControls({
	breakpoint,
	attributes,
	setAttributes,
}) {
	const settings = attributes.responsiveSettings?.[breakpoint] || {};

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

	const resetAll = () => {
		const keysToRemove = ['fontSize', 'lineHeight', 'textAlign'];
		const remaining = Object.fromEntries(
			Object.entries(settings).filter(
				([key]) => !keysToRemove.includes(key)
			)
		);
		setAttributes({
			responsiveSettings: {
				...attributes.responsiveSettings,
				[breakpoint]: remaining,
			},
		});
	};

	return (
		<div className="method-control-set" style={{ width: '100%' }}>
			<ToolsPanel label="Typography" resetAll={resetAll}>
					<ToolsPanelItem
						label="Font Size"
						hasValue={() => settings.fontSize !== undefined}
						onDeselect={() =>
							updateSettings('fontSize', undefined, true)
						}
						onSelect={() => updateSettings('fontSize', '')}
					>
						<FontSizePicker
							value={settings.fontSize || ''}
							onChange={(val) => updateSettings('fontSize', val)}
							fontSizes={
								window?.methodGlobalData?.fontSizePresets
							}
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						label="Line Height"
						hasValue={() => settings.lineHeight !== undefined}
						onDeselect={() =>
							updateSettings('lineHeight', undefined, true)
						}
						onSelect={() => updateSettings('lineHeight', 1.55)}
					>
						<RangeControl
							label="Line Height"
							value={settings.lineHeight || ''}
							onChange={(val) =>
								updateSettings('lineHeight', val)
							}
							initialPosition={1.55}
							max={2}
							min={0.75}
							withInputField
							marks={[
								{ value: 1, label: '1' },
								{ value: 1.5, label: '1.5' },
								{ value: 2, label: '2' },
							]}
							step={0.05}
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						label="Text Alignment"
						hasValue={() =>
							settings.textAlign !== undefined &&
							settings.textAlign !== ''
						}
						onDeselect={() =>
							updateSettings('textAlign', undefined, true)
						}
						onSelect={() => updateSettings('textAlign', '')}
					>
						<SelectControl
							label="Text Alignment"
							value={settings?.textAlign || ''}
							onChange={(val) => updateSettings('textAlign', val)}
							options={[
								{ label: 'Inherit', value: '' },
								{ label: 'Left', value: 'start' },
								{ label: 'Center', value: 'center' },
								{ label: 'Right', value: 'end' },
								{ label: 'Justify', value: 'justify' },
							]}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
		</div>
	);
}
