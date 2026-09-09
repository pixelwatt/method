/**
 * Method Swiper — Frontend
 *
 * Installs the shared Swiper runtime (lib/blocks/utils/swiperRuntime.js):
 * links whose hash matches a visible slide's `data-hash` get the
 * `method-hash-active` class. The inline init script rendered by
 * method-swiper.php registers each instance through `window.methodSwiperQueue`.
 */
import { initSwiperRuntime } from '../../../utils/swiperRuntime';

initSwiperRuntime();
