import { RangeControl, ColorPicker } from '@wordpress/components';

export default function MethodShadowControl({ value = {}, onChange }) {
    const update = (key, val) => {
        onChange({ ...value, [key]: val });
    };

    return (
        <div className="method-shadow-control">
            <label
                style={{
                    display: 'block',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    fontWeight: '500',
                }}
            >
                Box Shadow
            </label>
            <RangeControl
                label="Horizontal Offset"
                value={value.x || 0}
                onChange={(v) => update('x', v)}
                min={-100}
                max={100}
            />
            <RangeControl
                label="Vertical Offset"
                value={value.y || 0}
                onChange={(v) => update('y', v)}
                min={-100}
                max={100}
            />
            <RangeControl
                label="Blur Radius"
                value={value.blur || 0}
                onChange={(v) => update('blur', v)}
                min={0}
                max={200}
            />
            <RangeControl
                label="Spread"
                value={value.spread || 0}
                onChange={(v) => update('spread', v)}
                min={-50}
                max={50}
            />
            <ColorPicker
                color={value.color || '#000'}
                onChangeComplete={({ hex }) => update('color', hex)}
                disableAlpha={false}
            />
        </div>
    );
}
