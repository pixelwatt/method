// useResponsiveSetter.js
import { useCallback } from 'react';

export default function useResponsiveSetter(attributes, setAttributes) {
	return useCallback(
		(breakpoint, key, remove = false) =>
			(value) => {
				const existing =
					attributes.responsiveSettings?.[breakpoint] || {};

				const updated = { ...existing };

				if (remove) {
					delete updated[key];
				} else {
					updated[key] = value;
				}

				setAttributes({
					responsiveSettings: {
						...attributes.responsiveSettings,
						[breakpoint]: updated,
					},
				});
			},
		[attributes.responsiveSettings, setAttributes]
	);
}
