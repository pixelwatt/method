/**
 * Modal ids, shared by the Modal block's editor code.
 *
 * A modal is opened by any link to `#<id>`. The id is the block's custom id if
 * it has one, otherwise the id generated when the block was inserted. The PHP
 * render resolves the same value with method_modal_get_block_id() and
 * method_sanitize_modal_id().
 */

const MODAL_ID_PREFIX = 'modal-';

export function generateModalId() {
	return MODAL_ID_PREFIX + (Math.random().toString(36) + '000000').slice(2, 8);
}

/**
 * Sanitizes a custom id while it is being typed. Separators at the ends are
 * kept, so "spring-" can still become "spring-sale".
 *
 * @param {string} value
 * @return {string} Value to store.
 */
export function sanitizeModalIdInput(value) {
	return (value || '')
		.toLowerCase()
		.replace(/^#+/, '')
		.replace(/[^a-z0-9_-]+/g, '-');
}

/**
 * @param {string} value
 * @return {string} Id as it is used on the frontend, or '' if nothing usable is left.
 */
export function sanitizeModalId(value) {
	const id = sanitizeModalIdInput(value).replace(/^[-_]+|[-_]+$/g, '');
	if (!id) {
		return '';
	}
	// A CSS identifier cannot start with a digit.
	return /^[a-z]/.test(id) ? id : MODAL_ID_PREFIX + id;
}

export function getEffectiveModalId(attributes) {
	return (
		sanitizeModalId(attributes?.customId) ||
		sanitizeModalId(attributes?.modalId)
	);
}
