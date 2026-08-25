/**
 * Editor preview of the looping alert marquee.
 *
 * Mirrors the markup produced by method-looping-alert.php + frontend.js so
 * the same CSS (global.scss) drives both. Measures the container and a
 * single "text + separator" unit with a ResizeObserver, then renders enough
 * copies to fill the width and duplicates the group for a seamless loop.
 */
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';

import { getDurationSeconds, getRepeatCount } from './marquee';

export default function LoopingAlertMarquee( { text, separator, speed } ) {
	const innerRef = useRef( null );
	const unitRef = useRef( null );
	const [ metrics, setMetrics ] = useState( {
		repeat: 1,
		unitWidth: 0,
		measured: false,
	} );

	const measure = useCallback( () => {
		const inner = innerRef.current;
		const unit = unitRef.current;
		if ( ! inner || ! unit ) {
			return;
		}
		const unitWidth = unit.getBoundingClientRect().width;
		const containerWidth = inner.clientWidth;
		const repeat = getRepeatCount( unitWidth, containerWidth );
		setMetrics( ( prev ) =>
			prev.measured &&
			prev.repeat === repeat &&
			prev.unitWidth === unitWidth
				? prev
				: { repeat, unitWidth, measured: true }
		);
	}, [] );

	// Re-measure synchronously whenever the content changes.
	useLayoutEffect( () => {
		measure();
	}, [ text, separator, measure ] );

	// Re-measure when the container or the unit changes size (block resized,
	// viewport/breakpoint changes, typography attributes, fonts loading...).
	useEffect( () => {
		const inner = innerRef.current;
		if ( ! inner ) {
			return undefined;
		}
		const ResizeObserverImpl =
			inner.ownerDocument?.defaultView?.ResizeObserver ||
			window.ResizeObserver;
		if ( ! ResizeObserverImpl ) {
			return undefined;
		}
		const observer = new ResizeObserverImpl( () => measure() );
		observer.observe( inner );
		if ( unitRef.current ) {
			observer.observe( unitRef.current );
		}
		return () => observer.disconnect();
	}, [ measure ] );

	const duration = getDurationSeconds(
		metrics.unitWidth * metrics.repeat,
		speed
	);

	const renderUnits = ( withRef ) =>
		Array.from( { length: metrics.repeat }, ( _, i ) => (
			<span
				className="method-looping-alert-unit"
				key={ i }
				ref={ withRef && i === 0 ? unitRef : undefined }
			>
				<span className="method-looping-alert-item">{ text }</span>
				<span className="method-looping-alert-sep">{ separator }</span>
			</span>
		) );

	const trackClasses = [ 'method-looping-alert-track' ];
	if ( metrics.measured ) {
		trackClasses.push( 'is-ready' );
	}
	if ( duration <= 0 ) {
		trackClasses.push( 'is-paused' );
	}

	return (
		<div className="method-looping-alert-inner" ref={ innerRef }>
			<p
				className={ trackClasses.join( ' ' ) }
				style={ { '--method-alert-duration': `${ duration }s` } }
			>
				<span className="method-looping-alert-group">
					{ renderUnits( true ) }
				</span>
				<span className="method-looping-alert-group" aria-hidden="true">
					{ renderUnits( false ) }
				</span>
			</p>
		</div>
	);
}
