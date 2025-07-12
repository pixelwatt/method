// useResponsiveSetter.js
import { useCallback } from 'react';

export default function useResponsiveSetter(attributes, setAttributes) {
	return useCallback(
		(breakpoint, key) => (value) => {
			const existing = attributes.responsiveSettings?.[breakpoint] || {};
			setAttributes({
				responsiveSettings: {
					...attributes.responsiveSettings,
					[breakpoint]: {
						...existing,
						[key]: value
					}
				}
			});
		},
		[attributes.responsiveSettings, setAttributes]
	);
}