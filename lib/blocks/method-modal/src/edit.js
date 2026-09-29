/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    BlockControls,
    RichText,
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    ToggleControl,
    SelectControl,
    TextControl,
    Button,
    Notice,
    ToolbarGroup,
    ToolbarButton,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import MethodResponsiveTabs from '../../components/MethodResponsive';
import MethodSpacingControls from '../../components/MethodSpacingControls';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import useCanvasViewport, { useCanvasWindow, getMethodBreakpoints } from '../../hooks/useCanvasViewport';
import usePersistentId from '../../hooks/usePersistentId';
import {
    generateModalId,
    sanitizeModalId,
    sanitizeModalIdInput,
    getEffectiveModalId,
} from '../../utils/modalId';
import {
    MODAL_BLOCK,
    DEFAULT_CLOSE_ICON,
    getModalSizes,
    titleToText,
    textToTitle,
    useCopyModalLink,
    useModalIdClash,
} from './helpers';

const TITLE_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'];

// The padding is the modal's inner frame: the top belongs to the header, the
// bottom to the body and the sides to both (see cssMap).
const SPACING_SIDES = {
    padding: ['top', 'bottom', 'left', 'right'],
    margin: [],
    gap: [],
};
const SPACING_RESET = {
    padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' },
};

export default function Edit({ attributes, setAttributes, clientId }) {
    // Mirrors $cssargs in method-modal.php.
    const cssMap = {
        [`#block-${clientId} .modal-content`]: [
            'textColor',
            'bgColor',
            'border',
            'borderRadius',
        ],
        [`#block-${clientId} .modal-header`]: [
            'padding-top',
            'padding-left',
            'padding-right',
        ],
        [`#block-${clientId} .modal-body`]: [
            'padding-bottom',
            'padding-left',
            'padding-right',
        ],
        [`#block-${clientId} .modal-body a`]: ['linkColor'],
    };

    const {
        modalId = '',
        customId = '',
        title = '',
        hideTitle = false,
        titleTag = 'h2',
        size = 'default',
        fullscreenBelow = '',
        centered = false,
        scrollable = false,
        staticBackdrop = false,
        closeIcon = '',
    } = attributes;

    usePersistentId({
        clientId,
        blockName: MODAL_BLOCK,
        attribute: 'modalId',
        value: modalId,
        generate: generateModalId,
        setAttributes,
        // A copy keeps a custom id of its own, but not the original's.
        onCopy: (own, original) =>
            own.customId && own.customId === original.customId ? { customId: '' } : {},
    });

    const effectiveId = getEffectiveModalId(attributes);
    const clash = useModalIdClash(clientId, effectiveId);
    const copyRef = useCopyModalLink(effectiveId);
    const toolbarCopyRef = useCopyModalLink(effectiveId);

    const sizes = getModalSizes();
    const sizeKey = sizes[size] ? size : 'default';
    const isFullscreen = sizeKey === 'fullscreen';
    const breakpoints = getMethodBreakpoints();

    // The preview goes full screen at the same canvas widths as the frontend.
    const [canvasRef, canvasWindow] = useCanvasWindow();
    const tier = useCanvasViewport(canvasWindow);
    const isFullscreenPreview =
        isFullscreen ||
        (fullscreenBelow === 'mobile' && tier === 'mobile') ||
        (fullscreenBelow === 'tablet' && (tier === 'mobile' || tier === 'tablet'));

    const sizeOptions = useMemo(
        () =>
            Object.entries(sizes).map(([key, data]) => ({
                value: key,
                label: data.width ? `${data.label} (${data.width})` : data.label,
            })),
        [sizes]
    );

    const fullscreenOptions = [
        { value: '', label: __('Never', 'method') },
        {
            value: 'mobile',
            /* translators: %s: breakpoint, e.g. 767px */
            label: sprintf(__('Mobile (up to %s)', 'method'), breakpoints.mobile_max),
        },
        {
            value: 'tablet',
            /* translators: %s: breakpoint, e.g. 1199px */
            label: sprintf(__('Tablet and below (up to %s)', 'method'), breakpoints.tablet_max),
        },
    ];

    const closeIconOptions = useMemo(() => {
        if (!window?.methodGlobalData?.icons) return [{ value: '', label: __('Default', 'method') }];
        return [
            { value: '', label: __('Default', 'method') },
            ...Object.entries(window.methodGlobalData.icons).map(
                ([key, data]) => ({
                    value: key,
                    label: data.label,
                })
            ),
        ];
    }, []);

    const customIcon = closeIcon ? window?.methodGlobalData?.icons?.[closeIcon]?.svg : '';

    const summary = [
        sizes[sizeKey].label,
        !isFullscreen && fullscreenBelow === 'mobile' && __('Full screen on mobile', 'method'),
        !isFullscreen && fullscreenBelow === 'tablet' && __('Full screen on tablet and below', 'method'),
        centered && __('Centered', 'method'),
        scrollable && __('Scrollable', 'method'),
        staticBackdrop && __('Static backdrop', 'method'),
    ].filter(Boolean).join(' · ');

    const blockProps = useBlockProps({
        className: `method-modal method-modal-editor${isFullscreenPreview ? ' is-fullscreen-preview' : ''}`,
        ref: canvasRef,
        style: sizes[sizeKey].width ? { '--method-modal-width': sizes[sizeKey].width } : undefined,
    });
    const innerBlocksProps = useInnerBlocksProps(
        { className: 'method-modal-inner-blocks' },
        {
            template: [
                [
                    'core/paragraph',
                    { placeholder: 'Modal content goes here…' },
                ],
            ],
        }
    );

    const renderResponsiveControls = (breakpoint) => (
        <>
            <MethodSpacingControls
                breakpoint={breakpoint}
                attributes={attributes}
                setAttributes={setAttributes}
                include={['padding']}
                sides={SPACING_SIDES}
                resetDefaults={SPACING_RESET}
            />
            <MethodBorderControls
                breakpoint={breakpoint}
                attributes={attributes}
                setAttributes={setAttributes}
            />
        </>
    );

    let customIdHelp = __('Optional. Leave empty to keep the generated ID, which never changes.', 'method');
    if (customId) {
        customIdHelp = sprintf(
            /* translators: %s: modal ID */
            __('Clear this field to go back to #%s.', 'method'),
            sanitizeModalId(modalId)
        );
        if (sanitizeModalId(customId) !== customId) {
            customIdHelp = sprintf(
                /* translators: %s: modal ID */
                __('Used as #%s.', 'method'),
                effectiveId
            ) + ' ' + customIdHelp;
        }
    }

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton ref={toolbarCopyRef} icon="admin-links">
                        {__('Copy link', 'method')}
                    </ToolbarButton>
                </ToolbarGroup>
            </BlockControls>
            <InspectorControls>
                <PanelBody title={__('Modal', 'method')}>
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <TextControl
                                label={__('Title', 'method')}
                                value={titleToText(title)}
                                onChange={(value) => setAttributes({ title: textToTitle(value) })}
                            />
                        </div>
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={__('Hide title', 'method')}
                            help={__('The title is still announced by screen readers when the modal opens.', 'method')}
                            checked={hideTitle}
                            onChange={(value) => setAttributes({ hideTitle: value })}
                        />
                    </PanelRow>
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <SelectControl
                                label={__('Title tag', 'method')}
                                value={titleTag}
                                options={TITLE_TAGS.map((tag) => ({ label: tag, value: tag }))}
                                onChange={(value) => setAttributes({ titleTag: value })}
                            />
                        </div>
                    </PanelRow>
                    {!titleToText(title).trim() && (
                        <Notice status="info" isDismissible={false}>
                            {__('Add a title, even if it is hidden, so screen readers can announce what the modal is.', 'method')}
                        </Notice>
                    )}
                </PanelBody>
                <PanelBody title={__('Link and ID', 'method')}>
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <div className="method-modal-id">
                                <code>#{effectiveId}</code>
                                <Button ref={copyRef} variant="secondary" size="small">
                                    {__('Copy', 'method')}
                                </Button>
                            </div>
                            <p className="components-base-control__help" style={{ marginTop: '8px', marginBottom: 0 }}>
                                {sprintf(
                                    /* translators: %s: modal ID */
                                    __('Link any button or text to #%s to open this modal.', 'method'),
                                    effectiveId
                                )}
                            </p>
                        </div>
                    </PanelRow>
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <TextControl
                                label={__('Custom ID', 'method')}
                                value={customId}
                                placeholder={sanitizeModalId(modalId)}
                                help={customIdHelp}
                                onChange={(value) => setAttributes({ customId: sanitizeModalIdInput(value) })}
                            />
                        </div>
                    </PanelRow>
                    {clash.isModal && (
                        <Notice status="warning" isDismissible={false}>
                            {sprintf(
                                /* translators: %s: modal ID */
                                __('Another modal also uses #%s. Only the first one will open.', 'method'),
                                effectiveId
                            )}
                        </Notice>
                    )}
                    {clash.isAnchor && (
                        <Notice status="warning" isDismissible={false}>
                            {sprintf(
                                /* translators: %s: modal ID */
                                __('A block on this page uses %s as its HTML anchor. Links to it will open this modal instead.', 'method'),
                                effectiveId
                            )}
                        </Notice>
                    )}
                </PanelBody>
                <PanelBody title={__('Layout', 'method')} initialOpen={false}>
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <SelectControl
                                label={__('Size', 'method')}
                                value={sizeKey}
                                options={sizeOptions}
                                onChange={(value) => setAttributes({ size: value })}
                            />
                        </div>
                    </PanelRow>
                    {!isFullscreen && (
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <SelectControl
                                    label={__('Full screen', 'method')}
                                    value={fullscreenBelow}
                                    options={fullscreenOptions}
                                    onChange={(value) => setAttributes({ fullscreenBelow: value })}
                                />
                            </div>
                        </PanelRow>
                    )}
                    <PanelRow>
                        <ToggleControl
                            label={__('Vertically centered', 'method')}
                            checked={centered}
                            onChange={(value) => setAttributes({ centered: value })}
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={__('Scrollable body', 'method')}
                            help={__('Long content scrolls inside the modal instead of scrolling the whole modal.', 'method')}
                            checked={scrollable}
                            onChange={(value) => setAttributes({ scrollable: value })}
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={__('Static backdrop', 'method')}
                            help={__('Clicking outside the modal does not close it.', 'method')}
                            checked={staticBackdrop}
                            onChange={(value) => setAttributes({ staticBackdrop: value })}
                        />
                    </PanelRow>
                </PanelBody>
                {!!window?.methodGlobalData?.icons && (
                    <PanelBody title={__('Close button', 'method')} initialOpen={false}>
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <SelectControl
                                    label={__('Icon', 'method')}
                                    value={closeIcon}
                                    options={closeIconOptions}
                                    onChange={(value) => setAttributes({ closeIcon: value })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>
                )}
                <MethodSpacingControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['padding']}
                    sides={SPACING_SIDES}
                    resetDefaults={SPACING_RESET}
                />
                <MethodBorderControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <MethodColorControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['textColor', 'linkColor', 'bgColor']}
                />
                <MethodResponsiveTabs
                    attributes={attributes}
                    setAttributes={setAttributes}
                    renderControls={{
                        mobile: renderResponsiveControls('mobile'),
                        tablet: renderResponsiveControls('tablet'),
                        wide: renderResponsiveControls('wide'),
                    }}
                />
            </InspectorControls>
            <div {...blockProps}>
                <div className="method-modal-editor-bar">
                    <span className="method-modal-editor-label">{__('Modal', 'method')}</span>
                    <code className="method-modal-editor-id">#{effectiveId}</code>
                    <span className="method-modal-editor-summary">{summary}</span>
                </div>
                <div className={`modal-dialog${sizes[sizeKey].class ? ` ${sizes[sizeKey].class}` : ''}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <RichText
                                tagName={titleTag}
                                className={`modal-title${hideTitle ? ' is-hidden-on-site' : ''}`}
                                value={title}
                                onChange={(value) => setAttributes({ title: value })}
                                placeholder={__('Add modal title…', 'method')}
                                allowedFormats={[]}
                                disableLineBreaks
                            />
                            {hideTitle && (
                                <span className="method-modal-editor-badge">{__('Hidden on site', 'method')}</span>
                            )}
                            <span className="method-modal-close" aria-hidden="true">
                                <span
                                    className={`method-modal-close-icon${customIcon ? ' method-modal-close-icon-custom' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: customIcon || DEFAULT_CLOSE_ICON }}
                                />
                            </span>
                        </div>
                        <div className="modal-body">
                            <div {...innerBlocksProps} />
                        </div>
                    </div>
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
