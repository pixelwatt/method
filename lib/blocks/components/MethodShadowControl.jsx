import {
    RangeControl,
    ColorPicker,
    CheckboxControl,
} from '@wordpress/components';

export default function MethodShadowControl({ value = {}, onChange }) {
    const update = (key, val) => {
        onChange({ ...value, [key]: val });
    };

    return (
        <div className="method-shadow-control" style={{ width: '100%' }}>
            <RangeControl
                label="Horizontal Offset"
                value={value.x || 0}
                onChange={(v) => update('x', v)}
                min={-125}
                max={125}
                marks={[
                    {
                        value: -100,
                        label: '-100px',
                    },
                    {
                        value: 0,
                        label: '0',
                    },
                    {
                        value: 100,
                        label: '100px',
                    },
                ]}
            />
            <RangeControl
                label="Vertical Offset"
                value={value.y || 0}
                onChange={(v) => update('y', v)}
                min={-125}
                max={125}
                marks={[
                    {
                        value: -100,
                        label: '-100px',
                    },
                    {
                        value: 0,
                        label: '0',
                    },
                    {
                        value: 100,
                        label: '100px',
                    },
                ]}
            />
            <RangeControl
                label="Blur Radius"
                value={value.blur || 0}
                onChange={(v) => update('blur', v)}
                min={0}
                max={200}
                marks={[
                    {
                        value: 0,
                        label: '0',
                    },
                    {
                        value: 75,
                        label: '75px',
                    },
                    {
                        value: 150,
                        label: '150px',
                    },
                ]}
            />
            <RangeControl
                label="Spread"
                value={value.spread || 0}
                onChange={(v) => update('spread', v)}
                min={-64}
                max={64}
                marks={[
                    {
                        value: -50,
                        label: '-50px',
                    },
                    {
                        value: 0,
                        label: '0',
                    },
                    {
                        value: 50,
                        label: '50px',
                    },
                ]}
            />
            <ColorPicker
                color={value.color || '#000'}
                onChangeComplete={({ hex }) => update('color', hex)}
                disableAlpha={false}
            />
        </div>
    );
}
