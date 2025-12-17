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
import { __ } from '@wordpress/i18n';
import MethodResponsiveTabs from '../../components/MethodResponsiveV2';
import MethodAspectRatio from '../../components/MethodAspectRatio';
import MethodSpacingControls from '../../components/MethodSpacingControlsV2';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodBackgroundControls from '../../components/MethodBackgroundControls';
import useResponsiveSetter from '../../hooks/useResponsiveSetter';

export default function Edit({ attributes, setAttributes, clientId }) {
    const update = useResponsiveSetter(attributes, setAttributes);
    const blockProps = useBlockProps({ className: 'method-swiper-gallery' }, {});
    const swiperRef = useRef(null);
    const swiperInstanceRef = useRef(null);
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
        if (!swiperRef.current || typeof Swiper === 'undefined' || !attributes.images?.length) {
            return;
        }

        // Destroy any existing instance first
        if (swiperInstanceRef.current) {
            swiperInstanceRef.current.destroy(true, true);
            swiperInstanceRef.current = null;
        }

        const timeoutId = setTimeout(() => {
            swiperInstanceRef.current = new Swiper(swiperRef.current, {
                slidesPerView: 1,
                loop: true,
                pagination: {
                    el: swiperRef.current.querySelector('.swiper-pagination'),
                    clickable: true,
                },
                navigation: {
                    nextEl: swiperRef.current.querySelector('.swiper-button-next'),
                    prevEl: swiperRef.current.querySelector('.swiper-button-prev'),
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
            <div {...blockProps}>
                <div className="swiper" ref={swiperRef}>
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