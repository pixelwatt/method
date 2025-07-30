/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
import { BorderBoxControl, PanelRow } from '@wordpress/components';
import { __experimentalBorderRadiusControl as BorderRadiusControl } from '@wordpress/block-editor';


export default function MethodBorderControls({
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



    return (
        <div>
            <PanelRow>
                <div
                    style={{
                        width: '100%',
                        marginTop: '12px',
                        marginBottom: '12px',
                    }}
                    className="method-box-control-wrap"
                >
                    <BorderBoxControl
                        label="Border"
                        value={settings.border || {}}
                        onChange={(value) =>
                            updateSettings('border', value)
                        }
                    />
                </div>
            </PanelRow>
            <PanelRow>
                <div
                    style={{
                        width: '100%',
                        marginTop: '12px',
                        marginBottom: '12px',
                    }}
                    className="method-radius-control-wrap"
                >
                    <BorderRadiusControl
                        label="Border Radius"
                        values={settings.borderRadius || {}}
                        onChange={(value) =>
                            updateSettings('borderRadius', value)
                        }
                    />
                </div>
            </PanelRow>
        </div>
    );
}
