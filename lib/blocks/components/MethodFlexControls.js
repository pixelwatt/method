/* eslint-disable prettier/prettier */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
    __experimentalNumberControl as NumberControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    __experimentalUnitControl as UnitControl,
} from '@wordpress/components';


export default function MethodFlexControls({
    breakpoint,
    attributes,
    setAttributes,
    label = 'Flex Options',
    include = ['flexGrow', 'flexShrink', 'flexBasis'],
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
        const keysToRemove = ['flexGrow', 'flexShrink', 'flexBasis'];
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
            <ToolsPanel label={label} resetAll={resetAll}>
                {include.includes('flexGrow') && (
                    <ToolsPanelItem
                        label="Flex Grow"
                        hasValue={() => settings.flexGrow !== undefined}
                        onDeselect={() => updateSettings('flexGrow', undefined, true)}
                        onSelect={() => updateSettings('flexGrow', 0)}
                    >
                        <NumberControl
                            label="Flex Grow"
                            value={settings.flexGrow ?? 0}
                            min={0}
                            onChange={(value) => updateSettings('flexGrow', parseInt(value, 10))}
                        />
                    </ToolsPanelItem>
                )}
                {include.includes('flexShrink') && (
                    <ToolsPanelItem
                        label="Flex Shrink"
                        hasValue={() => settings.flexShrink !== undefined}
                        onDeselect={() => updateSettings('flexShrink', undefined, true)}
                        onSelect={() => updateSettings('flexShrink', 1)}
                    >
                        <NumberControl
                            label="Flex Shrink"
                            value={settings.flexShrink ?? 1}
                            min={0}
                            onChange={(value) => updateSettings('flexShrink', parseInt(value, 10))}
                        />
                    </ToolsPanelItem>
                )}
                {include.includes('flexBasis') && (
                    <ToolsPanelItem
                        label="Flex Basis"
                        hasValue={() => settings.flexBasis !== undefined}
                        onDeselect={() => updateSettings('flexBasis', undefined, true)}
                        onSelect={() => updateSettings('flexBasis', 'auto')}
                    >
                        <UnitControl
                            label="Flex Basis"
                            value={settings.flexBasis || 'auto'}
                            onChange={(value) => updateSettings('flexBasis', value)}
                        />
                    </ToolsPanelItem>
                )}
            </ToolsPanel>
        </div>
    );
}
