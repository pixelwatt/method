// usePersistentId.js
//
// Gives a block an identifier that is generated once and then kept, so that
// whatever points at it (a link, a hash) keeps working.
//
// - An empty attribute is filled the first time the block is edited.
// - A copy (duplicate, paste) mounts carrying the original's identifier and
//   takes a fresh one. "Original" means the block that was already there, not
//   the one that comes first in the document: a copy pasted above the
//   original must not make the original, which links point at, change.
// - A block inside a synced pattern or template part is never regenerated.
//   Every use of the pattern on the page is the same block with the same
//   identifier, and writing to one writes to all of them.
// - The write is not persistent, so it adds no undo level: undoing the
//   insertion removes the block instead of clearing its identifier.
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	store as blockEditorStore,
	useBlockEditingMode,
} from '@wordpress/block-editor';

const ENTITY_BLOCKS = ['core/block', 'core/template-part'];

// clientIds of mounted blocks using this hook. clientIds are unique across
// editors and block previews, so one set serves them all.
const mounted = new Set();

/**
 * @param {Object}   options
 * @param {string}   options.clientId
 * @param {string}   options.blockName     Blocks that share the identifier space.
 * @param {string}   options.attribute     Attribute holding the identifier.
 * @param {string}   options.value         Current value of that attribute.
 * @param {Function} options.generate      Returns a new identifier.
 * @param {Function} options.setAttributes
 * @param {Function} [options.onCopy]      Returns further attributes to reset
 *                                         on a copy, given the block's
 *                                         attributes and the original's.
 */
export default function usePersistentId({
	clientId,
	blockName,
	attribute,
	value,
	generate,
	setAttributes,
	onCopy,
}) {
	const {
		getBlocksByName,
		getBlockAttributes,
		getBlockParentsByBlockName,
	} = useSelect(blockEditorStore);
	const { __unstableMarkNextChangeAsNotPersistent: markNotPersistent } =
		useDispatch(blockEditorStore);
	const isEditable = useBlockEditingMode() !== 'disabled';

	const write = (attributes) => {
		markNotPersistent?.();
		setAttributes(attributes);
	};

	useEffect(() => {
		if (!value && isEditable) {
			write({ [attribute]: generate() });
		}
	}, [value, isEditable]);

	useEffect(() => {
		const inEntity =
			getBlockParentsByBlockName(clientId, ENTITY_BLOCKS).length > 0;
		const original =
			!!value &&
			!inEntity &&
			getBlocksByName(blockName).find(
				(id) =>
					id !== clientId &&
					mounted.has(id) &&
					getBlockAttributes(id)?.[attribute] === value
			);

		if (original) {
			write({
				[attribute]: generate(),
				...onCopy?.(
					getBlockAttributes(clientId),
					getBlockAttributes(original)
				),
			});
		}

		mounted.add(clientId);
		return () => mounted.delete(clientId);
	}, [clientId]);
}
