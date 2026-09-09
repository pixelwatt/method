/* eslint-disable prettier/prettier */
import { useRef, useEffect, useMemo } from '@wordpress/element';
import {
    useBlockProps,
    InspectorControls,
    BlockControls,
    MediaUpload,
    MediaUploadCheck,
    store as blockEditorStore,
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    ToggleControl,
    TextControl,
    Button,
    Placeholder,
    ToolbarGroup,
    ToolbarButton,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __, _n, sprintf } from '@wordpress/i18n';
import useCanvasViewport, { useCanvasWindow } from '../../hooks/useCanvasViewport';
import MethodAspectRatio from '../../components/MethodAspectRatio';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodSwiperControls from '../../components/MethodSwiperControls';
import { SwiperArrow } from '../../components/MethodSwiperNav';
import { attachCenterSlideTracking, CENTER_CLASS } from '../../utils/swiperRuntime';
import icon from './icon';

const ALLOWED_MEDIA_TYPES = ['image'];

// Hash navigation: every slide's hash is derived from one identifier for the
// gallery, `<hashId>-slide-<n>`, so links to slides stay stable across
// renders. The PHP render (method-swiper-gallery.php) builds the same value.
const HASH_ID_PREFIX = 'gallery-';

function generateHashId() {
    return HASH_ID_PREFIX + (Math.random().toString(36) + '000000').slice(2, 8);
}

function sanitizeHashId(value) {
    return (value || '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
}

export function getSlideHash(hashId, index) {
    return `${hashId}-slide-${index + 1}`;
}

// Per-view tiers follow the theme breakpoints (methodGlobalData.breakpoints),
// exactly as in the Swiper block; the frontend derives the same tiers from
// method_get_block_breakpoints().

export default function Edit({ attributes, setAttributes, clientId }) {
    const cssMap = {
        [`#block-${clientId} .method-swiper-button-prev, #block-${clientId} .method-swiper-button-next`]: [
            'textColor',
        ],
        [`#block-${clientId} .swiper-pagination`]: [
            'linkColor',
        ],
        [`#block-${clientId} .method-swiper-gallery-item`]: ['bgColor'],
        [`#block-${clientId} .method-swiper-gallery-item > .method-fit-img-container`]: ['aspectRatio'],
        [`#block-${clientId} .method-img-shade`]: ['bgShade'],
    };

    const {
        images = [],
        lightbox = false,
        centerSlides = false,
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
        hashId = '',
        altPagination = false,
    } = attributes;

    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const paginationRef = useRef(null);
    const blockId = `method-swiper-gallery-${clientId}`;

    // Resolve the tier against the canvas (iframe) window, as the Swiper block does.
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

    const blockProps = useBlockProps({
        className: `method-swiper method-swiper-gallery ${blockId}`,
        ref: canvasRef,
    });

    const hasImages = images.length > 0;
    const imageIds = useMemo(
        () => images.map((img) => img.id).filter(Boolean),
        [images]
    );
    // Swiper's loop mode reorders the slide nodes inside `.swiper-wrapper`.
    // React only ever moves nodes when the key order changes, so a loop-
    // shuffled track is safe until the image set itself changes — at which
    // point this key makes React throw the wrapper away and mount a fresh,
    // correctly ordered one rather than reconcile against shuffled nodes.
    const imagesKey = images.map((img, index) => img.id || index).join(',');

    // The gallery loops (as the original block did) whenever the current tier
    // has enough images: Swiper needs slidesPerView + 1, and with fewer there
    // is nothing to slide anyway. Mirrors method_swiper_gallery_get_loop_tiers().
    const loop = fadeEffect
        ? images.length > 1
        : activeSlidesPerView !== undefined && images.length > activeSlidesPerView;

    const onSelectImages = (selected) => {
        setAttributes({
            images: (selected || [])
                .filter((img) => img?.id)
                .map((img) => ({
                    id: img.id,
                    // The editor preview only needs a large rendition; the
                    // frontend renders from the attachment id.
                    url: img.sizes?.large?.url || img.url,
                    alt: img.alt || '',
                })),
        });
    };

    // Generate the gallery's hash identifier the first time hash navigation is
    // enabled, and keep it afterwards so links to slides never change.
    useEffect(() => {
        if (hashNavigation && !hashId) {
            setAttributes({ hashId: generateHashId() });
        }
    }, [hashNavigation, hashId]);

    // A duplicated block carries the original's identifier; the later copy
    // takes a fresh one so two galleries never produce the same slide hashes.
    const hasDuplicateHashId = useSelect(
        (select) => {
            if (!hashId) return false;
            const { getClientIdsWithDescendants, getBlockName, getBlockAttributes } =
                select(blockEditorStore);
            const owners = getClientIdsWithDescendants().filter(
                (id) =>
                    getBlockName(id) === 'method/swiper-gallery' &&
                    getBlockAttributes(id)?.hashId === hashId
            );
            return owners.length > 1 && owners[0] !== clientId;
        },
        [hashId, clientId]
    );
    useEffect(() => {
        if (hasDuplicateHashId) {
            setAttributes({ hashId: generateHashId() });
        }
    }, [hasDuplicateHashId]);

    // Image sizing (base breakpoint), mirrored in the PHP render.
    let aspectClass = '';
    let outerClass = 'method-fit-img-container';
    let imgClass = 'method-fit-img';
    const aspectUses = attributes.responsiveSettings?.base?.aspectUses;
    if (aspectUses === 'ratio') {
        aspectClass = ` method-ratio method-ratio${attributes.responsiveSettings?.base?.aspectRatio || '-1-1'}`;
    } else if (!aspectUses) {
        outerClass = 'method-swiper-img-container';
        imgClass = 'method-fluid-img';
    }

    const slides = images.map((item, index) => (
        <div
            className="swiper-slide"
            key={`${item.id || 'image'}-${index}`}
            data-hash={hashNavigation && hashId ? getSlideHash(hashId, index) : undefined}
        >
            <div className={`method-swiper-gallery-item${lightbox ? ' method-lightbox-trigger' : ''}`}>
                <div className={`${outerClass}${aspectClass}`}>
                    <div className="method-img-shade">&nbsp;</div>
                    <img src={item.url} alt={item.alt || ''} className={imgClass} />
                </div>
            </div>
        </div>
    ));

    useEffect(() => {
        // Wait for the canvas window so the first init already uses the right tier.
        if (!swiperRef.current || typeof Swiper === 'undefined' || activeSlidesPerView === undefined) return;

        const swiperConfig = {
            // Tier values resolved from the canvas window; Swiper's own
            // `breakpoints` option would evaluate matchMedia against the top
            // admin window, so it is not used in the editor (see Swiper block).
            slidesPerView: activeSlidesPerView,
            spaceBetween: activeSpaceBetween,
            loop,
            autoHeight: true,
            watchSlidesProgress: true,

            // Editor-specific: keep Gutenberg in charge of clicks and let
            // Swiper recalculate when React re-renders the slides.
            simulateTouch: false,
            allowTouchMove: false,
            preventClicks: false,
            preventClicksPropagation: false,
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

        // Fade previews one slide at a time with the normal layout; the
        // crossfade itself is applied on the frontend only (as in the Swiper block).
        if (fadeEffect) {
            swiperConfig.slidesPerView = 1;
            swiperConfig.spaceBetween = 0;
        }

        const swiperInstance = new Swiper(swiperRef.current, swiperConfig);

        // Same center-slide logic as the frontend runtime, so the editor
        // preview shows exactly which slides carry the class.
        const detachCenterTracking = centerSlides && !fadeEffect
            ? attachCenterSlideTracking(swiperInstance, CENTER_CLASS)
            : null;

        return () => {
            detachCenterTracking?.();
            swiperInstance?.destroy?.(true, true);
        };
    }, [
        activeSlidesPerView,
        activeSpaceBetween,
        showNavigation,
        showPagination,
        fadeEffect,
        hashNavigation,
        altPagination,
        centerSlides,
        loop,
        images,
    ]);

    const renderMediaButton = (label, buttonProps = {}) => (
        <MediaUploadCheck>
            <MediaUpload
                onSelect={onSelectImages}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                multiple
                gallery
                value={imageIds}
                render={({ open }) => (
                    <Button onClick={open} {...buttonProps}>
                        {label}
                    </Button>
                )}
            />
        </MediaUploadCheck>
    );

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImages}
                            allowedTypes={ALLOWED_MEDIA_TYPES}
                            multiple
                            gallery
                            value={imageIds}
                            render={({ open }) => (
                                <ToolbarButton icon="images-alt2" onClick={open}>
                                    {hasImages ? __('Edit gallery', 'method') : __('Select images', 'method')}
                                </ToolbarButton>
                            )}
                        />
                    </MediaUploadCheck>
                </ToolbarGroup>
            </BlockControls>
            <InspectorControls>
                <PanelBody title={__('Images', 'method')}>
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            {renderMediaButton(
                                hasImages ? __('Edit gallery', 'method') : __('Select images', 'method'),
                                { variant: 'primary' }
                            )}
                            {hasImages && (
                                <p className="components-base-control__help" style={{ marginTop: '8px', marginBottom: 0 }}>
                                    {sprintf(
                                        /* translators: %d: number of images */
                                        _n('%d image, one slide per image.', '%d images, one slide per image.', images.length, 'method'),
                                        images.length
                                    )}
                                </p>
                            )}
                        </div>
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={__('Open images in a lightbox', 'method')}
                            help={__('Clicking or pressing any image opens its uncropped, full-size version in a lightbox.', 'method')}
                            checked={lightbox}
                            onChange={(value) => setAttributes({ lightbox: value })}
                        />
                    </PanelRow>
                </PanelBody>
                <PanelBody title={__('Image sizing', 'method')}>
                    <MethodAspectRatio
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                    />
                </PanelBody>
                <MethodSwiperControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    perViewExtra={(
                        <PanelRow>
                            <ToggleControl
                                label={__('Mark center slides', 'method')}
                                help={sprintf(
                                    /* translators: %s: CSS class name */
                                    __('Adds the %s class to the center slide (or the two center slides) whenever more than two slides are visible, updating at the start of each move.', 'method'),
                                    CENTER_CLASS
                                )}
                                checked={centerSlides}
                                onChange={(value) => setAttributes({ centerSlides: value })}
                            />
                        </PanelRow>
                    )}
                    hashExtra={(
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <TextControl
                                    label={__('Hash identifier', 'method')}
                                    help={hashId
                                        ? sprintf(
                                            /* translators: 1: first slide hash, 2: second slide hash */
                                            __('Slides use the hashes #%1$s, #%2$s, and so on.', 'method'),
                                            getSlideHash(hashId, 0),
                                            getSlideHash(hashId, 1)
                                        )
                                        : __('Generated automatically; identifies this gallery in each slide hash.', 'method')}
                                    value={hashId}
                                    onChange={(value) => setAttributes({ hashId: sanitizeHashId(value) })}
                                />
                            </div>
                        </PanelRow>
                    )}
                />
                <MethodColorControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['textColor', 'linkColor', 'bgColor', 'bgShadeColor']}
                    labels={{
                        textColor: 'Navigation Arrows',
                        linkColor: 'Pagination',
                        bgColor: 'Slide Background',
                        bgShadeColor: 'Image Shade',
                    }}
                />
            </InspectorControls>

            <div {...blockProps}>
                {hasImages ? (
                    <>
                        {/* Same shell as the Swiper block so styling and layout match. */}
                        <div className="swiper-outer">
                            <div className="swiper-outer-wrap">
                                <div className="swiper-outer-wrap-inner">
                                    <div className="swiper swiper-container" ref={swiperRef}>
                                        <div className="swiper-wrapper" key={imagesKey}>
                                            {slides}
                                        </div>
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
                        {renderMediaButton(__('Edit gallery', 'method'), {
                            variant: 'secondary',
                            icon: 'images-alt2',
                            className: 'method-swiper-add-slide method-swiper-edit-gallery',
                        })}
                    </>
                ) : (
                    <Placeholder
                        icon={icon}
                        label={__('Swiper Gallery', 'method')}
                        instructions={__('Select images from the media library; each image becomes a slide.', 'method')}
                    >
                        {renderMediaButton(__('Select images', 'method'), { variant: 'primary' })}
                    </Placeholder>
                )}
            </div>
            <MethodStyleTag
                clientId={clientId}
                attributes={attributes}
                selectorMap={cssMap}
            />
        </>
    );
}
