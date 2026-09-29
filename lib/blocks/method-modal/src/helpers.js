/* eslint-disable prettier/prettier */
// Editor helpers shared by the Modal block (edit.js) and the Modals panel
// (components/ModalManagerPanel.js).
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useCopyToClipboard } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import { escapeHTML } from '@wordpress/escape-html';
import { decodeEntities } from '@wordpress/html-entities';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { getEffectiveModalId } from '../../utils/modalId';

export const MODAL_BLOCK = 'method/modal';

const ENTITY_BLOCKS = ['core/block', 'core/template-part'];

// Same icon as Method_Modals::DEFAULT_CLOSE_ICON.
export const DEFAULT_CLOSE_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>';

// Fallback matches method_get_modal_sizes(); only used if the localized data is missing.
const DEFAULT_SIZES = {
    sm: { label: 'Small', class: 'modal-sm', width: '300px' },
    default: { label: 'Default', class: '', width: '500px' },
    lg: { label: 'Large', class: 'modal-lg', width: '800px' },
    xl: { label: 'Extra large', class: 'modal-xl', width: '1140px' },
    fullscreen: { label: 'Full screen', class: 'modal-fullscreen', width: '' },
};

export function getModalSizes() {
    const sizes = window?.methodModalData?.sizes;
    return sizes && sizes.default ? sizes : DEFAULT_SIZES;
}

// The title is stored as HTML (it is edited with RichText in the canvas) and
// shown as plain text everywhere else.
export function titleToText(title) {
    return decodeEntities((title || '').replace(/<[^>]+>/g, ''));
}

export function textToTitle(text) {
    return escapeHTML(text || '');
}

/**
 * Ref for a button that copies the link target of a modal.
 *
 * @param {string} modalId
 * @return {Object} Ref to attach to the button.
 */
export function useCopyModalLink(modalId) {
    const { createNotice } = useDispatch(noticesStore);
    return useCopyToClipboard(`#${modalId}`, () =>
        createNotice(
            'info',
            /* translators: %s: modal ID */
            sprintf(__('Copied #%s. Paste it as the link of a button or text.', 'method'), modalId),
            { isDismissible: true, type: 'snackbar' }
        )
    );
}

/**
 * Whether something else in the document uses a modal's id.
 *
 * Every use of a synced pattern or template part shows the same modal again,
 * so two blocks that both sit inside one are not counted against each other.
 *
 * @param {string} clientId
 * @param {string} modalId  The modal's effective id.
 * @return {{isModal: boolean, isAnchor: boolean}} Whether another modal has
 *   the id, and whether a block's HTML anchor is the id.
 */
export function useModalIdClash(clientId, modalId) {
    // A number, so the selector returns the same value until something changes.
    const clash = useSelect(
        (select) => {
            if (!modalId) return 0;
            const {
                getClientIdsWithDescendants,
                getBlockName,
                getBlockAttributes,
                getBlockParentsByBlockName,
            } = select(blockEditorStore);
            const inEntity = (id) => getBlockParentsByBlockName(id, ENTITY_BLOCKS).length > 0;
            const selfInEntity = inEntity(clientId);

            let isModal = false;
            let isAnchor = false;
            getClientIdsWithDescendants().forEach((id) => {
                if (id === clientId) return;
                const attributes = getBlockAttributes(id);
                if (getBlockName(id) === MODAL_BLOCK) {
                    if (
                        getEffectiveModalId(attributes) === modalId &&
                        !(selfInEntity && inEntity(id))
                    ) {
                        isModal = true;
                    }
                } else if (attributes?.anchor === modalId) {
                    isAnchor = true;
                }
            });
            return (isModal ? 1 : 0) + (isAnchor ? 2 : 0);
        },
        [clientId, modalId]
    );

    return { isModal: clash === 1 || clash === 3, isAnchor: clash >= 2 };
}
