import { FontSizePicker, RangeControl } from '@wordpress/components';

export default function MethodTypographyControls({
	breakpoint,
	attributes,
	setAttributes
}) {
	const settings = attributes.responsiveSettings?.[breakpoint] || {};

	const updateSetting = (key, value) => {
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
			<div style={{ marginBottom: '12px' }}>
				<label style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', fontWeight: '500' }}>Font Size</label>
				<FontSizePicker
					value={settings.fontSize || ''}
					onChange={(val) => updateSetting('fontSize', val)}
					fontSizes={[
						{ name: 'Small', slug: 'small', size: '1rem' },
						{ name: 'Normal', slug: 'normal', size: '1.25rem' },
						{ name: 'Big', slug: 'big', size: '1.5rem' }
					]}
				/>
			</div>
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
					{ value: 2, label: '2' }
				]}
				step={0.05}
			/>
		</div>
	);
}