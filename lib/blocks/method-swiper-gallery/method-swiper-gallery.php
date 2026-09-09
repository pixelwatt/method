<?php

// Block registrations

function register_method_swiper_gallery_block() {
	register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_method_swiper_gallery_block'
    ]);
}
add_action( 'init', 'register_method_swiper_gallery_block' );

function method_swiper_gallery_enqueue_assets() {
    wp_enqueue_script('swiper', get_template_directory_uri() . '/inc/swiper/swiper-bundle.min.js', [], null, true);
    wp_enqueue_style('swiper', get_template_directory_uri() . '/inc/swiper/swiper-bundle.min.css');
}
add_action('enqueue_block_assets', 'method_swiper_gallery_enqueue_assets');


/**
 * Class the shared runtime keeps on the center visible slide(s) when the
 * block's "Mark center slides" option is on (see lib/blocks/utils/swiperRuntime.js).
 */
define( 'METHOD_SWIPER_GALLERY_CENTER_CLASS', 'method-swiper-gallery-center' );


/**
 * The gallery's hash identifier, normalised the same way src/edit.js does
 * (lowercase; anything but a-z, 0-9, `-` and `_` collapsed to a dash).
 *
 * @param array $block_attributes Block attributes.
 * @return string Identifier, or '' when hash navigation is off / no id is stored.
 */
function method_swiper_gallery_get_hash_id( $block_attributes ) {
    if ( empty( $block_attributes['hashNavigation'] ) || empty( $block_attributes['hashId'] ) ) {
        return '';
    }
    $hash_id = preg_replace( '/[^a-z0-9_-]+/', '-', strtolower( (string) $block_attributes['hashId'] ) );
    return trim( $hash_id, '-' ) === '' ? '' : $hash_id;
}


/**
 * Hash of a single slide: `<hashId>-slide-<n>`, 1-based, so every slide's
 * hash carries the gallery's identifier. Mirrors getSlideHash() in src/edit.js.
 *
 * @param string $hash_id Gallery identifier.
 * @param int    $index   0-based slide index.
 * @return string
 */
function method_swiper_gallery_get_slide_hash( $hash_id, $index ) {
    return $hash_id . '-slide-' . ( (int) $index + 1 );
}


/**
 * Which tiers loop. The gallery always loops (as the original block did) —
 * except at a tier where Swiper would refuse: loop mode needs at least
 * slidesPerView + 1 slides, and with fewer there is nothing to slide anyway.
 * Per-view defaults match method_swiper_render(); src/edit.js applies the
 * same rule to the tier it resolves in the editor.
 *
 * @param array $block_attributes Block attributes.
 * @param int   $slide_count      Number of rendered slides.
 * @return array{mobile: bool, tablet: bool, desktop: bool}
 */
function method_swiper_gallery_get_loop_tiers( $block_attributes, $slide_count ) {
    $fade     = ! empty( $block_attributes['fadeEffect'] );
    $per_view = array(
        'mobile'  => $fade ? 1 : ( isset( $block_attributes['slidesPerViewMobile'] ) ? (int) $block_attributes['slidesPerViewMobile'] : 1 ),
        'tablet'  => $fade ? 1 : ( isset( $block_attributes['slidesPerViewTablet'] ) ? (int) $block_attributes['slidesPerViewTablet'] : 2 ),
        'desktop' => $fade ? 1 : ( isset( $block_attributes['slidesPerView'] ) ? (int) $block_attributes['slidesPerView'] : 3 ),
    );

    $loop = array();
    foreach ( $per_view as $tier => $count ) {
        $loop[ $tier ] = (int) $slide_count > max( 1, $count );
    }
    return $loop;
}


/**
 * name => value pairs to an escaped HTML attribute string. Empty / false
 * values are skipped.
 *
 * @param array $attributes
 * @return string Leading-space-prefixed attribute string, or ''.
 */
function method_swiper_gallery_attribute_string( $attributes ) {
    $output = '';
    foreach ( $attributes as $name => $value ) {
        if ( null === $value || false === $value || '' === $value ) {
            continue;
        }
        $escaped = ( 'href' === $name ) ? esc_url( $value ) : esc_attr( $value );
        $output .= ' ' . $name . '="' . $escaped . '"';
    }
    return $output;
}


function render_method_swiper_gallery_block( $block_attributes, $block ) {
    $methodId = uniqid( 'method' );

    $cssargs = array(
        '#' . $methodId . ' .method-swiper-button-prev, #' . $methodId . ' .method-swiper-button-next' => array( 'textColor' ),
        '#' . $methodId . ' .swiper-pagination' => array( 'linkColor' ),
        '#' . $methodId . ' .method-swiper-gallery-item' => array( 'bgColor' ),
        '#' . $methodId . ' .method-swiper-gallery-item > .method-fit-img-container' => array( 'aspectRatio' ),
        '#' . $methodId . ' .method-img-shade' => array( 'bgShade' ),
    );
    $responsive = method_get_block_responsive_styles( $block_attributes, $cssargs, array( 'base', 'mobile', 'tablet', 'wide' ), false );
    method_collect_css( $responsive, '#' . $methodId, 10 );

    // Image sizing (mirrors src/edit.js): a fixed ratio crops with
    // .method-fit-img; the default lets each image flow at its own ratio.
    $aspectClass = '';
    $outerClass  = 'method-fit-img-container';
    $imgClass    = 'method-fit-img';
    $aspectUses  = method_get_responsive_setting( $block_attributes, 'base', 'aspectUses', '' );
    if ( 'ratio' == $aspectUses ) {
        $aspectClass = ' method-ratio method-ratio' . method_get_responsive_setting( $block_attributes, 'base', 'aspectRatio', '-1-1' );
    } elseif ( empty( $aspectUses ) ) {
        $outerClass = 'method-swiper-img-container';
        $imgClass   = 'method-fluid-img';
    }

    $lightbox      = ! empty( $block_attributes['lightbox'] );
    $fade_effect   = ! empty( $block_attributes['fadeEffect'] );
    // Fade shows one slide at a time, so there is never a center slide to mark.
    $center_slides = ! $fade_effect && ! empty( $block_attributes['centerSlides'] );
    $hash_id       = method_swiper_gallery_get_hash_id( $block_attributes );

    $images = ( ! empty( $block_attributes['images'] ) && is_array( $block_attributes['images'] ) )
        ? array_values( $block_attributes['images'] )
        : array();

    $slides      = '';
    $slide_count = 0;
    foreach ( $images as $index => $item ) {
        $attachment_id = ( is_array( $item ) && ! empty( $item['id'] ) ) ? (int) $item['id'] : 0;
        if ( ! $attachment_id ) {
            continue;
        }
        $image = wp_get_attachment_image( $attachment_id, 'method_hd', false, array( 'class' => $imgClass ) );
        if ( ! $image ) {
            // Attachment removed since it was selected; slide numbering (and
            // therefore hashes) still follow the stored image order.
            continue;
        }

        $slide_atts = array( 'class' => 'swiper-slide' );
        if ( $hash_id ) {
            $slide_atts['data-hash'] = method_swiper_gallery_get_slide_hash( $hash_id, $index );
        }

        // With the lightbox on, the whole slide image becomes the trigger: an
        // <a> to the full-size image that the shared lightbox script enhances
        // (the same markup the Fitted Image block uses).
        $item_tag  = 'div';
        $item_atts = array( 'class' => 'method-swiper-gallery-item' );
        if ( $lightbox ) {
            $lightbox_atts = method_get_lightbox_attributes( $attachment_id );
            if ( $lightbox_atts ) {
                $item_tag  = 'a';
                $item_atts = array_merge( array( 'class' => 'method-swiper-gallery-item method-lightbox-trigger' ), $lightbox_atts );
            }
        }

        $slide_count++;
        $slides .= '
            <div' . method_swiper_gallery_attribute_string( $slide_atts ) . '>
                <' . $item_tag . method_swiper_gallery_attribute_string( $item_atts ) . '>
                    <div class="' . esc_attr( $outerClass . $aspectClass ) . '">
                        <div class="method-img-shade">&nbsp;</div>
                        ' . $image . '
                    </div>
                </' . $item_tag . '>
            </div>';
    }

    if ( '' === $slides ) {
        return '';
    }

    return method_swiper_render(
        $block_attributes,
        '<div class="swiper-wrapper">' . $slides . '</div>',
        array(
            'id'                    => $methodId,
            'class'                 => 'method-swiper-gallery',
            // Lets Swiper know which slides are on screen, so keyboard focus
            // moving between visible lightbox links doesn't jump the track.
            'watch_slides_progress' => true,
            'center_class'          => $center_slides ? METHOD_SWIPER_GALLERY_CENTER_CLASS : '',
            'loop'                  => method_swiper_gallery_get_loop_tiers( $block_attributes, $slide_count ),
        )
    );
}
