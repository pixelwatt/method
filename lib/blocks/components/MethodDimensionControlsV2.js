/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
    TextControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    __experimentalUnitControl as UnitControl,
} from '@wordpress/components';


export default function MethodDimensionControls({
    breakpoint,
    attributes,
    setAttributes,
    include = ['width', 'minWidth', 'height', 'minHeight', 'mhGroup'],
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
        const keysToRemove = ['width', 'minWidth', 'height', 'minHeight', 'mh'];
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
            <ToolsPanel label="Dimensions" resetAll={resetAll}>
                    {include.includes('width') && (
                        <ToolsPanelItem
                            label="Width"
                            hasValue={() => settings.width !== undefined}
                            onDeselect={() => updateSettings('width', undefined, true)}
                            onSelect={() => updateSettings('width', '0px')}
                        >
                            <UnitControl
                                label="Width"
                                value={settings.width || '0px'}
                                onChange={(value) => updateSettings('width', value)}
                            />
                        </ToolsPanelItem>
                    )}
                    {include.includes('minWidth') && (
                        <ToolsPanelItem
                            label="Min Width"
                            hasValue={() => settings.minWidth !== undefined}
                            onDeselect={() => updateSettings('minWidth', undefined, true)}
                            onSelect={() => updateSettings('minWidth', '0px')}
                        >
                            <UnitControl
                                label="Min Width"
                                value={settings.minWidth || '0px'}
                                onChange={(value) => updateSettings('minWidth', value)}
                            />
                        </ToolsPanelItem>
                    )}
                    {include.includes('height') && (
                        <ToolsPanelItem
                            label="Height"
                            hasValue={() => settings.height !== undefined}
                            onDeselect={() => updateSettings('height', undefined, true)}
                            onSelect={() => updateSettings('height', '0px')}
                        >
                            <UnitControl
                                label="Height"
                                value={settings.height || '0px'}
                                onChange={(value) => updateSettings('height', value)}
                            />
                        </ToolsPanelItem>
                    )}
                    {include.includes('minHeight') && (
                        <ToolsPanelItem
                            label="Min Height"
                            hasValue={() => settings.minHeight !== undefined}
                            onDeselect={() => updateSettings('minHeight', undefined, true)}
                            onSelect={() => updateSettings('minHeight', '0px')}
                        >
                            <UnitControl
                                label="Min Height"
                                value={settings.minHeight || '0px'}
                                onChange={(value) => updateSettings('minHeight', value)}
                            />
                        </ToolsPanelItem>
                    )}
                    {include.includes('mhGroup') && breakpoint === 'base' && (
                        <ToolsPanelItem
                            label="MatchHeight Group"
                            hasValue={() => settings.mh !== undefined && settings.mh !== ''}
                            onDeselect={() => updateSettings('mh', undefined, true)}
                            onSelect={() => updateSettings('mh', '')}
                        >
                            <TextControl
                                label="MatchHeight Group"
                                value={settings.mh || ''}
                                onChange={(value) => updateSettings('mh', value)}
                            />
                        </ToolsPanelItem>
                    )}
                </ToolsPanel>
        </div>
    );
}
