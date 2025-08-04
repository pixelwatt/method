/* eslint-disable prettier/prettier */
import {
    PanelBody,
    PanelRow,
    TextControl,
    Button,
    AlignmentMatrixControl,
    CustomSelectControl
} from '@wordpress/components';
import { MediaUpload, store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

export default function MethodBackgroundControls({
    attributes,
    setAttributes,
    title = 'Background Image',
}) {
    const imageSizes = useSelect(
        (select) => select(blockEditorStore).getSettings().imageSizes,
        []
    );

    const availableSizes = useMemo(() => {
        if (!attributes.bgImg || !attributes.bgImg.id) return [];

        return imageSizes
            .filter((size) => {
                const entry = attributes.bgImg[size.slug];
                return entry && entry.url && entry.width && entry.height;
            })
            .map((size) => {
                const data = attributes.bgImg[size.slug];
                return {
                    key: size.slug,
                    name: size.name,
                    hint: `${data.width}×${data.height}`,
                };
            });
    }, [attributes.bgImg, imageSizes]);

    const onSelect = (media) => {
        if (!media || !media.sizes) return;

        const sizesFromMedia = media.sizes;
        const full = {
            url: media.url,
            width: media.width,
            height: media.height,
        };

        const aSizes = imageSizes
            .filter((size) => sizesFromMedia[size.slug])
            .map((size) => {
                const mediaSize = sizesFromMedia[size.slug];
                return {
                    key: size.slug,     // ✅ used for selection
                    name: size.name,    // ✅ displayed in dropdown
                    hint: `${mediaSize.width}×${mediaSize.height}`,
                };
            });

        // Build bgImg object
        const theImg = {
            id: media.id,
            full,
        };

        imageSizes.forEach((size) => {
            const mediaSize = sizesFromMedia[size.slug];

            if (
                mediaSize &&
                // must be *smaller* than full in either dimension
                (mediaSize.width < full.width || mediaSize.height < full.height) &&
                // must not use the same URL as full
                mediaSize.url !== full.url
            ) {
                theImg[size.slug] = {
                    url: mediaSize.url,
                    width: mediaSize.width,
                    height: mediaSize.height,
                };
            }
        });

        // Save to attributes
        setAttributes({
            bgImg: theImg,
            bgSize: 'thumbnail',
        });
    };

    return (
        <PanelBody title={title} initialOpen={false}>
            <PanelRow>
                <div style={{ width: '100%' }}>
                    <MediaUpload
                        onSelect={onSelect}
                        type="image"
                        value={attributes.bgImg}
                        render={({ open }) => (
                            <>
                                <Button
                                    onClick={open}
                                    className="button button-large"
                                >
                                    {attributes.bgImg?.id ? 'Change Image' : 'Select Image'}
                                </Button>
                                {attributes.bgImg?.full?.url && (
                                    <Button
                                        onClick={(event) =>
                                            setAttributes({
                                                bgImg: {
                                                    id: '',
                                                },
                                                bgSize: 'thumbnail',
                                            })
                                        }
                                        className="button button-large"
                                        style={{ backgroundColor: '#D94A64', color: '#fff', marginLeft: '8px' }}
                                    >
                                        Reset
                                    </Button>
                                )}
                                {attributes.bgImg?.full?.url && (
                                    <div style={{ overflow: 'hidden', borderRadius: '12px', borderWidth: '1px', borderColor: '#CDCDCD', marginTop: '12px', padding: '0', lineHeight: '0.8', display: 'block' }}><img src={attributes.bgImg.full.url} alt={'Background Image'} /></div>
                                )}
                            </>
                        )}
                    />
                    {attributes.bgImg?.full?.url && (
                        <PanelRow>
                            <div style={{ width: '100%' }}>
                                <p
                                    style={{
                                        display: 'block',
                                        marginTop: '12px',
                                        marginBottom: '8px',
                                        textTransform: 'uppercase',
                                        fontSize: '11px',
                                        fontWeight: '500',
                                    }}
                                >
                                    Image Alignment
                                </p>
                                <div className='method-bgalign-control-wrap'>
                                    <AlignmentMatrixControl
                                        value={attributes.bgImgAlign}
                                        onChange={(value) => setAttributes({ bgImgAlign: value })}
                                        width={36}
                                    />
                                    <span className='method-bgalign-control-wrap-value'>{attributes.bgImgAlign}</span>
                                </div>
                            </div>
                        </PanelRow>
                    )}
                    {attributes.bgImg?.full?.url && (
                        <PanelRow>
                            <div style={{ width: '100%' }}>
                                <CustomSelectControl
                                    __next40pxDefaultSize
                                    label="Background Resolution"
                                    options={availableSizes}
                                    value={availableSizes.find(opt => opt.key === attributes.bgSize)}
                                    onChange={(option) => {
                                        setAttributes({ bgSize: option?.selectedItem?.key })
                                    }}
                                />
                            </div>
                        </PanelRow>
                    )}
                </div>
            </PanelRow>
        </PanelBody>
    );
}
