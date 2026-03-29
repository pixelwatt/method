/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
// ResponsiveStyleTag.jsx
import { useEffect, useRef } from 'react';
import { useFeaturedImageSizes } from './MethodUseFeaturedImage';
const getBreakpoints = () => window?.methodGlobalData?.breakpoints || {};

const cssPropertyMap = {
	fontSize: 'font-size',
	lineHeight: 'line-height',
	textAlign: 'text-align',
	minHeight: 'min-height',
	minWidth: 'min-width',
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
	attributes = {},
	postId = null,
	postType = null,
	featuredImageSizes = null
) {
	let css = '';
	const settings = responsiveSettings?.[breakpoint] || {};
	if (!settings.enabled && breakpoint !== 'base') return '';

	Object.entries(selectorMap).forEach(([selector, props]) => {
		const styleProps = {};
		props.forEach((prop) => {
			if (
				prop === 'aspectRatio' &&
				breakpoint === 'base' &&
				!!settings.aspectUses
			) {
				if (settings.aspectUses === 'height') {
					if (!!settings.height) {
						styleProps['height'] = settings.height;
						styleProps['padding-top'] = '0';
					}
				}
				if (settings.aspectUses === 'percentage') {
					if (!!settings.aspectPercentage) {
						styleProps['padding-top'] = settings.aspectPercentage;
						styleProps['height'] = '0';
					}
				}
			} else if (prop === 'boxShadow') {
				if (breakpoint === 'base') {
					const shadowList = settings.shadows || [];
					if (shadowList.length > 0) {
						styleProps['box-shadow'] = shadowList
							.map((s) => {
								const {
									x = 0,
									y = 0,
									blur = 0,
									spread = 0,
									color = 'rgba(0,0,0,0)',
									inset = false,
								} = s;
								return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${color}`;
							})
							.join(', ');
					}
				}
			} else if (
				prop === 'bgPosition' ||
				prop === 'bgSize' ||
				prop === 'bgRepeat' ||
				prop === 'bgImg'
			) {
				if (breakpoint === 'base' || settings?.customBg === true) {
					if (prop === 'bgPosition') {
						const alignDefault = 'center center';
						const [yAlign, xAlign] = (
							settings?.bgImgAlign || alignDefault
						).split(' ');
						const xOffset = settings?.bgOffsetX || '';
						const yOffset = settings?.bgOffsetY || '';
						styleProps['background-position'] =
							`${xAlign} ${xOffset} ${yAlign} ${yOffset}`;
					}
					if (prop === 'bgImg') {
						if (attributes?.useFeaturedImage === true) {
							const fiSize =
								settings?.featuredImageSize || 'large';
							const fiUrl =
								featuredImageSizes?.[fiSize] ||
								featuredImageSizes?.full;
							if (fiUrl) {
								styleProps['background-image'] =
									`url("${fiUrl}")`;
							}
						} else {
							const chosenSize = settings?.bgImgSize;
							if (
								!!chosenSize &&
								!!attributes?.bgImg?.[chosenSize]?.url
							) {
								styleProps['background-image'] =
									`url("${attributes.bgImg[chosenSize].url}")`;
							}
						}
					}
					if (prop === 'bgSize') {
						if (
							settings?.bgDisplaySize === 'contain' ||
							settings?.bgDisplaySize === 'cover'
						) {
							styleProps['background-size'] =
								settings.bgDisplaySize;
						} else if (settings?.bgDisplaySize === 'custom') {
							const bgWidth = settings?.bgWidth || '';
							const bgHeight = settings?.bgHeight || '';
							if (
								!!bgHeight &&
								!!bgWidth &&
								!bgHeight.startsWith('0') &&
								!bgWidth.startsWith('0')
							) {
								styleProps['background-size'] =
									`${bgWidth} ${bgHeight}`;
							}
						}
					}
					if (prop === 'bgRepeat') {
						if (!!settings?.bgRepeat) {
							styleProps['background-repeat'] = settings.bgRepeat;
						} else {
							styleProps['background-repeat'] = 'no-repeat';
						}
					}
				}
			} else if (
				prop === 'order' &&
				settings?.order &&
				!settings?.order.startsWith('0')
			) {
				styleProps['order'] = settings.order;
			} else if (
				prop === 'equalDimensions' &&
				settings?.dimensions &&
				!settings?.dimensions.startsWith('0')
			) {
				styleProps['width'] = settings.dimensions;
				styleProps['height'] = settings.dimensions;
			} else if (
				prop === 'justifyContent' ||
				prop === 'alignItems' ||
				prop === 'flexDirection' ||
				prop === 'overflow' ||
				prop === 'zIndex' ||
				prop === 'flexGrow' ||
				prop === 'flexShrink' ||
				prop === 'flexBasis'
			) {
				if (prop === 'justifyContent' && settings?.justifyContent) {
					styleProps['justify-content'] = settings.justifyContent;
				}
				if (prop === 'alignItems' && settings?.alignItems) {
					styleProps['align-items'] = settings.alignItems;
				}
				if (prop === 'flexDirection') {
					if (settings?.flexDirection) {
						styleProps['flex-direction'] = settings.flexDirection;
					} else {
						styleProps['flex-direction'] = 'row';
					}
				}
				if (prop === 'overflow' && settings?.overflow) {
					styleProps['overflow'] = settings.overflow;
				}
				if (prop === 'zIndex' && settings?.zIndex !== undefined) {
					styleProps['z-index'] = settings.zIndex;
				}
				if (prop === 'flexGrow' && settings?.flexGrow !== undefined) {
					styleProps['flex-grow'] = settings.flexGrow;
				}
				if (
					prop === 'flexShrink' &&
					settings?.flexShrink !== undefined
				) {
					styleProps['flex-shrink'] = settings.flexShrink;
				}
				if (prop === 'flexBasis' && settings?.flexBasis !== undefined) {
					styleProps['flex-basis'] = settings.flexBasis;
				}
			} else if (
				prop === 'minHeight' ||
				prop === 'height' ||
				prop === 'minWidth' ||
				prop === 'width'
			) {
				if (settings[prop] && !settings[prop].startsWith('0')) {
					styleProps[prop] = settings[prop];
				}
			} else if (prop === 'borderRadius') {
				if (settings?.borderRadius?.topLeft) {
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
				}
			} else if (prop === 'border') {
				if (settings?.border?.width) {
					styleProps['border'] =
						`${settings.border.width} ${settings.border?.style ? settings.border.style : 'solid'} ${settings.border?.color ? settings.border.color : ''}`;
				} else if (
					settings?.border?.top ||
					settings?.border?.bottom ||
					settings?.border?.left ||
					settings?.border?.right
				) {
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
			} else if (
				prop === 'fontSize' ||
				prop === 'lineHeight' ||
				prop === 'textAlign'
			) {
				const value = (() => {
					if (prop in settings) return settings[prop];
					return null;
				})();
				if (value != null) styleProps[prop] = value;
			} else if (
				prop === 'gap' ||
				prop === 'gapAsVars' ||
				prop === 'padding-left' ||
				prop === 'padding-right' ||
				prop === 'padding-top' ||
				prop === 'padding-bottom' ||
				prop === 'margin-left' ||
				prop === 'margin-right' ||
				prop === 'margin-top' ||
				prop === 'margin-bottom'
			) {
				if (prop === 'gapAsVars') {
					if (settings?.gap?.top)
						styleProps['--bs-gutter-y'] = settings.gap.top;
					if (settings?.gap?.left || settings.gap?.right)
						styleProps['--bs-gutter-x'] =
							settings.gap.left || settings.gap.right;
				} else if (prop === 'gap') {
					if (settings?.gap?.top)
						styleProps['row-gap'] = settings.gap.top;
					if (settings?.gap?.left || settings.gap?.right)
						styleProps['column-gap'] =
							settings.gap.left || settings.gap.right;
				} else {
					const value = (() => {
						if (prop in settings) return settings[prop];
						const match = prop.match(
							/^(padding|margin)-(top|bottom|left|right)$/
						);
						if (match) {
							if (match[1] === 'margin') {
								if (
									match[2] === 'left' ||
									match[2] === 'right'
								) {
									if (
										settings[match[1]]?.[
											match[2]
										].startsWith('0')
									) {
										return null;
									}
								}
							}
							return settings[match[1]]?.[match[2]] ?? null;
						}
						return null;
					})();
					if (value != null) styleProps[prop] = value;
				}
			} else {
				const value = (() => {
					if (prop in settings) return settings[prop];
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

export default function MethodStyleTag({
	clientId,
	attributes,
	selectorMap,
	excludeBase,
	postId = null,
	postType = null,
}) {
	const styleRef = useRef();
	const breakpoints = getBreakpoints();
	const responsive = attributes.responsiveSettings || {};
	const atts = attributes;
	const featuredImageSizes = useFeaturedImageSizes(postId, postType);

	useEffect(() => {
		let css = '';
		if (!excludeBase) {
			css += getBreakpointStyle(
				responsive,
				selectorMap,
				'base',
				atts,
				postId,
				postType,
				featuredImageSizes
			);
		}
		if (responsive.mobile?.enabled) {
			css += `@media(max-width: ${breakpoints.mobile_max}) {\n`;
			css += getBreakpointStyle(
				responsive,
				selectorMap,
				'mobile',
				atts,
				postId,
				postType,
				featuredImageSizes
			);
			css += '}\n';
		}
		if (responsive.tablet?.enabled) {
			css += `@media(min-width: ${breakpoints.tablet_min}) and (max-width: ${breakpoints.tablet_max}) {\n`;
			css += getBreakpointStyle(
				responsive,
				selectorMap,
				'tablet',
				atts,
				postId,
				postType,
				featuredImageSizes
			);
			css += '}\n';
		}
		if (responsive.wide?.enabled) {
			css += `@media(min-width: ${breakpoints.wide_min}) {\n`;
			css += getBreakpointStyle(
				responsive,
				selectorMap,
				'wide',
				atts,
				postId,
				postType,
				featuredImageSizes
			);
			css += '}\n';
		}

		if (styleRef.current) {
			styleRef.current.innerHTML = css;
		}
	}, [attributes, featuredImageSizes]);

	return <style ref={styleRef} data-method-id={clientId} />;
}
