import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';

const ICON_OPTIONS = [
	{ label: 'None', value: '' },
	{ label: 'Home', value: 'bi-house' },
	{ label: 'User', value: 'bi-person' },
	{ label: 'Settings', value: 'bi-gear' },
	{ label: 'Info', value: 'bi-info-circle' },
	{ label: 'Star', value: 'bi-star' },
	{ label: 'Heart', value: 'bi-heart' },
	{ label: 'Check', value: 'bi-check-circle' },
	{ label: 'Calendar', value: 'bi-calendar' },
	{ label: 'Envelope', value: 'bi-envelope' },
	{ label: 'Phone', value: 'bi-telephone' },
	{ label: 'Cart', value: 'bi-cart' },
	{ label: 'Search', value: 'bi-search' },
	{ label: 'Image', value: 'bi-image' },
	{ label: 'File', value: 'bi-file-text' },
	{ label: 'Custom (enter below)', value: 'custom' },
];

export default function Edit({ attributes, setAttributes, clientId, context }) {
	if (!attributes.methodId) {
		setAttributes({ methodId: `method-${clientId}` });
	} else if (attributes.methodId !== `method-${clientId}`) {
		setAttributes({ methodId: `method-${clientId}` });
	}

	const { methodId, label, icon } = attributes;
	const activeTabId = context['method/tabs/activeTabId'];

	// Check if this tab is active based on parent's activeTabId
	const isActive = methodId === activeTabId;

	// Use Bootstrap's tab-pane classes
	const paneClasses = ['tab-pane', 'fade'];
	if (isActive) {
		paneClasses.push('show', 'active');
	}

	const blockProps = useBlockProps({
		className: paneClasses.join(' '),
		id: methodId,
		role: 'tabpanel',
		'aria-labelledby': `${methodId}-tab`,
		tabIndex: '0',
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: [['core/paragraph', { placeholder: 'Add tab content…' }]],
		templateLock: false,
	});

	// Check if custom icon is selected
	const isCustomIcon =
		!ICON_OPTIONS.some((opt) => opt.value === icon) && icon !== '';
	const selectedIconValue = isCustomIcon ? 'custom' : icon;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Tab Settings">
					<TextControl
						label="Tab Label"
						value={label}
						onChange={(value) => setAttributes({ label: value })}
						help="The text shown in the tab navigation."
					/>

					<SelectControl
						label="Tab Icon"
						value={selectedIconValue}
						options={ICON_OPTIONS}
						onChange={(value) => {
							if (value === 'custom') {
								if (!isCustomIcon) {
									setAttributes({ icon: '' });
								}
							} else {
								setAttributes({ icon: value });
							}
						}}
						help="Select a Bootstrap Icon to display before the tab label."
					/>

					{selectedIconValue === 'custom' && (
						<TextControl
							label="Custom Icon Class"
							value={icon}
							onChange={(value) => setAttributes({ icon: value })}
							help={
								<>
									Enter a Bootstrap Icon class (e.g.,
									"bi-arrow-right").{' '}
									<a
										href="https://icons.getbootstrap.com/"
										target="_blank"
										rel="noopener noreferrer"
									>
										Browse Icons
									</a>
								</>
							}
						/>
					)}

					{icon && (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '0.5rem',
								marginTop: '0.5rem',
								padding: '0.5rem',
								background: '#f5f5f5',
								borderRadius: '4px',
							}}
						>
							<span className="components-base-control__label">
								Icon Preview:
							</span>
							<i
								className={`bi ${icon}`}
								style={{ fontSize: '1.25rem' }}
							></i>
						</div>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...innerBlocksProps} />
		</>
	);
}
