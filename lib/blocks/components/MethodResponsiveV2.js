const { PanelBody, TabPanel, ToggleControl } = wp.components;
const { Fragment } = wp.element;

export default function MethodResponsive({
	attributes,
	setAttributes,
	breakpoints = window?.methodGlobalData?.breakpoints || {},
	renderControls = {},
}) {
	const tabs = [
		{ name: 'mobile', title: 'Mobile', icon: 'smartphone', range: `0 - ${breakpoints.mobile_max}` },
		{ name: 'tablet', title: 'Tablet', icon: 'tablet', range: `${breakpoints.tablet_min} - ${breakpoints.tablet_max}` },
		{ name: 'wide', title: 'Ultrawide', icon: 'desktop', range: `${breakpoints.wide_min}+` }
	];

	return (
		<PanelBody title="Responsive Behavior" initialOpen={false}>
			<TabPanel
				className="method-responsive-tabs"
				tabs={tabs.map(({ name, title, icon }) => ({ name, title, icon }))}
			>
				{(tab) => {
					const flagKey = `custom${tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}`;
					const isEnabled = attributes?.responsiveSettings?.[tab.name]?.enabled;

					return (
						<div style={{ paddingTop: '16px', paddingBottom: '16px' }}>
							<ToggleControl
								label={isEnabled ? `${tab.title} overrides enabled` : `${tab.title} overrides disabled`}
								help={tab.range}
								checked={!!isEnabled}
								onChange={(value) => {
									const next = {
										...attributes.responsiveSettings,
										[tab.name]: {
											...attributes.responsiveSettings?.[tab.name],
											enabled: value,
										},
									};
									setAttributes({ responsiveSettings: next });
								}}
							/>
							{isEnabled && renderControls[tab.name]}
						</div>
					);
				}}
			</TabPanel>
		</PanelBody>
	);
}