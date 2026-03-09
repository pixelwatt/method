/* eslint-disable prettier/prettier */
import { addFilter } from '@wordpress/hooks';
import { TARGET_BLOCKS, RESPONSIVE_DEFAULTS } from '../config';

addFilter(
    'blocks.registerBlockType',
    'method/core-extensions/add-attributes',
    (settings, name) => {
        if (!TARGET_BLOCKS.includes(name)) {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                responsiveSettings: {
                    type: 'object',
                    default: RESPONSIVE_DEFAULTS,
                },
            },
        };
    }
);
