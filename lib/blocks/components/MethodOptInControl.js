// OptInControl.js
import { PanelRow, Button } from '@wordpress/components';

export default function MethodOptInControl({
    label,
    settingKey,
    isEnabled,
    settings,
    resetValue,
    updateSettings,
    addLabel = 'Add Custom',
    removeLabel,
    children,
}) {
    if (!isEnabled) return null;

    const hasValue = settings[settingKey] !== undefined;
    const resolvedRemoveLabel = removeLabel || `Remove Custom ${label}`;

    if (!hasValue) {
        return (
            <PanelRow>
                <div style={{ width: '100%', marginTop: '12px' }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '4px',
                            textTransform: 'uppercase',
                            fontSize: '11px',
                            fontWeight: '500',
                        }}
                    >
                        {label}
                    </label>
                    <Button
                        onClick={() => updateSettings(settingKey, resetValue)}
                        className="button button-large"
                        size="small"
                        variant="outline"
                        style={{ fontWeight: '500' }}
                    >
                        {addLabel}
                    </Button>
                </div>
            </PanelRow>
        );
    }

    return (
        <PanelRow>
            <div
                style={{
                    width: '100%',
                    marginTop: '12px',
                    marginBottom: '12px',
                }}
                className="method-box-control-wrap"
            >
                {children}
                <div style={{ width: '100%', textAlign: 'left' }}>
                    <Button
                        onClick={() =>
                            updateSettings(settingKey, undefined, true)
                        }
                        className="button button-large"
                        style={{ marginTop: '16px', fontWeight: '500' }}
                        size="small"
                        variant="outline"
                    >
                        {resolvedRemoveLabel}
                    </Button>
                </div>
            </div>
        </PanelRow>
    );
}
