/**
 * Method Modal — Modals panel
 *
 * Not part of the block itself: a document sidebar panel that lists the
 * modals in the document being edited. It is a second editor script of the
 * Modal block so that it loads wherever the block does, in the post editor
 * and the site editor.
 */
import { registerPlugin, getPlugin } from '@wordpress/plugins';
import ModalManagerPanel from './components/ModalManagerPanel';

if (!getPlugin('method-modal-manager')) {
	registerPlugin('method-modal-manager', { render: ModalManagerPanel });
}
