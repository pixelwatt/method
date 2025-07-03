const { PanelBody, TabPanel, ToggleControl } = wp.components;
const { Fragment } = wp.element;

export default function MethodResponsive({
	attributes,
	setAttributes,
	breakpoints = {},
	renderMobile = null,
	renderTablet = null,
	renderWide = null,
}) {
	return (
		<PanelBody title="Responsive Behavior" initialOpen={false}>
		<TabPanel
			className="method-responsive-tabs"
			activeClass="is-active"
			tabs={[
			{ name: 'mobile', title: 'Mobile', className: attributes.customMobile ? 'tab-mobile tab-enabled' : 'tab-mobile', icon: 'smartphone' },
			{ name: 'tablet', title: 'Tablet', className: attributes.customTablet ? 'tab-tablet tab-enabled' : 'tab-tablet', icon: 'tablet' },
			{ name: 'hires', title: 'Ultrawide', className: attributes.customWide ? 'tab-wide tab-enabled' : 'tab-wide', icon: 'desktop' },
			]}
		>
			{(tab) => {
			switch (tab.name) {
				case 'mobile':
				return (
					<div style={{ paddingTop: '16px', paddingBottom: '16px' }}>
					<ToggleControl
						label={attributes.customMobile ? 'Mobile overrides enabled' : 'Mobile overrides disabled'}
						help={`0 - ${breakpoints.mobile_max}`}
						checked={attributes.customMobile || false}
						onChange={(value) =>
						setAttributes({ customMobile: value })
						}
					/>
					{attributes.customMobile && (
						<>
							{renderMobile}
						</>
					)}
					</div>
				);
				case 'tablet':
				return (
					<div style={{ paddingTop: '16px', paddingBottom: '16px' }}>
					<ToggleControl
						label={attributes.customTablet ? 'Tablet overrides enabled' : 'Tablet overrides disabled'}
						help={`${breakpoints.tablet_min} - ${breakpoints.tablet_max}`}
						checked={attributes.customTablet || false}
						onChange={(value) => setAttributes({ customTablet: value })}
					/>
					{attributes.customTablet && (
						<>
							{renderTablet}
						</>
					)}
					</div>
				);
				case 'hires':
				return (
					<div style={{ paddingTop: '16px', paddingBottom: '16px' }}>
					<ToggleControl
						label={attributes.customWide ? 'Ultrawide overrides enabled' : 'Ultrawide overrides disabled'}
						help={`${breakpoints.wide_min}+`}
						checked={attributes.customWide || false}
						onChange={(value) => setAttributes({ customWide: value })}
					/>
					{attributes.customWide && (
						<>
							{renderWide}
						</>
					)}
					</div>
				);
				default:
				return null;
			}
			}}
		</TabPanel>
		</PanelBody>
	);
}