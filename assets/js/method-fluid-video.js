/**
 * Method Video Overlay
 * Click-to-play handler for video overlay blocks.
 */
(function () {
    'use strict';

    const SELECTOR = '.method-fluid-video';

    /**
     * Build the iframe element for a given embed URL and provider.
     *
     * @param {string} embedUrl
     * @param {string} provider
     * @return {HTMLIFrameElement}
     */
    function buildIframe(embedUrl, provider) {
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute(
            'allow',
            'autoplay; encrypted-media; picture-in-picture; fullscreen'
        );
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute(
            'title',
            provider === 'vimeo' ? 'Vimeo video player' : 'YouTube video player'
        );
        iframe.className = 'method-fluid-video__iframe';
        return iframe;
    }

    /**
     * Swap poster for player on a single block instance.
     *
     * @param {HTMLElement} block
     */
    function activate(block) {
        // Guard against double-activation.
        if (block.dataset.active === 'true') {
            return;
        }

        const embedUrl = block.dataset.embedUrl;
        const provider = block.dataset.provider;
        const trigger = block.querySelector('.method-fluid-video-preview');
        const player = block.querySelector('.method-fluid-video-player');

        if (!embedUrl || !trigger || !player) {
            return;
        }

        const iframe = buildIframe(embedUrl, provider);
        player.appendChild(iframe);
        player.hidden = false;

        // Hide the poster button. Use hidden so it's removed from a11y tree too.
        trigger.hidden = true;

        block.dataset.active = 'true';

        // Move focus into the player region for keyboard users.
        player.setAttribute('tabindex', '-1');
        player.focus({ preventScroll: true });
    }

    /**
     * Bind a single block.
     *
     * @param {HTMLElement} block
     */
    function bind(block) {
        const trigger = block.querySelector('.method-fluid-video-preview');
        if (!trigger) {
            return;
        }

        trigger.addEventListener('click', function () {
            activate(block);
        });
    }

    /**
     * Init all blocks on the page.
     */
    function init() {
        document.querySelectorAll(SELECTOR).forEach(bind);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
