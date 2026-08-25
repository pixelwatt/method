/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const { PanelBody, PanelRow, TabPanel, ToggleControl, BaseControl } = wp.components;
const { Fragment } = wp.element;

export default function MethodResponsiveTabs({
	attributes,
	setAttributes,
	renderControls = {},
}) {
	const breakpoints = window?.methodGlobalData?.breakpoints || {};

	const tabs = [
		{
			name: 'mobile',
			title: 'Mobile',
			icon: 'smartphone',
			help: `0 - ${breakpoints.mobile_max}`,
			className: `${attributes.responsiveSettings.mobile.enabled ? 'method-tab-mobile tab-enabled tab-enabled-mobile' : 'method-tab-mobile'}`,
		},
		{
			name: 'tablet',
			title: 'Tablet',
			icon: 'tablet',
			help: `${breakpoints.tablet_min} - ${breakpoints.tablet_max}`,
			className: `${attributes.responsiveSettings.tablet.enabled ? 'method-tab-tablet tab-enabled tab-enabled-tablet' : 'method-tab-tablet'}`,
		},
		{
			name: 'wide',
			title: 'Ultrawide',
			icon: 'desktop',
			help: `${breakpoints.wide_min}+`,
			className: `${attributes.responsiveSettings.wide.enabled ? 'method-tab-wide tab-enabled tab-enabled-wide' : 'method-tab-wide'}`,
		},
	];

	return (
		<PanelBody>
			<PanelRow>
				<h2 className="components-text components-heading" style={{ marginTop: '0', marginBlockStart: '0' }}>Responsive Behavior</h2>
			</PanelRow>
			<TabPanel
				className="method-responsive-tabs"
				tabs={tabs.map(({ name, title, icon, help, className }) => ({
					name,
					title,
					icon,
					help,
					className,
				}))}
			>
				{(tab) => {
					const flagKey = `custom${tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}`;
					const isEnabled =
						attributes?.responsiveSettings?.[tab.name]?.enabled;

					return (
						<div
							className={`method-responsive-control-tab method-responsive-control-tab-${tab.name}`}
							style={{
								paddingTop: '16px',
								paddingBottom: '16px',
							}}
						>
							<ToggleControl
								label={
									isEnabled
										? `${tab.title} overrides enabled`
										: `${tab.title} overrides disabled`
								}
								help={tab.help}
								checked={!!isEnabled}
								onChange={(value) => {
									const next = {
										...attributes.responsiveSettings,
										[tab.name]: {
											...attributes.responsiveSettings?.[
											tab.name
											],
											enabled: value,
										},
									};
									setAttributes({ responsiveSettings: next });
								}}
							/>
							{isEnabled && (
								<div className="method-responsive-tab-controls">
									{renderControls[tab.name]}
								</div>
							)}
						</div>
					);
				}}
			</TabPanel>
		</PanelBody>
	);
}
