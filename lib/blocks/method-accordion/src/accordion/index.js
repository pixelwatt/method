/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Edit from './edit';
import { useInnerBlocksProps } from '@wordpress/block-editor';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import { getAccordionElementId } from '../../../utils/accordionId';

const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M35.14,10.15c2.74,0,4.97,2.23,4.97,4.97s-2.23,4.97-4.97,4.97H14.86c-2.74,0-4.97-2.23-4.97-4.97s2.23-4.97,4.97-4.97h20.28ZM35.14,7.15H14.86c-4.4,0-7.97,3.57-7.97,7.97s3.57,7.97,7.97,7.97h20.28c4.4,0,7.97-3.57,7.97-7.97s-3.57-7.97-7.97-7.97h0ZM35,14.41c.39,0,.71.32.71.71s-.32.71-.71.71-.71-.32-.71-.71.32-.71.71-.71h0ZM35,12.41c-1.49,0-2.71,1.21-2.71,2.71s1.21,2.71,2.71,2.71,2.71-1.21,2.71-2.71-1.21-2.71-2.71-2.71h0ZM27.27,13.11h-12.63c-1.1,0-2,.9-2,2h0c0,1.1.9,2,2,2h12.63c1.1,0,2-.9,2-2h0c0-1.1-.9-2-2-2ZM35.14,29.91c2.74,0,4.97,2.23,4.97,4.97s-2.23,4.97-4.97,4.97H14.86c-2.74,0-4.97-2.23-4.97-4.97s2.23-4.97,4.97-4.97h20.28ZM35.14,26.91H14.86c-4.4,0-7.97,3.57-7.97,7.97s3.57,7.97,7.97,7.97h20.28c4.4,0,7.97-3.57,7.97-7.97s-3.57-7.97-7.97-7.97h0ZM35,34.18c.39,0,.71.32.71.71s-.32.71-.71.71-.71-.32-.71-.71.32-.71.71-.71h0ZM35,32.18c-1.49,0-2.71,1.21-2.71,2.71s1.21,2.71,2.71,2.71,2.71-1.21,2.71-2.71-1.21-2.71-2.71-2.71h0ZM27.27,32.87h-12.63c-1.1,0-2,.9-2,2h0c0,1.1.9,2,2,2h12.63c1.1,0,2-.9,2-2h0c0-1.1-.9-2-2-2Z" /></svg>
);

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: ({ attributes }) => {
        const { accordionId } = attributes;
        const innerBlocksProps = useInnerBlocksProps.save(
            { className: 'accordion', id: getAccordionElementId(accordionId) },
            {}
        );
        return <div {...innerBlocksProps} />;
    },
});