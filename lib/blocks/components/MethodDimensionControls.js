/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
import { PanelRow, CheckboxControl, TextControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';


export default function MethodDimensionControls({
    breakpoint,
    attributes,
    setAttributes,
    includeWidth = true,
    includeMinWidth = true,
    includeHeight = true,
    includeMinHeight = true,
    includeMhGroup = true,
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
        isEnabled = attributes?.responsiveSettings?.[breakpoint]?.customDimensions;
    }

    return (
        <div>
            {breakpoint !== 'base' && (
                <PanelRow>
                    <CheckboxControl
                        label="Custom Dimensions"
                        checked={!!isEnabled}
                        onChange={(value) =>
                            updateSettings('customDimensions', value)
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
                    {!!isEnabled && !!includeMinHeight && (
                        <UnitControl
                            label="Min Height"
                            value={settings.minHeight || '0px'}
                            onChange={(value) =>
                                updateSettings('minHeight', value)
                            }
                        />
                    )}
                    {!!isEnabled && !!includeHeight && (
                        <UnitControl
                            label="Height"
                            value={settings.height || '0px'}
                            onChange={(value) =>
                                updateSettings('height', value)
                            }
                        />
                    )}
                    {!!isEnabled && !!includeMinWidth && (
                        <UnitControl
                            label="Min Width"
                            value={settings.minWidth || '0px'}
                            onChange={(value) =>
                                updateSettings('minWidth', value)
                            }
                        />
                    )}
                    {!!isEnabled && !!includeWidth && (
                        <UnitControl
                            label="Width"
                            value={settings.width || '0px'}
                            onChange={(value) =>
                                updateSettings('width', value)
                            }
                        />
                    )}
                    {!!isEnabled && breakpoint === 'base' && !!includeMhGroup && (
                        <TextControl
                            label="MatchHeight Group"
                            value={settings.mh || ''}
                            onChange={(value) =>
                                updateSettings('mh', value)
                            }
                        />
                    )}
                </div>
            </PanelRow>
        </div>
    );
}
