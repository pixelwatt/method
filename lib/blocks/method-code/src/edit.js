/* eslint-disable prettier/prettier */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-danger */
/**
 * Method Code — Editor
 *
 * The canvas shows the sample highlighted exactly as the page will (the
 * same highlight.js bundle, see lib/blocks/utils/highlight.js), and it is
 * edited in place: a transparent <textarea> sits over the highlighted
 * <pre>, both with the same font metrics, so the caret and selection land
 * on the colored text beneath. Tab inserts a tab, Enter keeps the current
 * line's indentation. Long lines always wrap in the editor so the two
 * layers can't drift apart; "Wrap long lines" only affects the page.
 */
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import MethodResponsiveTabs from '../../components/MethodResponsive';
import MethodSpacingControls from '../../components/MethodSpacingControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import {
	LANGUAGES,
	DEFAULT_LANGUAGE,
	getLanguageLabel,
	highlightCode,
	resolveLanguage,
} from '../../utils/highlight';

// Only the vertical margins: the sample fills its column.
const SPACING_SIDES = { padding: [], margin: ['top', 'bottom'], gap: [] };
const COPIED_FOR = 2000;

const CopyIcon = () => (
	<svg className="method-code__copy-icon method-code__copy-icon--copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
		<rect x="9" y="9" width="12" height="12" rx="2" />
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
	</svg>
);

const CopiedIcon = () => (
	<svg className="method-code__copy-icon method-code__copy-icon--copied" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
		<path d="M20 6 9 17l-5-5" />
	</svg>
);

// Margins, for the base settings and each override tier.
function LayoutControls({ breakpoint, attributes, setAttributes }) {
	return (
		<MethodSpacingControls
			breakpoint={breakpoint}
			attributes={attributes}
			setAttributes={setAttributes}
			include={['margin']}
			sides={SPACING_SIDES}
		/>
	);
}

/**
 * Replaces the textarea's selection with `insert`, moving the caret to the
 * end of it, and hands the new value up. The textarea's own value and
 * selection are set first, so the re-render that follows finds the value
 * already in place and leaves the caret where it was put.
 *
 * @param {HTMLTextAreaElement} textarea
 * @param {string}              insert
 * @param {Function}            onChange Receives the new value.
 */
function replaceSelection(textarea, insert, onChange) {
	const { value, selectionStart, selectionEnd } = textarea;
	const next = value.slice(0, selectionStart) + insert + value.slice(selectionEnd);
	const caret = selectionStart + insert.length;
	textarea.value = next;
	textarea.setSelectionRange(caret, caret);
	onChange(next);
}

export default function Edit({ attributes, setAttributes, clientId }) {
	// Mirrors $cssargs in method-code.php.
	const cssMap = {
		[`#block-${clientId}`]: ['margin-top', 'margin-bottom'],
	};

	const {
		code = '',
		language = DEFAULT_LANGUAGE,
		label = '',
		showLabel = true,
		showCopy = true,
		wrapLines = false,
	} = attributes;

	// A block migrated from elsewhere may hold an alias ("zsh"); the canvas
	// and the Language option work from the resolved value.
	const lang = resolveLanguage(language);

	const textareaRef = useRef(null);
	const [copied, setCopied] = useState(false);
	const hasHeader = showLabel || showCopy;

	const classes = ['method-code', 'method-code--editor'];
	if (wrapLines) classes.push('method-code--wrap');
	if (!hasHeader) classes.push('method-code--bare');
	if (copied) classes.push('is-copied');
	const blockProps = useBlockProps({ className: classes.join(' ') });

	// A trailing newline keeps the <pre> as tall as the textarea when the
	// sample ends in one (a bare "\n" at the end of a <pre> draws no line).
	const highlighted = useMemo(
		() => highlightCode(code, lang) + '\n',
		[code, lang]
	);

	// Tab and Enter are handled on the textarea itself, natively, so the
	// editor's own Tab handling (which moves focus out of the block) never
	// sees them.
	useEffect(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const setCode = (value) => setAttributes({ code: value });

		const onKeyDown = (event) => {
			if (event.key === 'Tab' && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
				event.preventDefault();
				event.stopPropagation();
				replaceSelection(textarea, '\t', setCode);
				return;
			}
			if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
				const { value, selectionStart } = textarea;
				const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
				const indent = /^[\t ]*/.exec(value.slice(lineStart, selectionStart))[0];
				if (indent) {
					event.preventDefault();
					event.stopPropagation();
					replaceSelection(textarea, '\n' + indent, setCode);
				}
			}
		};

		textarea.addEventListener('keydown', onKeyDown);
		return () => textarea.removeEventListener('keydown', onKeyDown);
	}, [setAttributes]);

	useEffect(() => {
		if (!copied) return;
		const timer = window.setTimeout(() => setCopied(false), COPIED_FOR);
		return () => window.clearTimeout(timer);
	}, [copied]);

	const copy = async () => {
		if (!navigator.clipboard) return;
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
		} catch (e) {
			// Nothing to do: the sample is still there to select by hand.
		}
	};

	const pillText = label.trim() || getLanguageLabel(lang);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Code', 'method')}>
					<SelectControl
						label={__('Language', 'method')}
						value={lang}
						options={LANGUAGES}
						onChange={(value) => setAttributes({ language: value })}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Show language pill', 'method')}
						checked={showLabel}
						onChange={(value) => setAttributes({ showLabel: value })}
						__nextHasNoMarginBottom
					/>
					{showLabel && (
						<TextControl
							label={__('Pill text', 'method')}
							help={__('Leave empty to show the language. A file name works well here.', 'method')}
							value={label}
							onChange={(value) => setAttributes({ label: value })}
							placeholder={getLanguageLabel(lang)}
							__nextHasNoMarginBottom
						/>
					)}
					<ToggleControl
						label={__('Show copy button', 'method')}
						checked={showCopy}
						onChange={(value) => setAttributes({ showCopy: value })}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Wrap long lines', 'method')}
						help={__('On the page. Lines always wrap here in the editor.', 'method')}
						checked={wrapLines}
						onChange={(value) => setAttributes({ wrapLines: value })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<LayoutControls breakpoint="base" attributes={attributes} setAttributes={setAttributes} />
				<MethodResponsiveTabs
					attributes={attributes}
					setAttributes={setAttributes}
					renderControls={{
						mobile: <LayoutControls breakpoint="mobile" attributes={attributes} setAttributes={setAttributes} />,
						tablet: <LayoutControls breakpoint="tablet" attributes={attributes} setAttributes={setAttributes} />,
						wide: <LayoutControls breakpoint="wide" attributes={attributes} setAttributes={setAttributes} />,
					}}
				/>
			</InspectorControls>
			<div {...blockProps}>
				{hasHeader && (
					<div className="method-code__header">
						{showLabel && (
							<span className="method-code__label">{pillText}</span>
						)}
						{showCopy && (
							<button
								type="button"
								className="method-code__copy"
								onClick={copy}
								aria-label={__('Copy code to clipboard', 'method')}
							>
								<CopyIcon />
								<CopiedIcon />
								<span className="method-code__copy-text">
									{copied ? __('Copied', 'method') : __('Copy', 'method')}
								</span>
							</button>
						)}
					</div>
				)}
				<div className="method-code__editor">
					<pre className="method-code__pre" aria-hidden="true">
						<code
							className={`method-code__code hljs language-${lang}`}
							dangerouslySetInnerHTML={{ __html: highlighted }}
						/>
					</pre>
					<textarea
						ref={textareaRef}
						className="method-code__textarea"
						value={code}
						onChange={(event) => setAttributes({ code: event.target.value })}
						placeholder={__('Paste or type code…', 'method')}
						aria-label={__('Code', 'method')}
						spellCheck={false}
						autoCapitalize="off"
						autoCorrect="off"
						autoComplete="off"
						data-gramm="false"
						rows={1}
					/>
				</div>
				<MethodStyleTag
					clientId={clientId}
					attributes={attributes}
					selectorMap={cssMap}
				/>
			</div>
		</>
	);
}
