/* eslint-disable no-duplicate-imports */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/* eslint-disable prettier/prettier */
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
    PanelRow,
    SelectControl
} from '@wordpress/components';

export default function MethodAlignmentControls({
    breakpoint,
    attributes,
    setAttributes,
    include = ['alignItems', 'justifyContent'],
    alignItemsLabel = 'Align Items',
}) {
    const settings = attributes.responsiveSettings?.[breakpoint] || {};

    const updateSettings = (key, value) => {
        setAttributes({
            responsiveSettings: {
                ...attributes.responsiveSettings,
                [breakpoint]: {
                    ...settings,
                    [key]: value,
                },
            },
        });
    };

    const iconAlignBetween = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path d="M50,47.63c0,1.31-1.06,2.37-2.37,2.37H2.37C1.06,50,0,48.94,0,47.63s1.06-2.37,2.37-2.37h45.26c1.31,0,2.37,1.06,2.37,2.37ZM2.37,4.74h45.26c1.31,0,2.37-1.06,2.37-2.37S48.94,0,47.63,0H2.37C1.06,0,0,1.06,0,2.37s1.06,2.37,2.37,2.37ZM13.99,8.07c4.67,0,8.45,3.78,8.45,8.45v16.95c0,4.67-3.78,8.45-8.45,8.45h0c-4.67,0-8.45-3.78-8.45-8.45v-16.95c0-4.67,3.78-8.45,8.45-8.45h0ZM13.99,11.07c-3.01,0-5.45,2.45-5.45,5.45v16.95c0,3.01,2.45,5.45,5.45,5.45s5.45-2.45,5.45-5.45v-16.95c0-3.01-2.45-5.45-5.45-5.45ZM27.2,16.53v16.95c0,4.67,3.78,8.45,8.45,8.45s8.45-3.78,8.45-8.45v-16.95c0-4.67-3.78-8.45-8.45-8.45s-8.45,3.78-8.45,8.45Z" />
        </svg>
    );
    const iconAlignStart = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path d="M50,2.37c0,1.31-1.06,2.37-2.37,2.37H2.37C1.06,4.74,0,3.68,0,2.37S1.06,0,2.37,0h45.26c1.31,0,2.37,1.06,2.37,2.37ZM22.44,16.77v19.32c0,4.67-3.78,8.45-8.45,8.45h0c-4.67,0-8.45-3.78-8.45-8.45v-19.32c0-4.67,3.78-8.45,8.45-8.45h0c4.67,0,8.45,3.78,8.45,8.45ZM19.44,16.77c0-3.01-2.45-5.45-5.45-5.45s-5.45,2.45-5.45,5.45v19.32c0,3.01,2.45,5.45,5.45,5.45s5.45-2.45,5.45-5.45v-19.32ZM35.66,8.32c-4.67,0-8.45,3.78-8.45,8.45v11.41c0,4.67,3.78,8.45,8.45,8.45s8.45-3.78,8.45-8.45v-11.41c0-4.67-3.78-8.45-8.45-8.45Z" />
        </svg>
    );
    const iconAlignCenter = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path d="M47.63,22.78h-3.52v-3.34c0-4.67-3.78-8.45-8.45-8.45s-8.45,3.78-8.45,8.45v3.34h-4.76v-7.29c0-4.67-3.78-8.45-8.45-8.45s-8.45,3.78-8.45,8.45v7.29h-3.17C1.06,22.78,0,23.84,0,25.15s1.06,2.37,2.37,2.37h3.17v7.29c0,4.67,3.78,8.45,8.45,8.45s8.45-3.78,8.45-8.45v-7.29h4.76v3.34c0,4.67,3.78,8.45,8.45,8.45s8.45-3.78,8.45-8.45v-3.34h3.52c1.31,0,2.37-1.06,2.37-2.37s-1.06-2.37-2.37-2.37ZM19.44,34.8c0,3.01-2.45,5.45-5.45,5.45s-5.45-2.45-5.45-5.45V15.49c0-3.01,2.45-5.45,5.45-5.45s5.45,2.45,5.45,5.45v19.32Z" />
        </svg>
    );
    const iconAlignEnd = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path d="M50,47.63c0,1.31-1.06,2.37-2.37,2.37H2.37C1.06,50,0,48.94,0,47.63s1.06-2.37,2.37-2.37h45.26c1.31,0,2.37,1.06,2.37,2.37ZM5.54,33.23V13.91c0-4.67,3.78-8.45,8.45-8.45h0c4.67,0,8.45,3.78,8.45,8.45v19.32c0,4.67-3.78,8.45-8.45,8.45h0c-4.67,0-8.45-3.78-8.45-8.45ZM8.54,33.23c0,3.01,2.45,5.45,5.45,5.45s5.45-2.45,5.45-5.45V13.91c0-3.01-2.45-5.45-5.45-5.45s-5.45,2.45-5.45,5.45v19.32ZM35.66,41.68c4.67,0,8.45-3.78,8.45-8.45v-11.41c0-4.67-3.78-8.45-8.45-8.45s-8.45,3.78-8.45,8.45v11.41c0,4.67,3.78,8.45,8.45,8.45Z" />
        </svg>
    );

    const iconJustifyStart = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path d="M4.74,2.37v45.26c0,1.31-1.06,2.37-2.37,2.37S0,48.94,0,47.63V2.37C0,1.06,1.06,0,2.37,0s2.37,1.06,2.37,2.37ZM18.86,11.89v26.22c0,2.76-2.24,5-5,5s-5-2.24-5-5V11.89c0-2.76,2.24-5,5-5s5,2.24,5,5ZM15.86,11.89c0-1.1-.9-2-2-2s-2,.9-2,2v26.22c0,1.1.9,2,2,2s2-.9,2-2V11.89ZM27.2,6.89c-2.76,0-5,2.24-5,5v26.22c0,2.76,2.24,5,5,5s5-2.24,5-5V11.89c0-2.76-2.24-5-5-5Z" />
        </svg>
    );
    const iconJustifyCenter = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path d="M4.74,2.37v45.26c0,1.31-1.06,2.37-2.37,2.37S0,48.94,0,47.63V2.37C0,1.06,1.06,0,2.37,0s2.37,1.06,2.37,2.37ZM47.63,0C46.32,0,45.26,1.06,45.26,2.37v45.26c0,1.31,1.06,2.37,2.37,2.37s2.37-1.06,2.37-2.37V2.37C50,1.06,48.94,0,47.63,0ZM23.33,11.89v26.22c0,2.76-2.24,5-5,5s-5-2.24-5-5V11.89c0-2.76,2.24-5,5-5s5,2.24,5,5ZM20.33,11.89c0-1.1-.9-2-2-2s-2,.9-2,2v26.22c0,1.1.9,2,2,2s2-.9,2-2V11.89ZM31.67,6.89c-2.76,0-5,2.24-5,5v26.22c0,2.76,2.24,5,5,5s5-2.24,5-5V11.89c0-2.76-2.24-5-5-5Z" />
        </svg>
    );
    const iconJustifyEnd = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path d="M50,2.37v45.26c0,1.31-1.06,2.37-2.37,2.37s-2.37-1.06-2.37-2.37V2.37C45.26,1.06,46.32,0,47.63,0s2.37,1.06,2.37,2.37ZM36.14,6.89c-2.76,0-5,2.24-5,5v26.22c0,2.76,2.24,5,5,5s5-2.24,5-5V11.89c0-2.76-2.24-5-5-5ZM27.8,11.89v26.22c0,2.76-2.24,5-5,5s-5-2.24-5-5V11.89c0-2.76,2.24-5,5-5s5,2.24,5,5ZM24.8,11.89c0-1.1-.9-2-2-2s-2,.9-2,2v26.22c0,1.1.9,2,2,2s2-.9,2-2V11.89Z" />
        </svg>
    );
    const iconJustifyBetween = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path d="M50,2.37v45.26c0,1.31-1.06,2.37-2.37,2.37s-2.37-1.06-2.37-2.37V2.37C45.26,1.06,46.32,0,47.63,0s2.37,1.06,2.37,2.37ZM36.14,6.89c-2.76,0-5,2.24-5,5v26.22c0,2.76,2.24,5,5,5s5-2.24,5-5V11.89c0-2.76-2.24-5-5-5ZM2.37,0C1.06,0,0,1.06,0,2.37v45.26C0,48.94,1.06,50,2.37,50s2.37-1.06,2.37-2.37V2.37C4.74,1.06,3.68,0,2.37,0ZM18.86,11.89v26.22c0,2.76-2.24,5-5,5s-5-2.24-5-5V11.89c0-2.76,2.24-5,5-5s5,2.24,5,5ZM15.86,11.89c0-1.1-.9-2-2-2s-2,.9-2,2v26.22c0,1.1.9,2,2,2s2-.9,2-2V11.89Z" />
        </svg>
    );

    return (
        <>
            {include.includes('alignItems') && (
                <PanelRow>
                    <div style={{ width: '100%', marginBottom: '12px' }}>
                        <ToggleGroupControl
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom
                            isBlock
                            label={alignItemsLabel}
                            value={settings.alignItems}
                            onChange={(value) =>
                                updateSettings('alignItems', value)
                            }
                        >
                            <ToggleGroupControlOptionIcon
                                value="start"
                                icon={iconAlignStart}
                                label="Start"
                            />
                            <ToggleGroupControlOptionIcon
                                value="center"
                                icon={iconAlignCenter}
                                label="Center"
                            />
                            <ToggleGroupControlOptionIcon
                                value="end"
                                icon={iconAlignEnd}
                                label="End"
                            />
                            <ToggleGroupControlOptionIcon
                                value="stretch"
                                icon={iconAlignBetween}
                                label="Stretch"
                            />
                        </ToggleGroupControl>
                    </div>
                </PanelRow>
            )}
            {include.includes('justifyContent') && (
                <PanelRow>
                    <div style={{ width: '100%', marginBottom: '12px' }}>
                        <ToggleGroupControl
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom
                            isBlock
                            label="Justify Content"
                            value={settings.justifyContent}
                            onChange={(value) =>
                                updateSettings('justifyContent', value)
                            }
                        >
                            <ToggleGroupControlOptionIcon
                                value="start"
                                icon={iconJustifyStart}
                                label="Start"
                            />
                            <ToggleGroupControlOptionIcon
                                value="center"
                                icon={iconJustifyCenter}
                                label="Center"
                            />
                            <ToggleGroupControlOptionIcon
                                value="end"
                                icon={iconJustifyEnd}
                                label="End"
                            />
                            <ToggleGroupControlOptionIcon
                                value="between"
                                icon={iconJustifyBetween}
                                label="Between"
                            />
                        </ToggleGroupControl>
                    </div>
                </PanelRow>
            )}
            {include.includes('flexDirection') && (
                <PanelRow>
                    <div style={{ width: '100%', marginBottom: '12px' }}>
                        <SelectControl
                            label="Direction"
                            value={settings.flexDirection}
                            options={[
                                { label: 'Row', value: 'row' },
                                { label: 'Row (Reverse)', value: 'row-reverse' },
                                { label: 'Column', value: 'column' },
                                { label: 'Column (Reverse)', value: 'column-reverse' },
                            ]}
                            onChange={(value) =>
                                updateSettings('flexDirection', value)
                            }
                        />
                    </div>
                </PanelRow>
            )}
        </>
    );
}
