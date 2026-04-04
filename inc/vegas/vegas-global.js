import Vegas from './vegas.min.js';
window.Vegas = Vegas;

function initVegasSlideshows() {
    document.querySelectorAll('[data-vegas-slides]').forEach((el) => {
        if (el._vegas) return;
        try {
            const slides = JSON.parse(el.dataset.vegasSlides);
            if (slides?.length) {
                Vegas(el, {
                    slides,
                    delay: 10000,
                    transition: 'fade',
                    transitionDuration: 1000,
                });
            }
        } catch (e) { }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVegasSlideshows);
} else {
    initVegasSlideshows();
}
