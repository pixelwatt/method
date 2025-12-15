import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	ButtonGroup,
	Button,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

const ALLOWED_BLOCKS = ['method/tab'];
const TEMPLATE = [
	['method/tab', { label: 'Tab 1' }],
	['method/tab', { label: 'Tab 2' }],
];

export default function Edit({ attributes, setAttributes, clientId }) {
	if (!attributes.methodId) {
		setAttributes({ methodId: `method-${clientId}` });
	} else if (attributes.methodId !== `method-${clientId}`) {
		setAttributes({ methodId: `method-${clientId}` });
	}

	const { methodId, activeTabId, navPlacement, navAlignment, navStyle, navFill } = attributes;

	const { selectBlock } = useDispatch(blockEditorStore);

	// Get child tab blocks and find which one (if any) is selected
	const { innerBlocks, selectedTabId } = useSelect(
		(select) => {
			const { getBlocks, getSelectedBlockClientId, hasSelectedInnerBlock } = select(blockEditorStore);
			const blocks = getBlocks(clientId);
			const selectedClientId = getSelectedBlockClientId();
			
			// Find if any tab or its children are selected
			let foundTabId = null;
			for (const block of blocks) {
				if (block.clientId === selectedClientId || hasSelectedInnerBlock(block.clientId, true)) {
					foundTabId = block.attributes.methodId || block.clientId;
					break;
				}
			}
			
			return {
				innerBlocks: blocks,
				selectedTabId: foundTabId,
			};
		},
		[clientId]
	);

	// Update activeTabId when selection changes to a tab
	useEffect(() => {
		if (selectedTabId && selectedTabId !== activeTabId) {
			setAttributes({ activeTabId: selectedTabId });
		}
	}, [selectedTabId, activeTabId, setAttributes]);

	// Set initial activeTabId to first tab if not set
	useEffect(() => {
		if (!activeTabId && innerBlocks.length > 0) {
			const firstTabId = innerBlocks[0].attributes.methodId || innerBlocks[0].clientId;
			setAttributes({ activeTabId: firstTabId });
		}
	}, [activeTabId, innerBlocks, setAttributes]);

	// Reset activeTabId if the active tab was removed
	useEffect(() => {
		if (activeTabId && innerBlocks.length > 0) {
			const tabExists = innerBlocks.some(
				(block) => (block.attributes.methodId || block.clientId) === activeTabId
			);
			if (!tabExists) {
				const firstTabId = innerBlocks[0].attributes.methodId || innerBlocks[0].clientId;
				setAttributes({ activeTabId: firstTabId });
			}
		}
	}, [activeTabId, innerBlocks, setAttributes]);

	// Build wrapper classes
	const wrapperClasses = ['method-tabs'];
	if (navPlacement === 'left' || navPlacement === 'right') {
		wrapperClasses.push('d-flex');
		if (navPlacement === 'right') {
			wrapperClasses.push('flex-row-reverse');
		}
	}

	const blockProps = useBlockProps({
		className: wrapperClasses.join(' '),
	});

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'tab-content' },
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
		}
	);

	// Build nav classes (Bootstrap)
	const navClasses = [
		'nav',
		navStyle === 'pills' ? 'nav-pills' : 'nav-tabs',
	];

	if (navFill) {
		navClasses.push('nav-fill');
	}

	if (navAlignment === 'center') {
		navClasses.push('justify-content-center');
	} else if (navAlignment === 'end') {
		navClasses.push('justify-content-end');
	}

	if (navPlacement === 'left' || navPlacement === 'right') {
		navClasses.push('flex-column');
	}

	// Handle tab click
	const handleTabClick = (tabId, blockClientId) => {
		setAttributes({ activeTabId: tabId });
		selectBlock(blockClientId);
	};

	// Render tab navigation using Bootstrap markup
	const renderNav = () => (
		<ul className={navClasses.join(' ')} id={`${methodId}-nav`} role="tablist">
			{innerBlocks.map((block, index) => {
				const tabId = block.attributes.methodId || `${methodId}-tab-${index}`;
				const isActive = tabId === activeTabId;
				return (
					<li className="nav-item" role="presentation" key={block.clientId}>
						<button
							className={`nav-link${isActive ? ' active' : ''}`}
							id={`${tabId}-tab`}
							type="button"
							role="tab"
							aria-controls={tabId}
							aria-selected={isActive}
							onClick={() => handleTabClick(tabId, block.clientId)}
						>
							{block.attributes.icon && (
								<i className={`bi ${block.attributes.icon} me-2`}></i>
							)}
							{block.attributes.label || `Tab ${index + 1}`}
						</button>
					</li>
				);
			})}
		</ul>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Tab Navigation Settings">
					<SelectControl
						label="Navigation Placement"
						value={navPlacement}
						options={[
							{ label: 'Top', value: 'top' },
							{ label: 'Bottom', value: 'bottom' },
							{ label: 'Left', value: 'left' },
							{ label: 'Right', value: 'right' },
						]}
						onChange={(value) =>
							setAttributes({ navPlacement: value })
						}
					/>

					<SelectControl
						label="Navigation Style"
						value={navStyle}
						options={[
							{ label: 'Tabs', value: 'tabs' },
							{ label: 'Pills', value: 'pills' },
						]}
						onChange={(value) => setAttributes({ navStyle: value })}
					/>

					<div className="components-base-control">
						<label className="components-base-control__label">
							Navigation Alignment
						</label>
						<ButtonGroup>
							<Button
								variant={
									navAlignment === 'start'
										? 'primary'
										: 'secondary'
								}
								onClick={() =>
									setAttributes({ navAlignment: 'start' })
								}
							>
								Start
							</Button>
							<Button
								variant={
									navAlignment === 'center'
										? 'primary'
										: 'secondary'
								}
								onClick={() =>
									setAttributes({ navAlignment: 'center' })
								}
							>
								Center
							</Button>
							<Button
								variant={
									navAlignment === 'end'
										? 'primary'
										: 'secondary'
								}
								onClick={() =>
									setAttributes({ navAlignment: 'end' })
								}
							>
								End
							</Button>
						</ButtonGroup>
					</div>

					<ToggleControl
						label="Fill Available Space"
						checked={navFill}
						onChange={(value) => setAttributes({ navFill: value })}
						help="Make nav items fill the available width equally."
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{(navPlacement === 'top' || navPlacement === 'left') && renderNav()}

				<div {...innerBlocksProps} />

				{(navPlacement === 'bottom' || navPlacement === 'right') && renderNav()}
			</div>
		</>
	);
}
