// ResponsiveStyleTag.jsx
import { useEffect, useRef } from 'react';
const getBreakpoints = () => window?.methodGlobalData?.breakpoints || {};

function generateCSS(properties, values) {
	return Object.entries(properties)
		.map(([prop, val]) => (val != null ? `${prop}: ${val};` : ''))
		.filter(Boolean)
		.join(' ');
}

function getBreakpointStyle(responsiveSettings, selectorMap, breakpoint) {
	let css = '';
	const settings = responsiveSettings?.[breakpoint] || {};
	if (!settings.enabled && breakpoint !== 'base') return '';

	Object.entries(selectorMap).forEach(([selector, props]) => {
		const styleProps = {};
		props.forEach((prop) => {
			if (prop === 'gapAsVars') {
				if (settings.gap?.top) styleProps['--bs-gutter-y'] = settings.gap.top;
				if (settings.gap?.left || settings.gap?.right) styleProps['--bs-gutter-x'] = settings.gap.left || settings.gap.right;
			} else {
				const value = (() => {
					if (prop in settings) return settings[prop];
					const match = prop.match(/^(padding|margin)-(top|bottom|left|right)$/);
					if (match && settings[match[1]]) return settings[match[1]][match[2]];
					return null;
				})();
				if (value != null) styleProps[prop] = value;
			}
		});
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

	useEffect(() => {
		let css = '';
		css += getBreakpointStyle(responsive, selectorMap, 'base');
		if (responsive.mobile?.enabled) {
			css += `@media(max-width: ${breakpoints.mobile_max}) {\n`;
			css += getBreakpointStyle(responsive, selectorMap, 'mobile');
			css += '}\n';
		}
		if (responsive.tablet?.enabled) {
			css += `@media(min-width: ${breakpoints.tablet_min}) and (max-width: ${breakpoints.tablet_max}) {\n`;
			css += getBreakpointStyle(responsive, selectorMap, 'tablet');
			css += '}\n';
		}
		if (responsive.wide?.enabled) {
			css += `@media(min-width: ${breakpoints.wide_min}) {\n`;
			css += getBreakpointStyle(responsive, selectorMap, 'wide');
			css += '}\n';
		}

		if (styleRef.current) {
			styleRef.current.innerHTML = css;
		}
	}, [attributes.responsiveSettings]);

	return <style ref={styleRef} data-method-id={clientId} />;
}
