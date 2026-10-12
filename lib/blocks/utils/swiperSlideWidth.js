/**
 * Slide width mode, shared by the Swiper and Swiper Gallery editor previews.
 *
 * With "Set slide widths" (slideWidthMode) on, Swiper runs with
 * `slidesPerView: 'auto'` and each slide takes the width chosen for the
 * current tier — a pixel value (slideWidth / slideWidthTablet /
 * slideWidthMobile) or, with the tier's containerWidthSlides* flag, the width
 * of the swiper's container. The width reaches the slides through CSS:
 *
 *   - the block wrapper carries WIDTH_MODE_CLASS, and global.scss sizes its
 *     `.swiper-slide`s from the SLIDE_WIDTH_PROPERTY custom property;
 *   - the editor sets that property inline on the wrapper for the tier the
 *     canvas is in (getSlideWidth()); the frontend sets it per tier in the
 *     block's collected CSS, with media queries at the theme breakpoints
 *     (method_swiper_render() in method-swiper.php, which mirrors this file).
 *
 * A tier matching the container width gets `100%` of the track's content box,
 * and sets SLIDE_FILL_PROPERTY to 1 as well. A full-width swiper in this mode
 * is padded on the left so the first slide starts at the constrained
 * content's edge; at a container-width tier it is padded on the right by the
 * same amount (that is what the flag is for), so the track's content box is
 * exactly the content area: every slide, the last one included, snaps into
 * it, the neighbours peek out on either side, and Swiper counts one slide as
 * visible (global.scss, "Width mode").
 */

export const WIDTH_MODE_CLASS = 'method-swiper-width-mode';
export const HAS_NAV_CLASS = 'method-swiper-has-nav';
export const SLIDE_WIDTH_PROPERTY = '--method-swiper-slide-width';
export const SLIDE_FILL_PROPERTY = '--method-swiper-slide-fill';
export const CONTAINER_SLIDE_WIDTH = '100%';

// Keep in sync with the block.json defaults of both blocks and with
// method_swiper_get_slide_width() in method-swiper.php.
export const SLIDE_WIDTH_DEFAULTS = {
	desktop: 400,
	tablet: 320,
	mobile: 260,
};

// Smallest / largest slide width the inspector offers, in px.
export const SLIDE_WIDTH_MIN = 100;
export const SLIDE_WIDTH_MAX = 1200;

const TIER_ATTRIBUTES = {
	desktop: { width: 'slideWidth', container: 'containerWidthSlides' },
	tablet: { width: 'slideWidthTablet', container: 'containerWidthSlidesTablet' },
	mobile: { width: 'slideWidthMobile', container: 'containerWidthSlidesMobile' },
};

/**
 * Whether the block sizes its slides by width. The fade effect stacks every
 * slide in the same spot, so it takes precedence over width mode.
 *
 * @param {Object} attributes Block attributes.
 * @return {boolean}
 */
export function isSlideWidthMode(attributes) {
	return !!attributes?.slideWidthMode && !attributes?.fadeEffect;
}

/**
 * Whether a tier's slides match the container width.
 *
 * @param {Object}                          attributes Block attributes.
 * @param {'desktop'|'tablet'|'mobile'} tier
 * @return {boolean}
 */
export function isContainerWidthTier(attributes, tier) {
	const keys = TIER_ATTRIBUTES[tier] || TIER_ATTRIBUTES.desktop;
	return !!attributes?.[keys.container];
}

/**
 * The CSS width of a slide at a tier: `<n>px`, or CONTAINER_SLIDE_WIDTH when
 * the tier matches the container width.
 *
 * @param {Object}                          attributes Block attributes.
 * @param {'desktop'|'tablet'|'mobile'} tier
 * @return {string}
 */
export function getSlideWidth(attributes, tier) {
	if (isContainerWidthTier(attributes, tier)) {
		return CONTAINER_SLIDE_WIDTH;
	}
	const keys = TIER_ATTRIBUTES[tier] || TIER_ATTRIBUTES.desktop;
	const width = parseInt(attributes?.[keys.width], 10);
	return `${width > 0 ? width : SLIDE_WIDTH_DEFAULTS[tier]}px`;
}

/**
 * The custom properties the wrapper carries for a tier, as a React style
 * object: the slide width, and whether the slides fill the container. The
 * frontend sets the same two per tier in the block's collected CSS
 * (method_swiper_get_slide_width_css()).
 *
 * @param {Object}                          attributes Block attributes.
 * @param {'desktop'|'tablet'|'mobile'} tier
 * @return {Object}
 */
export function getSlideWidthStyle(attributes, tier) {
	return {
		[SLIDE_WIDTH_PROPERTY]: getSlideWidth(attributes, tier),
		[SLIDE_FILL_PROPERTY]: isContainerWidthTier(attributes, tier) ? '1' : '0',
	};
}
