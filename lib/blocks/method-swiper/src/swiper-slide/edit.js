/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Default content inserted into every new swiper-slide.
const TEMPLATE = [
    [
        'method/container',
        {
            bgColor: '#e4e4e4',
            responsiveSettings: {
                base: {
                    enabled: true,
                    padding: { top: '1rem', bottom: '1rem', left: '2rem', right: '2rem' },
                    height: '300px',
                },
                mobile: { enabled: false, customBg: false },
                tablet: { enabled: false, customBg: false },
                wide: { enabled: false, customBg: false },
            },
        },
        [['core/paragraph', { content: 'Add slide content here!' }]],
    ],
];

export default function Edit({ attributes, setAttributes, clientId }) {
    const { hash = '' } = attributes;
    const blockProps = useBlockProps({
        className: 'swiper-slide',
        // Mirrors the frontend so the parent's hash navigation works in the editor too.
        'data-hash': hash || undefined,
    });
    const innerBlocksProps = useInnerBlocksProps(
        { className: 'method-swiper-slide-inner' },
        { template: TEMPLATE }
    );

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Hash navigation', 'method')}>
                    <TextControl
                        label={__('Slide hash', 'method')}
                        help={__('Unique value used in the URL hash when the parent swiper has hash navigation enabled.', 'method')}
                        value={hash}
                        onChange={(value) => setAttributes({ hash: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <div className="method-swiper-slide">
                    <div className="method-swiper-slide-inner">
                        <div {...innerBlocksProps} />
                    </div>
                </div>
            </div>
        </>
    );
}