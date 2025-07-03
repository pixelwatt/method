import { FontSizePicker, RangeControl } from '@wordpress/components';

export default function MethodTypographyControls ({ 
	prefix, 
	attributes, 
	setAttributes,
}) {
	const sizeKey = `${prefix}FontSize`;
	const heightKey = `${prefix}LineHeight`;

	return (
		<div style={{ width: '100%' }}>
			<div style={{ width: '100%', marginBottom: '12px' }} className="method-font-size-wrap">
                <label style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', fontWeight: '500' }}>Font Size</label>
				<FontSizePicker
					label="Font Size"
					value={attributes[sizeKey]}
					onChange={(value) => setAttributes({ [sizeKey]: value })}
					fontSizes = {[
						{
							"name": "Small",
							"slug": "small",
							"size": '1rem'
						},
						{
							"name": "Normal",
							"slug": "normal",
							"size": '1.25rem'
						},
						{
							"name": "Big",
							"slug": "big",
							"size": '1.5rem'
						}
					]}
				/>
			</div>
            <div style={{ width: '100%' }} className="method-font-size-wrap">
                <RangeControl
                    label="Line Height"
                    value={attributes[heightKey]}
					onChange={(value) => setAttributes({ [heightKey]: value })}
                    initialPosition={1.55}
                    max={ 2 }
                    min={ 0.75 }
                    withInputField={true}
                    marks={[
                        {
                            "value": 1,
                            "label": "1"
                        },
                        {
                            "value": 1.5,
                            "label": "1.5"
                        },
                        {
                            "value": 2,
                            "label": "2"
                        }
                    ]}
                    step={ 0.05 }
                />
            </div>
		</div>
	);
};