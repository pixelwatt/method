/**
 * Method Swiper Gallery — Frontend
 *
 * - Shared Swiper runtime (lib/blocks/utils/swiperRuntime.js): hash-active
 *   link tracking for every registered swiper, plus center-slide class
 *   tracking for galleries that enable it. The inline init script rendered by
 *   method-swiper-gallery.php registers the instance via
 *   `window.methodSwiperQueue`.
 * - Shared lightbox (lib/blocks/utils/lightbox.js), the same implementation
 *   the Fitted Image block uses, for galleries with the lightbox enabled.
 */
import { initSwiperRuntime } from '../../utils/swiperRuntime';
import { initMethodLightbox } from '../../utils/lightbox';

initSwiperRuntime();
initMethodLightbox();
