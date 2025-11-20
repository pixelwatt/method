/* eslint-disable prettier/prettier */
import {
    PanelRow,
    Button,
    AlignmentMatrixControl,
    CustomSelectControl,
    SelectControl,
    CheckboxControl,
    Flex,
    FlexBlock,
    FlexItem,
    __experimentalUnitControl as UnitControl
} from '@wordpress/components';
import { MediaUpload, store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useMemo, Fragment } from '@wordpress/element';

export default function MethodBackgroundControls({
    breakpoint,
    attributes,
    setAttributes,
    isImg = false
}) {
    const settings = attributes.responsiveSettings?.[breakpoint] || {};

    const updateSettings = (key, value) => {
        setAttributes({
            responsiveSettings: {
                ...attributes.responsiveSettings,
                [breakpoint]: {
                    ...settings,
                    [key]: value,
                },
            },
        });
    };

    let isEnabled;
    if (breakpoint === 'base') {
        isEnabled = true;
    } else {
        isEnabled = attributes?.responsiveSettings?.[breakpoint]?.customBg;
    }

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
        });
        if (!!theImg.large?.url) {
            updateSettings('bgImgSize', 'large');
        } else {
            updateSettings('bgImgSize', 'full')
        }

    };

    let sizeOpts = [
        { value: '', label: 'Image Size' },
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' },
        { value: 'custom', label: 'Custom' },
    ];
    if (isImg) {
        sizeOpts = [
            { value: '', label: 'Cover' },
            { value: '-contain', label: 'Contain' },
        ];
    }

    return (
        <Fragment>
            {breakpoint !== 'base' && (
                <PanelRow>
                    <CheckboxControl
                        label="Custom Background"
                        checked={!!isEnabled}
                        onChange={(value) =>
                            updateSettings('customBg', value)
                        }
                    />
                </PanelRow>
            )}
            {breakpoint === 'base' && (
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
                                                })
                                            }
                                            className="button button-large"
                                            style={{ backgroundColor: '#D94A64', color: '#fff', marginLeft: '8px' }}
                                        >
                                            Reset
                                        </Button>
                                    )}
                                    {attributes.bgImg?.full?.url && (
                                        <div style={{ overflow: 'hidden', borderRadius: '12px', borderWidth: '1px', borderColor: '#CDCDCD', marginTop: '12px', padding: '0', lineHeight: '0.8', display: 'block', backgroundColor: '#F0F0F1' }}><img src={attributes.bgImg.full.url} alt={'Background Image'} /></div>
                                    )}
                                </>
                            )}
                        />
                    </div>
                </PanelRow>
            )}
            {attributes.bgImg?.full?.url && !!isEnabled && !isImg && (
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
                                value={settings?.bgImgAlign || 'center center'}
                                onChange={(value) =>
                                    updateSettings('bgImgAlign', value)
                                }
                                width={36}
                            />
                            <span className='method-bgalign-control-wrap-value'>{settings?.bgImgAlign || 'center center'}</span>
                        </div>
                    </div>
                </PanelRow>
            )}
            {attributes.bgImg?.full?.url && !!isEnabled && !isImg && (
                <PanelRow>
                    <Flex>
                        <FlexItem>
                            <UnitControl
                                label="Offset X"
                                value={settings.bgOffsetX || '0px'}
                                onChange={(value) =>
                                    updateSettings('bgOffsetX', value)
                                }
                            />
                        </FlexItem>
                        <FlexItem>
                            <UnitControl
                                label="Offset Y"
                                value={settings.bgOffsetY || '0px'}
                                onChange={(value) =>
                                    updateSettings('bgOffsetY', value)
                                }
                            />
                        </FlexItem>
                    </Flex>
                </PanelRow>
            )}
            {attributes.bgImg?.full?.url && !!isEnabled && (
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <CustomSelectControl
                            __next40pxDefaultSize
                            label={`${!isImg ? 'Background' : 'Image'} Resolution`}
                            options={availableSizes}
                            value={availableSizes.find(opt => opt.key === settings.bgImgSize)}
                            onChange={(option) =>
                                updateSettings('bgImgSize', option?.selectedItem?.key)
                            }
                        />
                    </div>
                </PanelRow>
            )}
            {attributes.bgImg?.full?.url && !!isEnabled && (
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <SelectControl
                            label="Display Size"
                            value={settings?.bgDisplaySize || ''}
                            onChange={(value) =>
                                updateSettings('bgDisplaySize', value)
                            }
                            options={sizeOpts}
                        />
                    </div>
                </PanelRow>
            )}
            {attributes.bgImg?.full?.url && !!isEnabled && settings?.bgDisplaySize === 'custom' && !isImg && (
                <PanelRow>
                    <Flex>
                        <FlexItem>
                            <UnitControl
                                label="Width"
                                value={settings.bgWidth || '0px'}
                                onChange={(value) =>
                                    updateSettings('bgWidth', value)
                                }
                            />
                        </FlexItem>
                        <FlexItem>
                            <UnitControl
                                label="Height"
                                value={settings.bgHeight || '0px'}
                                onChange={(value) =>
                                    updateSettings('bgHeight', value)
                                }
                            />
                        </FlexItem>
                    </Flex>
                </PanelRow>
            )}
            {attributes.bgImg?.full?.url && !!isEnabled && !isImg && (
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <SelectControl
                            label="Repeat"
                            value={settings?.bgRepeat || ''}
                            onChange={(value) =>
                                updateSettings('bgRepeat', value)
                            }
                            options={[
                                { value: '', label: 'No Repeat' },
                                { value: 'repeat', label: 'Repeat' },
                                { value: 'repeat-x', label: 'Repeat X' },
                                { value: 'repeat-y', label: 'Repeat Y' },
                                { value: 'space', label: 'Space' },
                            ]}
                        />
                    </div>
                </PanelRow>
            )}
        </Fragment>
    );
}
