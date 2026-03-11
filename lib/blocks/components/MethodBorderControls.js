/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
    BorderBoxControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __experimentalBorderRadiusControl as BorderRadiusControl } from '@wordpress/block-editor';


export default function MethodBorderControls({
    breakpoint,
    attributes,
    setAttributes,
    include = ['border', 'borderRadius'],
}) {
    const settings = attributes.responsiveSettings?.[breakpoint] || {};

    const updateSettings = (key, value, remove = false) => {
        if (remove) {
            const { [key]: _, ...remainingSettings } = settings;
            setAttributes({
                responsiveSettings: {
                    ...attributes.responsiveSettings,
                    [breakpoint]: remainingSettings,
                },
            });
        } else {
            setAttributes({
                responsiveSettings: {
                    ...attributes.responsiveSettings,
                    [breakpoint]: {
                        ...settings,
                        [key]: value,
                    },
                },
            });
        }
    };

    const resetAll = () => {
        const keysToRemove = ['border', 'borderRadius'];
        const remaining = Object.fromEntries(
            Object.entries(settings).filter(([key]) => !keysToRemove.includes(key))
        );
        setAttributes({
            responsiveSettings: {
                ...attributes.responsiveSettings,
                [breakpoint]: remaining,
            },
        });
    };

    return (
        <div className="method-control-set" style={{ width: '100%' }}>
            <ToolsPanel label="Border" resetAll={resetAll}>
                    {include.includes('border') && (
                        <ToolsPanelItem
                            label="Border"
                            hasValue={() => settings.border !== undefined}
                            onDeselect={() => updateSettings('border', undefined, true)}
                            onSelect={() => updateSettings('border', {})}
                        >
                            <BorderBoxControl
                                label="Border"
                                value={settings.border || {}}
                                onChange={(value) => updateSettings('border', value)}
                            />
                        </ToolsPanelItem>
                    )}
                    {include.includes('borderRadius') && (
                        <ToolsPanelItem
                            label="Border Radius"
                            hasValue={() => settings.borderRadius !== undefined}
                            onDeselect={() => updateSettings('borderRadius', undefined, true)}
                            onSelect={() => updateSettings('borderRadius', {})}
                        >
                            <BorderRadiusControl
                                label="Border Radius"
                                values={settings.borderRadius || {}}
                                onChange={(value) => updateSettings('borderRadius', value)}
                            />
                        </ToolsPanelItem>
                    )}
                </ToolsPanel>
        </div>
    );
}
