/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { PanelRow, CheckboxControl, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';


export default function MethodAspectRatio({
    breakpoint,
    attributes,
    setAttributes,
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

    let isEnabled;
    if (breakpoint === 'base') {
        isEnabled = true;
    } else {
        isEnabled = attributes?.responsiveSettings?.[breakpoint]?.customAspect;
    }

    const heightUnits = [
        { value: 'px', label: 'px', default: 0 },
        { value: 'em', label: 'em', default: 0 },
        { value: 'rem', label: 'rem', default: 0 },
    ];

    const perUnits = [
        { value: '%', label: '%', default: 0 },
    ];

    return (
        <div>
            {breakpoint !== 'base' && (
                <PanelRow>
                    <CheckboxControl
                        label="Custom Aspect"
                        checked={!!isEnabled}
                        onChange={(value) =>
                            updateSettings('customAspect', value)
                        }
                    />
                </PanelRow>
            )}

            <PanelRow>
                <div
                    style={{
                        width: '100%',
                        marginTop: '12px',
                        marginBottom: '12px',
                    }}
                    className="method-unit-control-wrap"
                >
                    <SelectControl
                        label="Aspect / Sizing"
                        value={settings?.aspectUses}
                        options={[
                            { label: 'Default (Square)', value: '' },
                            { label: 'Ratio', value: 'ratio' },
                            { label: 'Height', value: 'height' },
                            { label: 'Percentage', value: 'percentage' },
                        ]}
                        onChange={(value) =>
                            updateSettings('aspectUses', value)
                        }
                    />

                    {attributes?.responsiveSettings?.[breakpoint]?.aspectUses === "ratio" && (
                        <SelectControl
                            label="Aspect Ratio"
                            value={settings?.aspectRatio}
                            options={[
                                { label: '1:1', value: '' },
                                { label: '3:2', value: '-3-2' },
                                { label: '4:3', value: '-4-3' },
                                { label: '5:4', value: '-5-4' },
                                { label: '16:9', value: '-16-9' },
                                { label: '2:3', value: '-2-3' },
                                { label: '3:4', value: '-3-4' },
                                { label: '4:5', value: '-4-5' },
                                { label: '9:16', value: '-9-16' },
                            ]}
                            onChange={(value) =>
                                updateSettings('aspectRatio', value)
                            }
                        />
                    )}
                    {attributes?.responsiveSettings?.[breakpoint]?.aspectUses === "height" && (
                        <UnitControl
                            label="Height"
                            value={settings?.height || '0px'}
                            onChange={(value) =>
                                updateSettings('height', value)
                            }
                            units={heightUnits}
                        />
                    )}
                    {attributes?.responsiveSettings?.[breakpoint]?.aspectUses === "percentage" && (
                        <UnitControl
                            label="Percentage"
                            value={settings?.aspectPercentage || '0%'}
                            onChange={(value) =>
                                updateSettings('aspectPercentage', value)
                            }
                            units={perUnits}
                        />
                    )}
                </div>
            </PanelRow>
        </div>
    );
}
