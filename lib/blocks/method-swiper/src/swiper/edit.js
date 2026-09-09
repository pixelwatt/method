/* eslint-disable prettier/prettier */
import { useRef, useEffect } from '@wordpress/element';
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    store as blockEditorStore
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import useCanvasViewport, { useCanvasWindow } from '../../../hooks/useCanvasViewport';
import MethodColorControls from '../../../components/MethodColorControls';
import MethodStyleTag from '../../../components/MethodStyleTag';
import MethodSwiperControls from '../../../components/MethodSwiperControls';
import { SwiperArrow } from '../../../components/MethodSwiperNav';

// Per-view tiers follow the theme breakpoints (methodGlobalData.breakpoints):
// mobile below tablet_min, tablet up to tablet_max, desktop above. The
// frontend (method-swiper.php) derives the same tiers from
// method_get_block_breakpoints(), so editor and frontend stay in sync.

export default function Edit({ attributes, setAttributes, clientId }) {
    const cssMap = {
        [`#block-${clientId} .method-swiper-button-prev, #block-${clientId} .method-swiper-button-next`]: [
            'textColor',
        ],
        [`#block-${clientId} .swiper-pagination`]: [
            'linkColor',
        ],
    };

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
        altPagination = false,
    } = attributes;

    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const paginationRef = useRef(null);
    const blockId = `method-swiper-${clientId}`;

    // WP 7.1 always iframes the post editor and the iframe width IS the device
    // preview / resized canvas width. Resolve the tier against the canvas
    // window, not the top admin window this script runs in.
    const [canvasRef, canvasWindow] = useCanvasWindow();
    const tier = useCanvasViewport(canvasWindow);
    const tierKey = tier === 'wide' ? 'desktop' : tier;
    const activeSlidesPerView = {
        mobile: slidesPerViewMobile,
        tablet: slidesPerViewTablet,
        desktop: slidesPerView,
    }[tierKey];
    const activeSpaceBetween = {
        mobile: spaceBetweenMobile,
        tablet: spaceBetweenTablet,
        desktop: spaceBetween,
    }[tierKey];

    const blockProps = useBlockProps({ className: `method-swiper ${blockId}`, ref: canvasRef });
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
        // Wait for the canvas window so the first init already uses the right tier.
        if (!swiperRef.current || typeof Swiper === 'undefined' || activeSlidesPerView === undefined) return;

        const swiperConfig = {
            // Values for the tier resolved from the canvas window (see above).
            // Swiper's own `breakpoints` option is deliberately NOT used in the
            // editor: it evaluates matchMedia against the window that loaded
            // Swiper (the top admin window), so it never follows the canvas.
            slidesPerView: activeSlidesPerView,
            spaceBetween: activeSpaceBetween,
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
                    el: paginationRef.current,
                    clickable: true,
                }
                : false,
            navigation: showNavigation
                ? {
                    nextEl: nextRef.current,
                    prevEl: prevRef.current,
                }
                : false,
            // Reads each slide's `data-hash` and keeps it in sync with the URL hash.
            hashNavigation: hashNavigation ? { watchState: true } : false,
        };

        // Fade shows one slide at a time, so per-view counts and spacing no
        // longer apply. We deliberately do NOT enable Swiper's
        // `fade` effect in the editor: fade stacks every slide in the same spot,
        // and the top-most (last) slide then swallows clicks meant for the others,
        // making it impossible to reliably click a slide to edit it. The editor
        // previews one slide at a time with the normal (non-overlapping) layout;
        // the crossfade transition itself is applied on the frontend only.
        if (fadeEffect) {
            swiperConfig.slidesPerView = 1;
            swiperConfig.spaceBetween = 0;
        }

        const swiperInstance = new Swiper(swiperRef.current, swiperConfig);

        return () => {
            swiperInstance?.destroy?.(true, true);
        };
        // Re-init when the active tier's values change (including when the canvas
        // crosses a breakpoint) or any other option changes.
    }, [
        activeSlidesPerView,
        activeSpaceBetween,
        showNavigation,
        showPagination,
        fadeEffect,
        hashNavigation,
        altPagination,
    ]);

    const innerBlocksProps = useInnerBlocksProps(
        { className: 'swiper-wrapper' },
        { allowedBlocks: ALLOWED_BLOCKS, renderAppender: false }
    );

    return (
        <>
            <InspectorControls>
                <MethodSwiperControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <MethodColorControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['textColor', 'linkColor']}
                    labels={{
                        textColor: 'Navigation Arrows',
                        linkColor: 'Pagination',
                    }}
                />
            </InspectorControls>

            <div {...blockProps}>
                {/* `swiper` class added so Swiper 12's bundled CSS clips overflow. */}
                <div className="swiper-outer">
                    <div className="swiper-outer-wrap">
                        <div className="swiper-outer-wrap-inner">
                            <div className="swiper swiper-container" ref={swiperRef}>
                                <div {...innerBlocksProps} />
                                {showPagination && !altPagination && <div className="swiper-pagination" ref={paginationRef} />}
                            </div>
                        </div>
                    </div>
                    {showNavigation && (
                        <>
                            <div className="method-swiper-button-prev" ref={prevRef}>
                                <SwiperArrow direction="prev" iconKey={attributes.prevIcon} />
                                <span className='visually-hidden'>Previous</span>
                            </div>
                            <div className="method-swiper-button-next" ref={nextRef}>
                                <SwiperArrow direction="next" iconKey={attributes.nextIcon} />
                                <span className='visually-hidden'>Next</span>
                            </div>
                            {showPagination && altPagination && <div className="method-swiper-pagination swiper-pagination" ref={paginationRef} />}
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
            <MethodStyleTag
                clientId={clientId}
                attributes={attributes}
                selectorMap={cssMap}
            />
        </>
    );
}
