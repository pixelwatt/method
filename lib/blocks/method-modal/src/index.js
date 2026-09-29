/* eslint-disable prettier/prettier */
import Edit from './edit';
import icon from './icon';
import { useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: () => {
        const innerBlocksProps = useInnerBlocksProps.save(
            { className: 'method-modal-inner-blocks' },
            {}
        );
        return <div {...innerBlocksProps} />;
    },
});
