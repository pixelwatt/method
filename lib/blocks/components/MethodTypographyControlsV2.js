import {
	FontSizePicker,
	RangeControl,
	CheckboxControl,
} from '@wordpress/components';

export default function MethodTypographyControls({
	breakpoint,
	attributes,
	setAttributes,
}) {
	const settings = attributes.responsiveSettings?.[breakpoint] || {};

	const updateSetting = (key, value) => {
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

	let isEnabled;
	if (breakpoint === 'base') {
		isEnabled = true;
	} else {
		isEnabled = attributes?.responsiveSettings?.[breakpoint]?.customType;
	}

	return (
		<div style={{ width: '100%' }}>
			{breakpoint !== 'base' && (
				<div style={{ width: '100%' }}>
					<CheckboxControl
						label="Custom Typography"
						checked={!!isEnabled}
						onChange={(value) => updateSetting('customType', value)}
					/>
				</div>
			)}
			{!!isEnabled && (
				<div style={{ marginBottom: '12px' }}>
					<label
						style={{
							display: 'block',
							marginBottom: '4px',
							textTransform: 'uppercase',
							fontSize: '11px',
							fontWeight: '500',
						}}
					>
						Font Size
					</label>
					<FontSizePicker
						value={settings.fontSize || ''}
						onChange={(val) => updateSetting('fontSize', val)}
						fontSizes={window?.methodGlobalData?.fontSizePresets}
					/>
				</div>
			)}
			{!!isEnabled && (
				<RangeControl
					label="Line Height"
					value={settings.lineHeight || ''}
					onChange={(val) => updateSetting('lineHeight', val)}
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
			)}
		</div>
	);
}
