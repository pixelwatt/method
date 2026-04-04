/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
    TextControl,
    ToggleControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    __experimentalUnitControl as UnitControl,
    __experimentalNumberControl as NumberControl
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

    const updateMultipleSettings = (updates) => {
        // updates: array of { key, value, remove? }
        const updated = { ...settings };
        updates.forEach(({ key, value, remove }) => {
            if (remove) {
                delete updated[key];
            } else {
                updated[key] = value;
            }
        });
        setAttributes({
            responsiveSettings: {
                ...attributes.responsiveSettings,
                [breakpoint]: updated,
            },
        });
    };

    const resetAll = () => {
        const keysToRemove = ['width', 'minWidth', 'height', 'minHeight', 'mh', 'zeroHeight', 'aspectRatioX', 'aspectRatioY'];
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
                {include.includes('zeroHeight') && (
                    <ToolsPanelItem
                        label="Zero Height"
                        hasValue={() => settings.zeroHeight === true}
                        onDeselect={() => updateSettings('zeroHeight', undefined, true)}
                        onSelect={() => updateSettings('zeroHeight', false)}
                    >
                        <ToggleControl
                            label="Zero Height"
                            help="Sets height to 0 with overflow visible — content remains visible but takes no vertical space."
                            checked={settings.zeroHeight === true}
                            onChange={(value) => updateSettings('zeroHeight', value ? true : false)}
                        />
                    </ToolsPanelItem>
                )}
                {include.includes('aspectRatio') && (
                    <ToolsPanelItem
                        label="Aspect Ratio"
                        hasValue={() => settings.aspectRatioX !== undefined}
                        onDeselect={() => updateMultipleSettings([
                            { key: 'aspectRatioX', remove: true },
                            { key: 'aspectRatioY', remove: true },
                        ])}
                        onSelect={() => updateMultipleSettings([
                            { key: 'aspectRatioX', value: 1 },
                            { key: 'aspectRatioY', value: 1 },
                        ])}
                    >
                        <p
                            style={{
                                display: 'block',
                                marginTop: '12px',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                fontSize: '11px',
                                fontWeight: '500',
                            }}
                        >
                            Aspect Ratio
                        </p>
                        <div className='method-aspect-ratio-layout'>
                            <NumberControl
                                value={settings.aspectRatioX || 1}
                                onChange={(value) => updateSettings('aspectRatioX', value)}
                                min={1}
                                max={100}
                                size="__unstable-large"
                            />
                            <div className='method-aspect-ratio-layout-divider'>/</div>
                            <NumberControl
                                value={settings.aspectRatioY || 1}
                                onChange={(value) => updateSettings('aspectRatioY', value)}
                                min={1}
                                max={100}
                                size="__unstable-large"
                            />
                        </div>
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
