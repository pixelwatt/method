/* eslint-disable prettier/prettier */
import {
    PanelBody,
    PanelRow,
    TextControl,
    Button,
    AlignmentMatrixControl
} from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';

export default function MethodBackgroundControls({
    attributes,
    setAttributes,
    title = 'Background Media',
}) {
    return (
        <PanelBody title={title} initialOpen={false}>
            <PanelRow>
                <div style={{ width: '100%' }}>
                    <p
                        style={{
                            display: 'block',
                            marginBottom: '4px',
                            textTransform: 'uppercase',
                            fontSize: '11px',
                            fontWeight: '500',
                        }}
                    >
                        Image
                    </p>
                    <MediaUpload
                        onSelect={(media) =>
                            //console.log( media )
                            setAttributes({
                                bgImg: {
                                    full: media.sizes.full
                                        ? media.sizes.full.url
                                        : media.url,
                                    large: media.sizes.large
                                        ? media.sizes.large.url
                                        : media.url,
                                    id: media.id,
                                },
                            })
                        }
                        type="image"
                        value={attributes.bgImg}
                        render={({ open }) => (
                            <>
                                <Button
                                    onClick={open}
                                    className="button button-large"
                                >
                                    Choose
                                </Button>
                                <Button
                                    onClick={(event) =>
                                        setAttributes({
                                            bgImg: {
                                                full: '',
                                                large: '',
                                                id: ''
                                            }
                                        })
                                    }
                                    className="button button-large"
                                    style={{ backgroundColor: '#D94A64', color: '#fff', marginLeft: '8px' }}
                                >
                                    Reset
                                </Button>
                            </>
                        )}
                    />
                    {attributes.bgImg.large && (
                        <>
                            <div style={{ overflow: 'hidden', borderRadius: '12px', borderWidth: '1px', borderColor: '#CDCDCD', marginTop: '12px' }}>
                                <img
                                    src={attributes.bgImg.large}
                                    alt={'Background Image'}
                                />
                            </div>
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
                        </>
                    )}
                </div>
            </PanelRow>
        </PanelBody>
    );
}
