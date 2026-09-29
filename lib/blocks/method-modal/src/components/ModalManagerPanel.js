/* eslint-disable prettier/prettier */
// "Modals" panel in the document sidebar: every modal in the document being
// edited, with the id to link to, and a way to add one.
import { createBlock } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { PluginDocumentSettingPanel, store as editorStore } from '@wordpress/editor';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { getEffectiveModalId } from '../../../utils/modalId';
import {
    MODAL_BLOCK,
    getModalSizes,
    titleToText,
    useCopyModalLink,
    useModalIdClash,
} from '../helpers';

const TEMPLATE_POST_TYPES = ['wp_template', 'wp_template_part'];

function ModalRow({ clientId }) {
    const attributes = useSelect(
        (select) => select(blockEditorStore).getBlockAttributes(clientId),
        [clientId]
    );
    const { selectBlock } = useDispatch(blockEditorStore);

    const modalId = getEffectiveModalId(attributes);
    const clash = useModalIdClash(clientId, modalId);
    const copyRef = useCopyModalLink(modalId);

    const sizes = getModalSizes();
    const title = titleToText(attributes?.title).trim();

    return (
        <li className="method-modal-manager-row">
            <div className="method-modal-manager-title">
                {title || __('Untitled modal', 'method')}
            </div>
            <div className="method-modal-manager-meta">
                <code>#{modalId}</code>
                <span>{(sizes[attributes?.size] || sizes.default).label}</span>
            </div>
            {clash.isModal && (
                <p className="method-modal-manager-warning">
                    {__('Another modal uses this ID. Only the first one will open.', 'method')}
                </p>
            )}
            <div className="method-modal-manager-actions">
                <Button variant="secondary" size="small" onClick={() => selectBlock(clientId)}>
                    {__('Edit', 'method')}
                </Button>
                <Button ref={copyRef} variant="tertiary" size="small">
                    {__('Copy link', 'method')}
                </Button>
            </div>
        </li>
    );
}

function DocumentModals() {
    const { clientIds, rootClientId, canInsert } = useSelect((select) => {
        const { getBlocksByName, canInsertBlockType } = select(blockEditorStore);
        const { getRenderingMode, getCurrentPostType } = select(editorStore);

        // With the template shown around a post, the post's own blocks live
        // inside the Content block; a new modal belongs with them rather
        // than in the template.
        const inTemplate =
            getRenderingMode() !== 'post-only' &&
            !TEMPLATE_POST_TYPES.includes(getCurrentPostType());
        const root = inTemplate ? getBlocksByName('core/post-content')[0] : undefined;

        return {
            clientIds: getBlocksByName(MODAL_BLOCK),
            rootClientId: root,
            canInsert: canInsertBlockType(MODAL_BLOCK, root),
        };
    }, []);
    const { insertBlock } = useDispatch(blockEditorStore);

    return (
        <>
            {clientIds.length === 0 && (
                <p className="method-modal-manager-empty">
                    {__('No modals yet. Add one, then link any button or text to its ID to open it.', 'method')}
                </p>
            )}
            {clientIds.length > 0 && (
                <ul className="method-modal-manager-list">
                    {clientIds.map((clientId) => (
                        <ModalRow key={clientId} clientId={clientId} />
                    ))}
                </ul>
            )}
            <Button
                variant="secondary"
                disabled={!canInsert}
                onClick={() =>
                    insertBlock(
                        createBlock(MODAL_BLOCK, {}, [createBlock('core/paragraph')]),
                        undefined,
                        rootClientId,
                        true
                    )
                }
            >
                {__('Add modal', 'method')}
            </Button>
        </>
    );
}

export default function ModalManagerPanel() {
    /**
     * Filters the sections of the Modals panel. Each section is
     * `{ name, title, render }`, where `render` is a component. Titles are
     * only shown once there is more than one section.
     */
    const sections = applyFilters('method.modalManager.sections', [
        {
            name: 'document',
            title: __('On this page', 'method'),
            render: DocumentModals,
        },
    ]);

    return (
        <PluginDocumentSettingPanel
            name="method-modals"
            title={__('Modals', 'method')}
            className="method-modal-manager"
        >
            {sections.map(({ name, title, render: Section }) => (
                <div key={name} className="method-modal-manager-section">
                    {sections.length > 1 && (
                        <h3 className="method-modal-manager-heading">{title}</h3>
                    )}
                    <Section />
                </div>
            ))}
        </PluginDocumentSettingPanel>
    );
}
