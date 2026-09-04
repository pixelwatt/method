/* eslint-disable prettier/prettier */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { useState } from 'react';
import {
    Button,
    CheckboxControl,
    ColorPicker,
    RangeControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

const defaultShadow = { x: 0, y: 4, blur: 8, spread: 0, color: 'rgba(0,0,0,0.15)', inset: false };

function ShadowLayer({ value, onChange, onRemove, index, total, isCollapsed, onToggleCollapse }) {
    const update = (key, val) => {
        onChange({ ...value, [key]: val });
    };

    return (
        <div
            className="method-shadow-layer"
            style={{
                width: '100%',
                paddingTop: '8px',
                paddingBottom: index < total - 1 ? '8px' : '0',
                marginBottom: index < total - 1 ? '8px' : '0',
                borderBottom: index < total - 1 ? '1px solid #e0e0e0' : 'none',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <Button
                        variant="tertiary"
                        size="small"
                        onClick={onToggleCollapse}
                        style={{ minWidth: '24px', padding: '0 8px' }}
                        aria-expanded={!isCollapsed}
                    >
                        {isCollapsed ? '▶' : '▼'}
                    </Button>
                    <strong>Shadow {index + 1}</strong>
                </div>
                <Button variant="tertiary" isDestructive size="small" onClick={onRemove}>
                    Remove
                </Button>
            </div>
            {!isCollapsed && (
                <>
                    <div className="method-shadow-layer-control" style={{ width: '100%', paddingBlockEnd: '20px', paddingBlockStart: '12px' }}>
                        <RangeControl
                            label="Horizontal Offset"
                            value={value.x || 0}
                            onChange={(v) => update('x', v)}
                            min={-125}
                            max={125}
                            marks={[
                                { value: -100, label: '-100px' },
                                { value: 0, label: '0' },
                                { value: 100, label: '100px' },
                            ]}
                        />
                    </div>
                    <div className="method-shadow-layer-control" style={{ width: '100%', paddingBlockEnd: '20px' }}>
                        <RangeControl
                            label="Vertical Offset"
                            value={value.y || 0}
                            onChange={(v) => update('y', v)}
                            min={-125}
                            max={125}
                            marks={[
                                { value: -100, label: '-100px' },
                                { value: 0, label: '0' },
                                { value: 100, label: '100px' },
                            ]}
                        />
                    </div>
                    <div className="method-shadow-layer-control" style={{ width: '100%', paddingBlockEnd: '20px' }}>
                        <RangeControl
                            label="Blur Radius"
                            value={value.blur || 0}
                            onChange={(v) => update('blur', v)}
                            min={0}
                            max={200}
                            marks={[
                                { value: 0, label: '0' },
                                { value: 75, label: '75px' },
                                { value: 150, label: '150px' },
                            ]}
                        />
                    </div>
                    <div className="method-shadow-layer-control" style={{ width: '100%', paddingBlockEnd: '20px' }}>
                        <RangeControl
                            label="Spread"
                            value={value.spread || 0}
                            onChange={(v) => update('spread', v)}
                            min={-64}
                            max={64}
                            marks={[
                                { value: -50, label: '-50px' },
                                { value: 0, label: '0' },
                                { value: 50, label: '50px' },
                            ]}
                        />
                    </div>
                    <div className="method-shadow-layer-control" style={{ width: '100%', paddingBlockEnd: '8px' }}>
                        <ColorPicker
                            color={value.color || '#000'}
                            onChangeComplete={({ hex }) => update('color', hex)}
                            disableAlpha={false}
                        />
                    </div>
                    <div className="method-shadow-layer-control" style={{ width: '100%', paddingBlockEnd: '12px' }}>
                        <CheckboxControl
                            label="Inset"
                            checked={!!value.inset}
                            onChange={(v) => update('inset', v)}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default function MethodShadowControl({
    breakpoint,
    attributes,
    setAttributes,
}) {
    const settings = attributes.responsiveSettings?.[breakpoint] || {};
    const shadows = settings.shadows || [];
    const [collapsedStates, setCollapsedStates] = useState(Array(shadows.length).fill(true));

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

    const updateShadow = (index, newVal) => {
        const updated = [...shadows];
        updated[index] = newVal;
        updateSettings('shadows', updated);
    };

    const addShadow = () => {
        updateSettings('shadows', [...shadows, { ...defaultShadow }]);
        setCollapsedStates([...collapsedStates, true]);
    };

    const removeShadow = (index) => {
        const updated = shadows.filter((_, i) => i !== index);
        const newCollapsedStates = collapsedStates.filter((_, i) => i !== index);
        setCollapsedStates(newCollapsedStates);
        if (updated.length === 0) {
            updateSettings('shadows', undefined, true);
        } else {
            updateSettings('shadows', updated);
        }
    };

    const toggleCollapsed = (index) => {
        const updated = [...collapsedStates];
        updated[index] = !updated[index];
        setCollapsedStates(updated);
    };

    const resetAll = () => {
        const { shadows: _, ...remaining } = settings;
        setAttributes({
            responsiveSettings: {
                ...attributes.responsiveSettings,
                [breakpoint]: remaining,
            },
        });
        setCollapsedStates([]);
    };

    if (breakpoint !== 'base') return null;

    return (
        <div className="method-control-set" style={{ width: '100%' }}>
            <ToolsPanel label="Shadow" resetAll={resetAll}>
                <ToolsPanelItem
                    label="Box Shadow"
                    hasValue={() => shadows.length > 0}
                    onDeselect={() => updateSettings('shadows', undefined, true)}
                    onSelect={() => updateSettings('shadows', [{ ...defaultShadow }])}
                >
                    <div className="method-shadow-control" style={{ width: '100%' }}>
                        {shadows.map((shadow, i) => (
                            <ShadowLayer
                                key={i}
                                value={shadow}
                                onChange={(val) => updateShadow(i, val)}
                                onRemove={() => removeShadow(i)}
                                index={i}
                                total={shadows.length}
                                isCollapsed={collapsedStates[i] ?? true}
                                onToggleCollapse={() => toggleCollapsed(i)}
                            />
                        ))}
                        <Button
                            variant="secondary"
                            onClick={addShadow}
                            style={{ marginTop: '12px', width: '100%' }}
                        >
                            Add Shadow Layer
                        </Button>
                    </div>
                </ToolsPanelItem>
            </ToolsPanel>
        </div>
    );
}
