// MethodUseFeaturedImage.js
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';

export function useFeaturedImage(postId, postType = 'post', size = 'large') {
    const [featuredImageId] = useEntityProp(
        'postType',
        postType,
        'featured_media',
        postId
    );

    return useSelect(
        (select) => {
            if (!featuredImageId || !postId) return null;

            const media = select('core').getMedia(featuredImageId, {
                context: 'view',
            });

            if (!media) return null;

            const sizes = media.media_details?.sizes;

            return (
                sizes?.[size]?.source_url ||
                sizes?.full?.source_url ||
                media.source_url
            );
        },
        [featuredImageId, size, postId]
    );
}

export function useFeaturedImageSizes(postId, postType = 'post') {
    const [featuredImageId] = useEntityProp(
        'postType',
        postType,
        'featured_media',
        postId
    );

    return useSelect(
        (select) => {
            if (!featuredImageId || !postId) return null;

            const media = select('core').getMedia(featuredImageId, {
                context: 'view',
            });

            if (!media) return null;

            const sizes = media.media_details?.sizes;
            if (!sizes) return null;

            const result = {};
            Object.entries(sizes).forEach(([slug, data]) => {
                result[slug] = data.source_url;
            });
            return result;
        },
        [featuredImageId, postId]
    );
}
