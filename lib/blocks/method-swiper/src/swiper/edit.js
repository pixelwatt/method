/* eslint-disable prettier/prettier */
import { useRef, useEffect } from '@wordpress/element';
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    store as blockEditorStore
} from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    ToggleControl,
    Button,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

// Min-width (px) at which each tier kicks in. Swiper breakpoints are min-width
// based and, in the editor, respond to the canvas/device-preview width.
const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

export default function Edit({ attributes, setAttributes, clientId }) {
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
    } = attributes;

    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const blockId = `method-swiper-${clientId}`;
    const blockProps = useBlockProps({ className: `method-swiper ${blockId}` });
    const ALLOWED_BLOCKS = ['method/swiper-slide'];

    // Insert new slides ourselves so the appender lives OUTSIDE the swiper track
    // (Swiper would otherwise size/clip the default appender like a slide).
    const { insertBlock } = useDispatch(blockEditorStore);
    const slideCount = useSelect(
        (select) => select(blockEditorStore).getBlock(clientId)?.innerBlocks.length ?? 0,
        [clientId]
    );
    const addSlide = () => {
        // 4th arg `false` = don't move selection, so focus doesn't jump.
        insertBlock(createBlock('method/swiper-slide'), slideCount, clientId, false);
    };

    useEffect(() => {
        if (!swiperRef.current || typeof Swiper === 'undefined') return;

        const swiperConfig = {
            // Mobile-first base values; the tiers below override at min-width.
            slidesPerView: slidesPerViewMobile,
            spaceBetween: spaceBetweenMobile,
            breakpoints: {
                [TABLET_BREAKPOINT]: {
                    slidesPerView: slidesPerViewTablet,
                    spaceBetween: spaceBetweenTablet,
                },
                [DESKTOP_BREAKPOINT]: {
                    slidesPerView,
                    spaceBetween,
                },
            },
            loop: false,
            autoHeight: true,

            // --- Editor-specific: let Gutenberg own clicks & keep Swiper in sync ---
            // Without these, Swiper cancels the click that selects/edits an inner
            // block, so newly-revealed slides can't be clicked into.
            simulateTouch: false,
            allowTouchMove: false,
            preventClicks: false,
            preventClicksPropagation: false,
            // Recalculate automatically when slides are added/removed or their
            // contents change — replaces the manual MutationObserver.
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            watchOverflow: true,

            pagination: showPagination
                ? {
                    el: swiperRef.current.querySelector('.swiper-pagination'),
                    clickable: true,
                }
                : false,
            navigation: showNavigation
                ? {
                    nextEl: nextRef.current,
                    prevEl: prevRef.current,
                }
                : false,
        };

        // Fade renders a single, stacked slide and crossfades between them, so
        // per-view counts, spacing and breakpoints no longer apply.
        if (fadeEffect) {
            swiperConfig.slidesPerView = 1;
            swiperConfig.spaceBetween = 0;
            swiperConfig.breakpoints = undefined;
            swiperConfig.effect = 'fade';
            swiperConfig.fadeEffect = { crossFade: true };
        }

        const swiperInstance = new Swiper(swiperRef.current, swiperConfig);

        return () => {
            swiperInstance?.destroy?.(true, true);
        };
        // Re-init when any per-view/spacing value changes (breakpoints are read once at init).
    }, [
        slidesPerView,
        slidesPerViewTablet,
        slidesPerViewMobile,
        spaceBetween,
        spaceBetweenTablet,
        spaceBetweenMobile,
        showNavigation,
        showPagination,
        fadeEffect,
    ]);

    const innerBlocksProps = useInnerBlocksProps(
        { className: 'swiper-wrapper' },
        { allowedBlocks: ALLOWED_BLOCKS, renderAppender: false }
    );

    const leftArrow = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" /></svg>);

    const rightArrow = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" /></svg>);

    return (
        <>
            <InspectorControls>
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
                    <RangeControl
                        label={__('Desktop', 'method')}
                        value={slidesPerView}
                        onChange={(value) => setAttributes({ slidesPerView: value })}
                        min={1}
                        max={6}
                    />
                    <RangeControl
                        label={__('Tablet', 'method')}
                        value={slidesPerViewTablet}
                        onChange={(value) => setAttributes({ slidesPerViewTablet: value })}
                        min={1}
                        max={6}
                    />
                    <RangeControl
                        label={__('Mobile', 'method')}
                        value={slidesPerViewMobile}
                        onChange={(value) => setAttributes({ slidesPerViewMobile: value })}
                        min={1}
                        max={6}
                    />
                </PanelBody>
                <PanelBody title={__('Space between', 'method')}>
                    <RangeControl
                        label={__('Desktop', 'method')}
                        value={spaceBetween}
                        onChange={(value) => setAttributes({ spaceBetween: value })}
                        min={0}
                        max={120}
                    />
                    <RangeControl
                        label={__('Tablet', 'method')}
                        value={spaceBetweenTablet}
                        onChange={(value) => setAttributes({ spaceBetweenTablet: value })}
                        min={0}
                        max={120}
                    />
                    <RangeControl
                        label={__('Mobile', 'method')}
                        value={spaceBetweenMobile}
                        onChange={(value) => setAttributes({ spaceBetweenMobile: value })}
                        min={0}
                        max={120}
                    />
                </PanelBody>
                </>)}
                <PanelBody title={__('Navigation', 'method')}>
                    <ToggleControl
                        label={__('Show arrows', 'method')}
                        checked={showNavigation}
                        onChange={(value) => setAttributes({ showNavigation: value })}
                    />
                    <ToggleControl
                        label={__('Show pagination', 'method')}
                        checked={showPagination}
                        onChange={(value) => setAttributes({ showPagination: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {/* `swiper` class added so Swiper 12's bundled CSS clips overflow. */}
                <div className="swiper-outer">
                    <div className="swiper-outer-wrap">
                        <div className="swiper-outer-wrap-inner">
                            <div className="swiper swiper-container" ref={swiperRef}>
                                <div {...innerBlocksProps} />
                                {showPagination && <div className="swiper-pagination" />}
                            </div>
                        </div>
                    </div>
                    {showNavigation && (
                        <>
                            <div className="method-swiper-button-prev" ref={prevRef}>{leftArrow}<span className='visually-hidden'>Previous</span></div>
                            <div className="method-swiper-button-next" ref={nextRef}>{rightArrow}<span className='visually-hidden'>Next</span></div>
                        </>
                    )}
                </div>
                <Button
                    variant="secondary"
                    icon="plus"
                    onClick={addSlide}
                    className="method-swiper-add-slide"
                >
                    {__('Add slide', 'method')}
                </Button>
            </div>
        </>
    );
}
