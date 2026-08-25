/**
 * Shared marquee math for the Looping Alert block.
 *
 * Used by both the editor preview (edit.js) and the frontend script
 * (frontend.js) so the scroll behaves identically in both places.
 */

/**
 * How many pixels per second one unit of the 0-100 `speed` attribute
 * represents. speed 25 (the default) => 75px/s, speed 100 => 300px/s.
 */
export const PX_PER_SECOND_PER_UNIT = 3;

/**
 * Clamp a raw speed attribute value to the 0-100 range.
 *
 * @param {*} speed
 * @return {number}
 */
export function clampSpeed( speed ) {
	const n = parseFloat( speed );
	if ( Number.isNaN( n ) ) {
		return 0;
	}
	return Math.min( 100, Math.max( 0, n ) );
}

/**
 * Convert the 0-100 speed attribute to pixels per second.
 *
 * @param {*} speed
 * @return {number}
 */
export function getPxPerSecond( speed ) {
	return clampSpeed( speed ) * PX_PER_SECOND_PER_UNIT;
}

/**
 * How many copies of a single "text + separator" unit are needed so that
 * one group is at least as wide as the visible container. One extra copy
 * is added so the seam between the two duplicated groups is never visible.
 *
 * @param {number} unitWidth      Width of one unit in px.
 * @param {number} containerWidth Width of the visible container in px.
 * @return {number}
 */
export function getRepeatCount( unitWidth, containerWidth ) {
	if ( ! unitWidth || unitWidth <= 0 || ! containerWidth || containerWidth <= 0 ) {
		return 1;
	}
	return Math.max( 1, Math.ceil( containerWidth / unitWidth ) + 1 );
}

/**
 * Seconds it should take to scroll one full group width at the given speed.
 * Returns 0 when the marquee should not move at all.
 *
 * @param {number} groupWidth Width of one group in px.
 * @param {*}      speed      Raw 0-100 speed attribute.
 * @return {number}
 */
export function getDurationSeconds( groupWidth, speed ) {
	const pxPerSecond = getPxPerSecond( speed );
	if ( ! pxPerSecond || ! groupWidth || groupWidth <= 0 ) {
		return 0;
	}
	return groupWidth / pxPerSecond;
}
