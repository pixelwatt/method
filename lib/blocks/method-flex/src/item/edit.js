/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
} from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({ className: `method-flex-item` }, {});
    const innerBlocksProps = useInnerBlocksProps(
        { className: `method-flex-item-inner-blocks` },
        {}
    );
    return (
        <>
            <div {...blockProps}>
                <div {...innerBlocksProps} />
            </div>
        </>
    );
}