/**
 * Accordion element ids, shared by the Accordion and Accordion Item blocks'
 * editor and save code.
 *
 * An accordion's id comes from its `accordionId` attribute (its clientId, kept
 * unique across the editor). Each item's collapsible panel is scoped to it, so
 * two accordions on one page never share a panel id. The PHP render builds the
 * same ids with method_accordion_element_id() and method_accordion_collapse_id().
 */

export function getAccordionElementId(accordionId) {
	return `accordion-${accordionId}`;
}

export function getAccordionCollapseId(accordionId, itemIndex) {
	return `${getAccordionElementId(accordionId)}-collapse-${itemIndex}`;
}
