/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps
} from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({ className: 'accordion-body' }, {});
    const innerBlocksProps = useInnerBlocksProps(
        { className: 'accordion-body-inner' },
        {
            template: [['core/paragraph', { content: 'Accordion content.' }]],
            templateLock: false,
        }
    );

    return (
        <div {...blockProps}>
            <div {...innerBlocksProps} />
        </div>
    );
}