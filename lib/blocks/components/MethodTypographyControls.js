import {
	__experimentalFontFamilyControl as FontFamilyControl,
	__experimentalFontAppearanceControl as FontAppearanceControl,
	__experimentalTextTransformControl as TextTransformControl,
	__experimentalLetterSpacingControl as LetterSpacingControl,
	useSettings,
} from '@wordpress/block-editor';
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
	include = ['fontSize', 'lineHeight', 'textAlign'],
}) {
	const settings = attributes.responsiveSettings?.[breakpoint] || {};

	// `typography.fontFamilies` resolves to an origins object
	// ({ default, theme, custom }) rather than a flat array, so merge the
	// origins here the same way core's typography panel does.
	const [fontFamiliesCustom, fontFamiliesTheme, fontFamiliesDefault] =
		useSettings(
			'typography.fontFamilies.custom',
			'typography.fontFamilies.theme',
			'typography.fontFamilies.default'
		);
	const fontFamilies = [
		...(fontFamiliesCustom ?? []),
		...(fontFamiliesTheme ?? []),
		...(fontFamiliesDefault ?? []),
	];

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
		const keysToRemove = ['fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'lineHeight', 'textAlign', 'textTransform', 'letterSpacing'];
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
				{include.includes('fontFamily') && (
					<ToolsPanelItem
						label="Font Family"
						hasValue={() => settings.fontFamily !== undefined}
						onDeselect={() =>
							updateSettings('fontFamily', undefined, true)
						}
						onSelect={() => updateSettings('fontFamily', '')}
					>
						<FontFamilyControl
							value={settings.fontFamily || ''}
							onChange={(val) => updateSettings('fontFamily', val)}
							fontFamilies={fontFamilies}
						/>
					</ToolsPanelItem>
				)}
				{include.includes('fontAppearance') && (
					<ToolsPanelItem
						label="Font Appearance"
						hasValue={() => settings.fontStyle !== undefined}
						onDeselect={() => updateMultipleSettings([
							{ key: 'fontStyle', remove: true },
							{ key: 'fontWeight', remove: true },
						])}
						onSelect={() => updateMultipleSettings([
							{ key: 'fontStyle', value: '' },
							{ key: 'fontWeight', value: '' },
						])}
					>
						<FontAppearanceControl
							value={{
								fontStyle: settings.fontStyle,
								fontWeight: settings.fontWeight,
							}}
							onChange={({ fontStyle, fontWeight }) =>
								updateMultipleSettings([
									{ key: 'fontStyle', value: fontStyle },
									{ key: 'fontWeight', value: fontWeight },
								])
							}
							hasFontStyles={true}
							hasFontWeights={true}
						/>
					</ToolsPanelItem>
				)}
				{include.includes('fontSize') && (
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
				)}
				{include.includes('lineHeight') && (
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
				)}
				{include.includes('textAlign') && (
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
				)}
				{include.includes('textTransform') && (
					<ToolsPanelItem
						label="Letter Case"
						hasValue={() => settings.textTransform !== undefined}
						onDeselect={() =>
							updateSettings('textTransform', undefined, true)
						}
						onSelect={() => updateSettings('textTransform', '')}
					>
						<TextTransformControl
							value={settings.textTransform || ''}
							onChange={(val) => updateSettings('textTransform', val)}
						/>
					</ToolsPanelItem>
				)}
				{include.includes('letterSpacing') && (
					<ToolsPanelItem
						label="Letter Spacing"
						hasValue={() => settings.letterSpacing !== undefined}
						onDeselect={() =>
							updateSettings('letterSpacing', undefined, true)
						}
						onSelect={() => updateSettings('letterSpacing', '')}
					>
						<LetterSpacingControl
							value={settings.letterSpacing || ''}
							onChange={(val) => updateSettings('letterSpacing', val)}
						/>
					</ToolsPanelItem>
				)}
			</ToolsPanel>
		</div>
	);
}
