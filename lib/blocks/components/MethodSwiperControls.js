/* eslint-disable prettier/prettier */
/**
 * Inspector panels shared by the Swiper and Swiper Gallery blocks: Effect,
 * Slides per view, Space between and Navigation. Both blocks store these
 * options under the same attribute names (see each block.json) and render
 * them with method_swiper_render() on the frontend, so a single control set
 * keeps the two blocks' UX identical.
 *
 * @param {Object}   props
 * @param {Object}   props.attributes
 * @param {Function} props.setAttributes
 * @param {*}        [props.perViewExtra] Extra controls appended to the
 *                   "Slides per view" panel (hidden with the fade effect).
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
                <PanelBody title={__('Slides per view', 'method')}>
                    <div style={{ width: '100%' }} className='method-bpc-range method-bpc-desktop'>
                        <RangeControl
                            label={__('Desktop', 'method')}
                            value={slidesPerView}
                            onChange={(value) => setAttributes({ slidesPerView: value })}
                            min={1}
                            max={6}
                        />
                    </div>
                    <div style={{ width: '100%' }} className='method-bpc-range method-bpc-tablet'>
                        <RangeControl
                            label={__('Tablet', 'method')}
                            value={slidesPerViewTablet}
                            onChange={(value) => setAttributes({ slidesPerViewTablet: value })}
                            min={1}
                            max={6}
                        />
                    </div>
                    <div style={{ width: '100%' }} className='method-bpc-range method-bpc-mobile'>
                        <RangeControl
                            label={__('Mobile', 'method')}
                            value={slidesPerViewMobile}
                            onChange={(value) => setAttributes({ slidesPerViewMobile: value })}
                            min={1}
                            max={6}
                        />
                    </div>
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
