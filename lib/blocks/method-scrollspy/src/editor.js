/* eslint-disable prettier/prettier */
/**
 * Method Scrollspy — Editor
 *
 * Provides block inspector controls and a placeholder preview.
 * The actual TOC is hydrated on the frontend only.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	RangeControl,
	CheckboxControl,
} from '@wordpress/components';
import MethodColorControls from '../../components/MethodColorControls';
import MethodBreakpointSelect from '../../components/MethodBreakpointSelect';
import MethodStyleTag from '../../components/MethodStyleTag';

const HEADING_OPTIONS = [
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
	{ label: 'H4', value: 'h4' },
];

export default function Edit({ attributes, setAttributes }) {
	const { targetSelector, label, headingLevels, stickyOffset } = attributes;
	const blockProps = useBlockProps({
		className: 'method-scrollspy method-scrollspy--editor',
	});

	/**
	 * Toggle a heading level in/out of the array.
	 * @param level
	 */
	const toggleLevel = (level) => {
		const next = headingLevels.includes(level)
			? headingLevels.filter((l) => l !== level)
			: [...headingLevels, level].sort();

		// Don't allow an empty selection.
		if (next.length > 0) {
			setAttributes({ headingLevels: next });
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Scrollspy Settings', 'method')}
					initialOpen
				>
					<PanelRow>
						<TextControl
							label={__('Target selector', 'method')}
							help={__(
								'CSS selector for the content container to scan for headings.',
								'method'
							)}
							value={targetSelector}
							onChange={(value) =>
								setAttributes({ targetSelector: value })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Label', 'method')}
							help={__(
								'Visible label above the table of contents.',
								'method'
							)}
							value={label}
							onChange={(value) =>
								setAttributes({ label: value })
							}
						/>
					</PanelRow>
					<PanelRow>
						<fieldset className="method-scrollspy__level-fieldset">
							<legend>
								{__('Heading levels to include', 'method')}
							</legend>
							{HEADING_OPTIONS.map((opt) => (
								<CheckboxControl
									key={opt.value}
									label={opt.label}
									checked={headingLevels.includes(opt.value)}
									onChange={() => toggleLevel(opt.value)}
								/>
							))}
						</fieldset>
					</PanelRow>
					<PanelRow>
						<RangeControl
							label={__('Sticky top offset (px)', 'method')}
							help={__(
								'Extra offset from the top of the viewport when the nav becomes sticky. Useful if you have a fixed site header.',
								'method'
							)}
							value={stickyOffset}
							onChange={(value) =>
								setAttributes({ stickyOffset: value })
							}
							min={0}
							max={200}
							step={4}
						/>
					</PanelRow>
					<PanelRow>
						<MethodBreakpointSelect
							label="Width to Become Sticky"
							attributeKey="stickyAt"
							attributes={attributes}
							setAttributes={setAttributes}
						/>
					</PanelRow>
				</PanelBody>
				<MethodColorControls
					attributes={attributes}
					setAttributes={setAttributes}
					include={['textColor', 'linkColor', 'linkHoverColor', 'linkActiveColor']}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div className="method-scrollspy__inner">
					<p className="method-scrollspy__label">{label}</p>
					<ol className="method-scrollspy__list method-scrollspy__list--placeholder">
						<li className="method-scrollspy__item">
							<span className="method-scrollspy__swatch" />
							{__('Heading level 2', 'method')}
						</li>
						{headingLevels.includes('h3') && (
							<li className="method-scrollspy__item method-scrollspy__item--sub">
								<span className="method-scrollspy__swatch" />
								{__('Heading level 3', 'method')}
							</li>
						)}
						{headingLevels.includes('h4') && (
							<li className="method-scrollspy__item method-scrollspy__item--sub method-scrollspy__item--deep">
								<span className="method-scrollspy__swatch" />
								{__('Heading level 4', 'method')}
							</li>
						)}
					</ol>
					<p className="method-scrollspy__hint">
						{__(
							'Table of contents — renders on the frontend from headings in:',
							'method'
						)}
						<code>{targetSelector}</code>
					</p>
				</div>
			</div>
		</>
	);
}
