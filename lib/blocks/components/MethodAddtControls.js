/* eslint-disable prettier/prettier */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
    SelectControl,
    __experimentalNumberControl as NumberControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';


export default function MethodAddtControls({
    breakpoint,
    attributes,
    setAttributes,
    label = 'Additional Options',
    include = ['overflow', 'zIndex'],
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
        const keysToRemove = ['overflow', 'zIndex'];
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
                {include.includes('overflow') && (
                    <ToolsPanelItem
                        label="Overflow"
                        hasValue={() => settings.overflow !== undefined}
                        onDeselect={() => updateSettings('overflow', undefined, true)}
                        onSelect={() => updateSettings('overflow', 'visible')}
                    >
                        <SelectControl
                            label="Overflow"
                            value={settings.overflow || 'visible'}
                            options={[
                                { label: 'Visible', value: 'visible' },
                                { label: 'Hidden', value: 'hidden' },
                                { label: 'Scroll', value: 'scroll' },
                                { label: 'Auto', value: 'auto' },
                                { label: 'Clip', value: 'clip' },
                            ]}
                            onChange={(value) => updateSettings('overflow', value)}
                        />
                    </ToolsPanelItem>
                )}
                {include.includes('zIndex') && (
                    <ToolsPanelItem
                        label="Z-Index"
                        hasValue={() => settings.zIndex !== undefined}
                        onDeselect={() => updateSettings('zIndex', undefined, true)}
                        onSelect={() => updateSettings('zIndex', 0)}
                    >
                        <NumberControl
                            label="Z-Index"
                            value={settings.zIndex ?? 0}
                            onChange={(value) => updateSettings('zIndex', parseInt(value, 10))}
                            shiftStep={10}
                        />
                    </ToolsPanelItem>
                )}
            </ToolsPanel>
        </div>
    );
}
