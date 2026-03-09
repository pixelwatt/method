/* eslint-disable prettier/prettier */

/**
 * Block configuration — which core blocks get which Method capabilities.
 *
 * spacing:    object with `include` and `sides` arrays matching MethodSpacingControlsV2 props
 * typography: boolean — whether to show MethodTypographyControlsV2
 *
 * editorCssMap:  function( clientId ) → selectorMap for MethodStyleTag (editor preview)
 * frontendCssProperties: array of CSS property keys for method_get_block_responsive_styles
 */
export const blockConfig = {
    'core/paragraph': {
        spacing: {
            include: ['padding', 'margin'],
            sides: {
                padding: ['top', 'bottom', 'left', 'right'],
                margin: ['top', 'bottom'],
            },
        },
        typography: true,
        editorCssMap: (clientId) => ({
            [`#block-${clientId}`]: [
                'padding-top',
                'padding-bottom',
                'padding-left',
                'padding-right',
                'margin-top',
                'margin-bottom',
                'fontSize',
                'lineHeight',
                'textAlign',
            ],
        }),
    },
    'core/heading': {
        spacing: {
            include: ['margin'],
            sides: {
                margin: ['top', 'bottom'],
            },
        },
        typography: true,
        editorCssMap: (clientId) => ({
            [`#block-${clientId}`]: [
                'margin-top',
                'margin-bottom',
                'fontSize',
                'lineHeight',
                'textAlign',
            ],
        }),
    },
    'core/list': {
        spacing: {
            include: ['padding', 'margin'],
            sides: {
                padding: ['top', 'bottom', 'left', 'right'],
                margin: ['top', 'bottom'],
            },
        },
        typography: true,
        editorCssMap: (clientId) => ({
            [`#block-${clientId}`]: [
                'padding-top',
                'padding-bottom',
                'padding-left',
                'padding-right',
                'margin-top',
                'margin-bottom',
                'fontSize',
                'lineHeight',
            ],
        }),
    },
};

/**
 * Quick lookup: all block names we're targeting.
 */
export const TARGET_BLOCKS = Object.keys(blockConfig);

/**
 * Default responsiveSettings — no base values (core owns base),
 * only responsive breakpoint scaffolding.
 */
export const RESPONSIVE_DEFAULTS = {
    base: {
        enabled: true,
    },
    mobile: {
        enabled: false,
        customSpacing: false,
        customType: false,
        padding: { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
        margin: { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
        fontSize: '',
        lineHeight: '',
        textAlign: '',
        allowNegative: false,
    },
    tablet: {
        enabled: false,
        customSpacing: false,
        customType: false,
        padding: { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
        margin: { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
        fontSize: '',
        lineHeight: '',
        textAlign: '',
        allowNegative: false,
    },
    wide: {
        enabled: false,
        customSpacing: false,
        customType: false,
        padding: { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
        margin: { top: '0rem', bottom: '0rem', left: '0rem', right: '0rem' },
        fontSize: '',
        lineHeight: '',
        textAlign: '',
        allowNegative: false,
    },
};
