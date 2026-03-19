/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    InspectorControls,
    MediaUpload
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    Button
} from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { useMergeRefs } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import MethodAspectRatio from '../../components/MethodAspectRatio';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import useResponsiveSetter from '../../hooks/useResponsiveSetter';

export default function Edit({ attributes, setAttributes, clientId }) {
    const update = useResponsiveSetter(attributes, setAttributes);

    // Ref for swiper initialization
    const swiperContainerRef = useRef(null);
    const swiperInstanceRef = useRef(null);

    const blockProps = useBlockProps({ className: 'method-swiper-gallery' });

    // Merge blockProps ref with our custom ref to preserve WordPress toolbar functionality
    const mergedRef = useMergeRefs([blockProps.ref, swiperContainerRef]);

    const cssMap = {
        [`#block-${clientId} > .swiper-slide > .method-fit-img-container`]: ['aspectRatio'],
        [`#block-${clientId} .method-img-shade`]: ['bgShade'],
    };
    const onSelectImages = (selectedImages) => {
        setAttributes({
            images: selectedImages.map(img => ({
                id: img.id,
                url: img.url,
                alt: img.alt
            }))
        });

    };
    let aspectClass = '';
    let outerClass = 'method-fit-img-container';
    let imgClass = 'method-fit-img';
    if (attributes.responsiveSettings?.base?.aspectUses === 'ratio') {
        if (attributes.responsiveSettings?.base?.aspectRatio) {
            aspectClass = ` method-ratio method-ratio${attributes.responsiveSettings.base.aspectRatio}`;
        } else {
            aspectClass = ` method-ratio method-ratio-1-1`;
        }
    } else if (!attributes.responsiveSettings?.base?.aspectUses) {
        outerClass = 'method-swiper-img-container';
        imgClass = 'method-fluid-img';
    }
    const slides = attributes.images?.map((item, index) => {
        return (
            <div className='swiper-slide' key={item.id || index}>
                <div className={`${outerClass}${aspectClass}`}>
                    <div className='method-img-shade'>&nbsp;</div>
                    <img src={`${item.url}`} alt={`${item.alt}`} className={`${imgClass}`} />
                </div>
            </div>
        );
    });

    useEffect(() => {
        // Find the swiper element within our block
        const swiperEl = swiperContainerRef.current?.querySelector('.swiper');

        if (!swiperEl || typeof Swiper === 'undefined' || !attributes.images?.length) {
            return;
        }

        // Destroy any existing instance first
        if (swiperInstanceRef.current) {
            swiperInstanceRef.current.destroy(true, true);
            swiperInstanceRef.current = null;
        }

        const timeoutId = setTimeout(() => {
            swiperInstanceRef.current = new Swiper(swiperEl, {
                slidesPerView: 1,
                loop: true,
                pagination: {
                    el: swiperEl.querySelector('.swiper-pagination'),
                    clickable: true,
                },
                navigation: {
                    nextEl: swiperEl.querySelector('.swiper-button-next'),
                    prevEl: swiperEl.querySelector('.swiper-button-prev'),
                },
            });
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            if (swiperInstanceRef.current) {
                swiperInstanceRef.current.destroy(true, true);
                swiperInstanceRef.current = null;
            }
        };
    }, [attributes.images]);

    return (
        <>
            <InspectorControls>
                <PanelBody title="Gallery Settings">
                    <PanelRow>
                        <MediaUpload
                            onSelect={onSelectImages}
                            allowedTypes={['image']}
                            multiple
                            gallery
                            value={attributes.images?.map(img => img.id)}
                            render={({ open }) => (
                                <Button onClick={open} variant="primary">
                                    {attributes.images?.length ? 'Edit Gallery' : 'Select Images'}
                                </Button>
                            )}
                        />
                    </PanelRow>
                </PanelBody>
                <PanelBody title="Image Settings">
                    <MethodAspectRatio
                        breakpoint="base"
                        attributes={attributes}
                        setAttributes={setAttributes}
                    />
                </PanelBody>
                <MethodColorControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['bgColor', 'bgShadeColor']}
                />
            </InspectorControls>
            <div {...blockProps} ref={mergedRef}>
                <div className="swiper">
                    <div className="swiper-wrapper">
                        {slides}
                    </div>
                    <div className="swiper-pagination"></div>
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-button-next"></div>
                </div>
                <MethodStyleTag
                    clientId={clientId}
                    attributes={attributes}
                    selectorMap={cssMap}
                />
            </div>
        </>
    );
}