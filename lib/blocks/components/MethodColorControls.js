// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { __experimentalPanelColorGradientSettings as PanelColorGradientSettings } from '@wordpress/block-editor';

export default function MethodColorControls({
	attributes,
	setAttributes,
	title = 'Color Settings',
	include = ['textColor', 'linkColor', 'bgColor', 'bgShadeColor'],
	labels = {},
}) {
	// Map of available color controls
	const allColorSettings = {
		textColor: {
			colorValue: attributes.textColor,
			onColorChange: (value) => setAttributes({ textColor: value }),
			label: 'Text',
		},
		linkColor: {
			colorValue: attributes.linkColor,
			onColorChange: (value) => setAttributes({ linkColor: value }),
			label: 'Link',
		},
		linkHoverColor: {
			colorValue: attributes.linkHoverColor,
			onColorChange: (value) => setAttributes({ linkHoverColor: value }),
			label: 'Link (Hover)',
		},
		linkActiveColor: {
			colorValue: attributes.linkActiveColor,
			onColorChange: (value) => setAttributes({ linkActiveColor: value }),
			label: 'Link (Active)',
		},
		bgColor: {
			colorValue: attributes.bgColor,
			gradientValue: attributes.bgGradient,
			onColorChange: (value) => setAttributes({ bgColor: value }),
			onGradientChange: (value) => setAttributes({ bgGradient: value }),
			label: 'Background',
		},
		bgShadeColor: {
			colorValue: attributes.bgShadeColor,
			gradientValue: attributes.bgShadeGradient,
			onColorChange: (value) => setAttributes({ bgShadeColor: value }),
			onGradientChange: (value) =>
				setAttributes({ bgShadeGradient: value }),
			label: 'Background Shade',
		},
	};

	// Filter only the ones specified in `include`, applying label overrides
	const colorSettings = include
		.filter((key) => allColorSettings[key])
		.map((key) => ({
			...allColorSettings[key],
			label: labels[key] || allColorSettings[key].label,
		}));

	return (
		<PanelColorGradientSettings
			title={title}
			initialOpen={false}
			enableAlpha={true}
			__experimentalIsRenderedInSidebar={true}
			settings={colorSettings}
		/>
	);
}
