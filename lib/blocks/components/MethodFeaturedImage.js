// FeaturedImage.js
import { useFeaturedImage } from './MethodUseFeaturedImage';

export default function FeaturedImage({
    postId,
    postType = 'post',
    size = 'large',
    format = 'img',
    className = '',
}) {
    const imageUrl = useFeaturedImage(postId, postType, size);

    if (!imageUrl) return null;
    if (format === 'url') return imageUrl;

    return <img src={imageUrl} className={className} alt="" />;
}
