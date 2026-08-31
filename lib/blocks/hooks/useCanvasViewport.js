// useCanvasViewport.js
//
// Resolves which Method breakpoint tier the editor canvas is currently in.
//
// WordPress 7.1 always renders the post editor in an iframe whose width IS the
// device preview / resizable-canvas width. Block editor scripts run in the top
// admin window, so `window.matchMedia` there only ever reflects the browser —
// the only window whose media queries follow the preview is the canvas
// iframe's own window. This mirrors how core's block visibility checks the
// viewport: `useMediaQuery( query, view )` with the canvas window as `view`.
//
// Tiers follow the theme breakpoints localized in methodGlobalData.breakpoints
// (see method_get_block_breakpoints()), so they stay in sync with the theme:
//   mobile  : width <  tablet_min
//   tablet  : tablet_min <= width <= tablet_max
//   desktop : width >  tablet_max
//   wide    : width >= wide_min
import { useCallback, useState } from '@wordpress/element';
import { useMediaQuery } from '@wordpress/compose';

// Fallbacks match lib/config.php defaults; only used if the localized data is missing.
const DEFAULT_BREAKPOINTS = {
	mobile_max: '767px',
	tablet_min: '768px',
	tablet_max: '1199px',
	wide_min: '1600px',
};

export function getMethodBreakpoints() {
	return {
		...DEFAULT_BREAKPOINTS,
		...(window?.methodGlobalData?.breakpoints || {}),
	};
}

/**
 * Returns a callback ref plus the window the ref'd element is rendered in.
 * Attach the ref to the block wrapper, e.g. `useBlockProps( { ref } )`.
 *
 * @return {[Function, Window|undefined]} [ref, canvasWindow]
 */
export function useCanvasWindow() {
	const [view, setView] = useState();
	const ref = useCallback((node) => {
		setView(node?.ownerDocument?.defaultView ?? undefined);
	}, []);
	return [ref, view];
}

/**
 * @param {Window|undefined} view Canvas window from useCanvasWindow().
 * @return {'mobile'|'tablet'|'desktop'|'wide'|undefined} Current tier, or
 *   undefined until the canvas window is known.
 */
export default function useCanvasViewport(view) {
	const bp = getMethodBreakpoints();
	// Range syntax keeps the theme's unit intact (no "+1px" arithmetic); core's
	// own viewport queries use the same syntax in 7.1.
	const isTabletUp = useMediaQuery(`(width >= ${bp.tablet_min})`, view);
	const isDesktopUp = useMediaQuery(`(width > ${bp.tablet_max})`, view);
	const isWide = useMediaQuery(`(width >= ${bp.wide_min})`, view);

	if (!view) return undefined;
	if (isWide) return 'wide';
	if (isDesktopUp) return 'desktop';
	if (isTabletUp) return 'tablet';
	return 'mobile';
}
