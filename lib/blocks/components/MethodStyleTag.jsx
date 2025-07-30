/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
// ResponsiveStyleTag.jsx
import { useEffect, useRef } from 'react';
const getBreakpoints = () => window?.methodGlobalData?.breakpoints || {};

const cssPropertyMap = {
	fontSize: 'font-size',
	lineHeight: 'line-height',
	// Add more as needed
};

function generateCSS(properties) {
	return Object.entries(properties)
		.map(([prop, val]) => {
			if (val == null) return '';

			const cssProp = cssPropertyMap[prop] || prop; // fallback to original if not mapped
			return `${cssProp}: ${val};`;
		})
		.join(' ');
}

function getBreakpointStyle(
	responsiveSettings,
	selectorMap,
	breakpoint,
	attributes = {}
) {
	let css = '';
	const settings = responsiveSettings?.[breakpoint] || {};
	if (!settings.enabled && breakpoint !== 'base') return '';

	Object.entries(selectorMap).forEach(([selector, props]) => {
		const styleProps = {};
		props.forEach((prop) => {
			if (prop === 'borderRadius') {
				if (settings.borderRadius?.topLeft) {
					styleProps['border-top-left-radius'] =
						settings.borderRadius.topLeft;
					styleProps['border-top-right-radius'] =
						settings.borderRadius.topRight;
					styleProps['border-bottom-left-radius'] =
						settings.borderRadius.bottomLeft;
					styleProps['border-bottom-right-radius'] =
						settings.borderRadius.bottomRight;
				} else if (settings?.borderRadius) {
					styleProps['border-radius'] = settings.borderRadius;
				} else {
				}
			} else if (prop === 'border') {
				if (settings.border?.width) {
					styleProps['border'] =
						`${settings.border.width} ${settings.border?.style ? settings.border.style : 'solid'} ${settings.border?.color ? settings.border.color : ''}`;
				} else if (settings.border?.top) {
					if (settings.border.top?.width) {
						styleProps['border-top'] =
							`${settings.border.top.width} ${settings.border.top?.style ? settings.border.top.style : 'solid'} ${settings.border.top?.color ? settings.border.top.color : ''}`;
					}
					if (settings.border.bottom?.width) {
						styleProps['border-bottom'] =
							`${settings.border.bottom.width} ${settings.border.bottom?.style ? settings.border.bottom.style : 'solid'} ${settings.border.bottom?.color ? settings.border.bottom.color : ''}`;
					}
					if (settings.border.left?.width) {
						styleProps['border-left'] =
							`${settings.border.left.width} ${settings.border.left?.style ? settings.border.left.style : 'solid'} ${settings.border.left?.color ? settings.border.left.color : ''}`;
					}
					if (settings.border.right?.width) {
						styleProps['border-right'] =
							`${settings.border.right.width} ${settings.border.right?.style ? settings.border.right.style : 'solid'} ${settings.border.right?.color ? settings.border.right.color : ''}`;
					}
				}
			} else if (
				prop === 'textColor' ||
				prop === 'linkColor' ||
				prop === 'bgColor' ||
				prop === 'bgShade' ||
				prop === 'bgAlign'
			) {
				if (breakpoint === 'base') {
					if (prop === 'textColor' && attributes.textColor) {
						styleProps['color'] = attributes.textColor;
					}
					if (prop === 'linkColor' && attributes.linkColor) {
						styleProps['color'] = attributes.linkColor;
					}
					if (prop === 'bgColor') {
						const bg = attributes.bgGradient || attributes.bgColor;
						if (bg) {
							styleProps['background'] = bg;
						}
					}
					if (prop === 'bgShade') {
						const shade =
							attributes.bgShadeGradient ||
							attributes.bgShadeColor;
						if (shade) {
							styleProps['background'] = shade;
						}
					}
					if (prop === 'bgAlign' && attributes.bgImgAlign) {
						styleProps['object-position'] = attributes.bgImgAlign
							.split(' ')
							.reverse()
							.join(' ');
					}
				}
			} else if (prop === 'gapAsVars') {
				if (settings.gap?.top)
					styleProps['--bs-gutter-y'] = settings.gap.top;
				if (settings.gap?.left || settings.gap?.right)
					styleProps['--bs-gutter-x'] =
						settings.gap.left || settings.gap.right;
			} else {
				const value = (() => {
					if (prop in settings) return settings[prop];
					const match = prop.match(
						/^(padding|margin)-(top|bottom|left|right)$/
					);
					if (match) return settings[match[1]]?.[match[2]] ?? '0';
					return null;
				})();
				if (value != null) styleProps[prop] = value;
			}
		});
		// Base-only color logic

		if (Object.keys(styleProps).length) {
			css += `${selector} { ${generateCSS(styleProps)} }\n`;
		}
	});

	return css;
}

export default function MethodStyleTag({ clientId, attributes, selectorMap }) {
	const styleRef = useRef();
	const breakpoints = getBreakpoints();
	const responsive = attributes.responsiveSettings || {};
	const atts = attributes;

	useEffect(() => {
		let css = '';
		css += getBreakpointStyle(responsive, selectorMap, 'base', atts);
		if (responsive.mobile?.enabled) {
			css += `@media(max-width: ${breakpoints.mobile_max}) {\n`;
			css += getBreakpointStyle(responsive, selectorMap, 'mobile', atts);
			css += '}\n';
		}
		if (responsive.tablet?.enabled) {
			css += `@media(min-width: ${breakpoints.tablet_min}) and (max-width: ${breakpoints.tablet_max}) {\n`;
			css += getBreakpointStyle(responsive, selectorMap, 'tablet', atts);
			css += '}\n';
		}
		if (responsive.wide?.enabled) {
			css += `@media(min-width: ${breakpoints.wide_min}) {\n`;
			css += getBreakpointStyle(responsive, selectorMap, 'wide', atts);
			css += '}\n';
		}

		if (styleRef.current) {
			styleRef.current.innerHTML = css;
		}
	}, [attributes]);

	return <style ref={styleRef} data-method-id={clientId} />;
}
