/* eslint-disable prettier/prettier */
/**
 * Inspector panels shared by the Swiper and Swiper Gallery blocks: Effect,
 * Slide sizing, Space between and Navigation. Both blocks store these
 * options under the same attribute names (see each block.json) and render
 * them with method_swiper_render() on the frontend, so a single control set
 * keeps the two blocks' UX identical.
 *
 * Slide sizing offers two modes: a number of slides per view per tier (the
 * default), or — with "Set slide widths" — a width per tier, in px or
 * matching the swiper's container, with Swiper showing as many slides as fit
 * (see lib/blocks/utils/swiperSlideWidth.js).
 *
 * @param {Object}   props
 * @param {Object}   props.attributes
 * @param {Function} props.setAttributes
 * @param {*}        [props.perViewExtra] Extra controls appended to the
 *                   "Slide sizing" panel (hidden with the fade effect).
 * @param {*}        [props.hashExtra]    Extra controls shown directly under
 *                   the "Hash navigation" toggle while it is enabled.
 */
import {
    PanelBody,
    PanelRow,
    RangeControl,
    ToggleControl,
    SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSwiperIconOptions } from './MethodSwiperNav';
import {
    SLIDE_WIDTH_DEFAULTS,
    SLIDE_WIDTH_MIN,
    SLIDE_WIDTH_MAX,
} from '../utils/swiperSlideWidth';

// One "Slide sizing" tier: the per-view count, or the slide width in width mode.
const TIERS = [
    { key: 'desktop', label: __('Desktop', 'method'), perView: 'slidesPerView', width: 'slideWidth', container: 'containerWidthSlides' },
    { key: 'tablet', label: __('Tablet', 'method'), perView: 'slidesPerViewTablet', width: 'slideWidthTablet', container: 'containerWidthSlidesTablet' },
    { key: 'mobile', label: __('Mobile', 'method'), perView: 'slidesPerViewMobile', width: 'slideWidthMobile', container: 'containerWidthSlidesMobile' },
];

export default function MethodSwiperControls({
    attributes,
    setAttributes,
    perViewExtra = null,
    hashExtra = null,
}) {
    const {
        slidesPerView = 3,
        slidesPerViewTablet = 2,
        slidesPerViewMobile = 1,
        spaceBetween = 24,
        spaceBetweenTablet = 24,
        spaceBetweenMobile = 24,
        slideWidthMode = false,
        slideWidth = SLIDE_WIDTH_DEFAULTS.desktop,
        slideWidthTablet = SLIDE_WIDTH_DEFAULTS.tablet,
        slideWidthMobile = SLIDE_WIDTH_DEFAULTS.mobile,
        containerWidthSlides = false,
        containerWidthSlidesTablet = false,
        containerWidthSlidesMobile = false,
        showNavigation = true,
        showPagination = true,
        fadeEffect = false,
        hashNavigation = false,
        scrollToSlideStart = false,
        altPagination = false,
    } = attributes;

    const buttonIconOptions = useSwiperIconOptions();

    return (
        <>
            <PanelBody title={__('Effect', 'method')}>
                <ToggleControl
                    label={__('Fade (crossfade)', 'method')}
                    help={__('Crossfade between slides instead of sliding. Shows one slide at a time.', 'method')}
                    checked={fadeEffect}
                    onChange={(value) => setAttributes({ fadeEffect: value })}
                />
            </PanelBody>
            {!fadeEffect && (<>
                <PanelBody title={__('Slide sizing', 'method')}>
                    <PanelRow>
                        <ToggleControl
                            label={__('Set slide widths', 'method')}
                            help={slideWidthMode
                                ? __('Every slide is as wide as set below and the swiper shows as many as fit. When the block is full width, the first slide lines up with the content area and the rest run off the edge of the page.', 'method')
                                : __('Give the slides a width per breakpoint instead of a number of slides per view.', 'method')}
                            checked={slideWidthMode}
                            onChange={(value) => setAttributes({ slideWidthMode: value })}
                        />
                    </PanelRow>
                    {TIERS.map((tier) => {
                        const perView = { slidesPerView, slidesPerViewTablet, slidesPerViewMobile }[tier.perView];
                        const width = { slideWidth, slideWidthTablet, slideWidthMobile }[tier.width];
                        const container = { containerWidthSlides, containerWidthSlidesTablet, containerWidthSlidesMobile }[tier.container];

                        if (!slideWidthMode) {
                            return (
                                <div key={tier.key} style={{ width: '100%' }} className={`method-bpc-range method-bpc-${tier.key}`}>
                                    <RangeControl
                                        label={tier.label}
                                        value={perView}
                                        onChange={(value) => setAttributes({ [tier.perView]: value })}
                                        min={1}
                                        max={6}
                                    />
                                </div>
                            );
                        }
                        return (
                            <div key={tier.key} style={{ width: '100%' }} className={`method-bpc-range method-bpc-${tier.key} method-bpc-units-px`}>
                                <RangeControl
                                    label={tier.label}
                                    value={width}
                                    onChange={(value) => setAttributes({ [tier.width]: value })}
                                    min={SLIDE_WIDTH_MIN}
                                    max={SLIDE_WIDTH_MAX}
                                    disabled={container}
                                />
                                <ToggleControl
                                    label={__('Match container width', 'method')}
                                    checked={container}
                                    onChange={(value) => setAttributes({ [tier.container]: value })}
                                />
                            </div>
                        );
                    })}
                    {perViewExtra}
                </PanelBody>
                <PanelBody title={__('Space between', 'method')}>
                    <div style={{ width: '100%' }} className='method-bpc-range method-bpc-desktop method-bpc-units-px'>
                        <RangeControl
                            label={__('Desktop', 'method')}
                            value={spaceBetween}
                            onChange={(value) => setAttributes({ spaceBetween: value })}
                            min={0}
                            max={120}
                        />
                    </div>
                    <div style={{ width: '100%' }} className='method-bpc-range method-bpc-tablet method-bpc-units-px'>
                        <RangeControl
                            label={__('Tablet', 'method')}
                            value={spaceBetweenTablet}
                            onChange={(value) => setAttributes({ spaceBetweenTablet: value })}
                            min={0}
                            max={120}
                        />
                    </div>
                    <div style={{ width: '100%' }} className='method-bpc-range method-bpc-mobile method-bpc-units-px'>
                        <RangeControl
                            label={__('Mobile', 'method')}
                            value={spaceBetweenMobile}
                            onChange={(value) => setAttributes({ spaceBetweenMobile: value })}
                            min={0}
                            max={120}
                        />
                    </div>
                </PanelBody>
            </>)}
            <PanelBody title={__('Navigation', 'method')}>
                <PanelRow>
                    <ToggleControl
                        label={__('Show arrows', 'method')}
                        checked={showNavigation}
                        onChange={(value) => setAttributes({ showNavigation: value })}
                    />
                </PanelRow>
                {showNavigation && (
                    <>
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <SelectControl
                                    label="Previous Arrow"
                                    value={attributes.prevIcon}
                                    options={buttonIconOptions}
                                    onChange={(value) => setAttributes({ prevIcon: value })}
                                />
                            </div>
                        </PanelRow>
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <SelectControl
                                    label="Next Arrow"
                                    value={attributes.nextIcon}
                                    options={buttonIconOptions}
                                    onChange={(value) => setAttributes({ nextIcon: value })}
                                />
                            </div>
                        </PanelRow>
                    </>
                )}
                <PanelRow>
                    <ToggleControl
                        label={__('Show pagination', 'method')}
                        checked={showPagination}
                        onChange={(value) => setAttributes({ showPagination: value })}
                    />
                </PanelRow>
                {showPagination && (
                    <PanelRow>
                        <ToggleControl
                            label={__('Place pagination outside', 'method')}
                            help={__('Place the pagination for this swiper outside of the Swiper itself, instead of overlaying.', 'method')}
                            checked={altPagination}
                            onChange={(value) => setAttributes({ altPagination: value })}
                        />
                    </PanelRow>
                )}
                <PanelRow>
                    <ToggleControl
                        label={__('Hash navigation', 'method')}
                        help={hashExtra
                            ? __('Sync the URL hash with the visible slide. Slide hashes are generated automatically from the identifier below.', 'method')
                            : __('Sync the URL hash with each slide using its hash value (set per slide).', 'method')}
                        checked={hashNavigation}
                        onChange={(value) => setAttributes({ hashNavigation: value })}
                    />
                </PanelRow>
                {hashNavigation && (
                    <>
                        {hashExtra}
                        <PanelRow>
                            <ToggleControl
                                label={__('Scroll to slide start', 'method')}
                                help={__('When a new slide is navigated to, scroll the page to the top of the slider. Useful when slides vary in height.', 'method')}
                                checked={scrollToSlideStart}
                                onChange={(value) => setAttributes({ scrollToSlideStart: value })}
                            />
                        </PanelRow>
                    </>
                )}
            </PanelBody>
        </>
    );
}
