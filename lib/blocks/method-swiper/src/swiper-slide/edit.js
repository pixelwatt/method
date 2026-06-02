/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
} from '@wordpress/components';

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
    const blockProps = useBlockProps({ className: 'swiper-slide' });
    const innerBlocksProps = useInnerBlocksProps(
        { className: 'method-swiper-slide-inner' },
        { template: TEMPLATE }
    );

    return (
        <>
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