import { CustomSelectControl } from '@wordpress/components';

export default function MethodBreakpointSelect({
    label,
    attributeKey,
    attributes,
    setAttributes,
}) {
    return (
        <div style={{ width: '100%', marginBottom: '24px' }}>
            <CustomSelectControl
                label={label}
                options={methodGlobalData?.bsBreakpoints}
                showSelectedHint={true}
                value={methodGlobalData?.bsBreakpoints.find(opt => opt.key === attributes[attributeKey])}
                onChange={(option) => setAttributes({ [attributeKey]: option?.selectedItem?.key })}
            />
        </div>
    );
}
