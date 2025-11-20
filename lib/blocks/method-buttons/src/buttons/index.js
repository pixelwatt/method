/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M36.78 28.28v.44c0 .85-.69 1.55-1.55 1.55H14.77c-.85 0-1.55-.69-1.55-1.55v-.44c0-.85.69-1.55 1.55-1.55h20.47c.85 0 1.55.69 1.55 1.55Zm7-6.56c0 1.16-.23 2.27-.65 3.28.42 1.01.65 2.12.65 3.28v.44c0 4.72-3.83 8.55-8.55 8.55H14.77c-4.72 0-8.55-3.83-8.55-8.55v-.44c0-1.16.23-2.27.65-3.28a8.53 8.53 0 0 1-.65-3.28v-.44c0-4.72 3.83-8.55 8.55-8.55h20.47c4.72 0 8.55 3.83 8.55 8.55v.44Zm-33.54-.68c1.31-.82 2.86-1.3 4.52-1.3h20.47c1.66 0 3.21.48 4.52 1.3-.13-2.39-2.1-4.3-4.52-4.3H14.77c-2.42 0-4.39 1.91-4.52 4.3Zm-2.8 2.86.09-.15-.09.15Zm32.34 4.38c0-2.51-2.04-4.55-4.55-4.55H14.77c-2.51 0-4.55 2.04-4.55 4.55v.44c0 2.51 2.04 4.55 4.55 4.55h20.47c2.51 0 4.55-2.04 4.55-4.55v-.44Zm2.78-4.38-.09-.15.09.15Z" /></svg>
);

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save(
            { className: 'method-buttons' },
            {}
        );
        const innerBlocksProps = useInnerBlocksProps.save(
            { className: `method-buttons-inner-blocks align-items-${attributes.responsiveSettings.base.alignItems} justify-content-${attributes.responsiveSettings.base.justifyContent} flex-${attributes.responsiveSettings.base.flexDirection}` },
            {}
        );
        return <div {...innerBlocksProps} />;
    },
});
