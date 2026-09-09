/* eslint-disable prettier/prettier */
/**
 * Navigation arrow helpers shared by the Swiper and Swiper Gallery editors.
 *
 * The frontend equivalents live in method_swiper_get_nav_icons() in
 * lib/blocks/method-swiper/method-swiper.php; keep the default SVGs in sync.
 */
import { useMemo } from '@wordpress/element';

export const DEFAULT_PREV_ICON = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="method-default-prev-icon method-default-icon" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" /></svg>
);

export const DEFAULT_NEXT_ICON = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="method-default-next-icon method-default-icon" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" /></svg>
);

/**
 * Options for the Previous / Next arrow SelectControls, built from the theme
 * icons localized in methodGlobalData.icons.
 */
export function useSwiperIconOptions() {
    return useMemo(() => {
        const icons = window?.methodGlobalData?.icons;
        if (!icons) return [{ value: '', label: 'None' }];
        return [
            { value: '', label: 'Default' },
            ...Object.entries(icons).map(([key, data]) => ({
                value: key,
                label: data.label,
            })),
        ];
    }, []);
}

/**
 * The icon span inside a navigation button: a theme icon when one is chosen
 * (and still exists), otherwise the default chevron.
 *
 * @param {Object} props
 * @param {'prev'|'next'} props.direction
 * @param {string}        [props.iconKey] Theme icon slug from attributes.
 */
export function SwiperArrow({ direction, iconKey }) {
    const icons = window?.methodGlobalData?.icons;
    const className = `method-swiper-icon method-swiper-icon-${direction}`;

    if (icons && iconKey && icons[iconKey]?.svg) {
        return (
            <span
                className={className}
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: icons[iconKey].svg }}
            />
        );
    }

    return (
        <span className={className} aria-hidden="true">
            {direction === 'prev' ? DEFAULT_PREV_ICON : DEFAULT_NEXT_ICON}
        </span>
    );
}
