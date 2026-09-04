/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
    TextControl,
    RangeControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    __experimentalUnitControl as UnitControl,
    __experimentalNumberControl as NumberControl
} from '@wordpress/components';

export default function MethodBackdropControls({
    breakpoint,
    attributes,
    setAttributes,
    include = ['blur', 'brightness', 'contrast', 'grayscale', 'hueRotate', 'saturate', 'invert', 'sepia'],
    controlLabel = "Background Filters"
}) {
    const settings = attributes.responsiveSettings?.[breakpoint]?.backdrop || {};

    const updateBreakpoint = (updatedBackdrop) => {
        const updatedBreakpoint = {
            ...attributes.responsiveSettings?.[breakpoint],
        };

        if (Object.keys(updatedBackdrop).length === 0) {
            delete updatedBreakpoint.backdrop;
        } else {
            updatedBreakpoint.backdrop = updatedBackdrop;
        }

        setAttributes({
            responsiveSettings: {
                ...attributes.responsiveSettings,
                [breakpoint]: updatedBreakpoint,
            },
        });
    };

    const updateSettings = (key, value, remove = false) => {
        const updated = { ...settings };
        if (remove) {
            delete updated[key];
        } else {
            updated[key] = value;
        }
        updateBreakpoint(updated);
    };

    const updateMultipleSettings = (updates) => {
        const updated = { ...settings };
        updates.forEach(({ key, value, remove }) => {
            if (remove) {
                delete updated[key];
            } else {
                updated[key] = value;
            }
        });
        updateBreakpoint(updated);
    };

    const resetAll = () => {
        updateBreakpoint({});
    };

    return (
        <div className="method-control-set" style={{ width: '100%' }}>
            <ToolsPanel label={controlLabel} resetAll={resetAll}>
                {include.includes('blur') && (
                    <ToolsPanelItem
                        label="Blur"
                        hasValue={() => settings.blur !== undefined}
                        onDeselect={() => updateSettings('blur', undefined, true)}
                        onSelect={() => updateSettings('blur', '0px')}
                    >
                        <UnitControl
                            label="Blur"
                            value={settings.blur || '0px'}
                            onChange={(value) => updateSettings('blur', value)}
                            units={[{ value: 'px', label: 'px', default: 0 }]}
                            min={0}
                        />
                    </ToolsPanelItem>
                )}
                {include.includes('brightness') && (
                    <ToolsPanelItem
                        label="Brightness"
                        hasValue={() => settings.brightness !== undefined}
                        onDeselect={() => updateSettings('brightness', undefined, true)}
                        onSelect={() => updateSettings('brightness', '100%')}
                    >
                        <UnitControl
                            label="Brightness"
                            value={settings.brightness || '0px'}
                            onChange={(value) => updateSettings('brightness', value)}
                            units={[{ value: '%', label: '%', default: 100 }]}
                            min={0}
                        />
                    </ToolsPanelItem>
                )}
                {include.includes('contrast') && (
                    <ToolsPanelItem
                        label="Contrast"
                        hasValue={() => settings.contrast !== undefined}
                        onDeselect={() => updateSettings('contrast', undefined, true)}
                        onSelect={() => updateSettings('contrast', '100%')}
                    >
                        <UnitControl
                            label="Contrast"
                            value={settings.contrast || '0px'}
                            onChange={(value) => updateSettings('contrast', value)}
                            units={[{ value: '%', label: '%', default: 100 }]}
                            min={0}
                        />
                    </ToolsPanelItem>
                )}
                {include.includes('saturate') && (
                    <ToolsPanelItem
                        label="Saturation"
                        hasValue={() => settings.saturate !== undefined}
                        onDeselect={() => updateSettings('saturate', undefined, true)}
                        onSelect={() => updateSettings('saturate', '100%')}
                    >
                        <UnitControl
                            label="Saturation"
                            value={settings.saturate || '0px'}
                            onChange={(value) => updateSettings('saturate', value)}
                            units={[{ value: '%', label: '%', default: 100 }]}
                            min={0}
                        />
                    </ToolsPanelItem>
                )}
                {include.includes('hueRotate') && (
                    <ToolsPanelItem
                        label="Hue Rotate"
                        hasValue={() => settings.hueRotate !== undefined}
                        onDeselect={() => updateSettings('hueRotate', undefined, true)}
                        onSelect={() => updateSettings('hueRotate', '0deg')}
                    >
                        <UnitControl
                            label="Hue Rotate"
                            value={settings.hueRotate || '0deg'}
                            onChange={(value) => updateSettings('hueRotate', value)}
                            units={[{ value: 'deg', label: 'deg', default: 0 }]}
                            min={0}
                            max={360}
                        />
                    </ToolsPanelItem>
                )}
                {include.includes('grayscale') && (
                    <ToolsPanelItem
                        label="Grayscale"
                        hasValue={() => settings.grayscale !== undefined}
                        onDeselect={() => updateSettings('grayscale', undefined, true)}
                        onSelect={() => updateSettings('grayscale', 0)}
                    >
                        <RangeControl
                            label="Grayscale"
                            value={settings.grayscale || 0}
                            onChange={(value) => updateSettings('grayscale', value)}
                            min={0}
                            max={1}
                            step="0.01"
                        />
                    </ToolsPanelItem>
                )}
                {include.includes('invert') && (
                    <ToolsPanelItem
                        label="Invert"
                        hasValue={() => settings.invert !== undefined}
                        onDeselect={() => updateSettings('invert', undefined, true)}
                        onSelect={() => updateSettings('invert', 0)}
                    >
                        <RangeControl
                            label="Invert"
                            value={settings.invert || 0}
                            onChange={(value) => updateSettings('invert', value)}
                            min={0}
                            max={1}
                            step="0.01"
                        />
                    </ToolsPanelItem>
                )}
                {include.includes('sepia') && (
                    <ToolsPanelItem
                        label="Sepia"
                        hasValue={() => settings.sepia !== undefined}
                        onDeselect={() => updateSettings('sepia', undefined, true)}
                        onSelect={() => updateSettings('sepia', 0)}
                    >
                        <RangeControl
                            label="Sepia"
                            value={settings.sepia || 0}
                            onChange={(value) => updateSettings('sepia', value)}
                            min={0}
                            max={1}
                            step="0.01"
                        />
                    </ToolsPanelItem>
                )}
            </ToolsPanel>
        </div>
    );
}