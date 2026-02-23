<?php

function method_bc_register_block() {
    
    // Enqueue block editor JS
    wp_register_script(
        'method-bc-block-editor-script',
        get_template_directory_uri() . '/lib/blocks/method-bc/build/index.js',
        array('react-jsx-runtime'),
        METHOD_VERSION,
        true
    );

    // Register the block
    register_block_type('method/bc', array(
        'editor_script' => 'method-bc-block-editor-script',
        'render_callback' => 'method_render_breadcrumb_block',
    ));
}
add_action('init', 'method_bc_register_block');

function method_render_breadcrumb_block( $attributes, $block ) {

    // Get options (assuming CMB2 options page)
    $options = get_option( 'method_options' ); // adjust to your options key

    $sep            = ! empty( $options['bc_sep'] ) ? $options['bc_sep'] : '/';
    $include_home   = ! empty( $options['bc_home'] );
    $include_current = ! empty( $options['bc_current'] );

    $items = [];

    // Home
    if ( $include_home ) {
        $items[] = [
            'label' => __( 'Home', 'method' ),
            'url'   => home_url( '/' ),
        ];
    }

    if ( is_singular() ) {
        $items = array_merge( $items, method_bc_get_singular_trail( $options ) );
    } elseif ( is_tax() || is_category() || is_tag() ) {
        $items = array_merge( $items, method_bc_get_taxonomy_trail( $options ) );
    } elseif ( is_post_type_archive() ) {
        $items = array_merge( $items, method_bc_get_post_type_archive_trail( $options ) );
    } elseif ( is_home() ) {
        // Blog page
        if ( $include_current ) {
            $blog_page = get_option( 'page_for_posts' );
            if ( $blog_page ) {
                $items[] = [
                    'label' => method_bc_get_item_label( $blog_page ),
                    'url'   => null,
                ];
            }
        }
    } elseif ( is_page() ) {
        $items = array_merge( $items, method_bc_get_page_trail() );
    } elseif ( is_search() ) {
        if ( $include_current ) {
            $items[] = [
                'label' => __( 'Search Results', 'method' ),
                'url'   => null,
            ];
        }
    } elseif ( is_404() ) {
        if ( $include_current ) {
            $items[] = [
                'label' => __( 'Not Found', 'method' ),
                'url'   => null,
            ];
        }
    }

    // If not including current item, remove last item's URL (or remove it entirely)
    if ( ! $include_current && ! empty( $items ) ) {
        // The last item IS the current item, so pop it
        // But only if it's the "current" contextual item, not a parent
        // This depends on how each trail builder handles it — see below
    }

    if ( empty( $items ) ) {
        return '';
    }

    return method_bc_render_markup( $items, $sep, $attributes, $options );
}

/**
 * Get label for a post/page, respecting custom meta override.
 */
function method_bc_get_item_label( $post_id ) {
    $custom = get_post_meta( $post_id, '_method_bc_title', true );
    return ! empty( $custom ) ? $custom : get_the_title( $post_id );
}

/**
 * Get label for a term, respecting custom meta override.
 */
function method_bc_get_term_label( $term_id ) {
    $custom = get_term_meta( $term_id, '_method_bc_title', true );
    if ( ! empty( $custom ) ) {
        return $custom;
    }
    $term = get_term( $term_id );
    return $term ? $term->name : '';
}

/**
 * Build the middle trail items from a page behavior value.
 * This resolves the configured "parent page" option into trail items.
 *
 * If the value is a page ID, walk up the page hierarchy.
 * If the value starts with "archive_", it's an archive reference.
 * If empty, no parent items.
 */
function method_bc_resolve_behavior( $behavior ) {
    $items = [];

    if ( empty( $behavior ) ) {
        return $items;
    }

    // Archive reference (e.g., "archive_guides")
    if ( 0 === strpos( $behavior, 'archive_' ) ) {
        $pt_name = str_replace( 'archive_', '', $behavior );
        $pt_obj  = get_post_type_object( $pt_name );
        if ( $pt_obj && $pt_obj->has_archive ) {
            $items[] = [
                'label' => $pt_obj->label,
                'url'   => get_post_type_archive_link( $pt_name ),
            ];
        }
        return $items;
    }

    // Page ID — walk up the hierarchy
    if ( is_numeric( $behavior ) ) {
        $page_id = absint( $behavior );
        $ancestors = [];

        // Get the selected page and its ancestors
        $page_ancestors = get_ancestors( $page_id, 'page', 'post_type' );
        $page_ancestors = array_reverse( $page_ancestors ); // top-down

        foreach ( $page_ancestors as $ancestor_id ) {
            $ancestors[] = [
                'label' => method_bc_get_item_label( $ancestor_id ),
                'url'   => get_permalink( $ancestor_id ),
            ];
        }

        // Add the selected page itself
        $ancestors[] = [
            'label' => method_bc_get_item_label( $page_id ),
            'url'   => get_permalink( $page_id ),
        ];

        return $ancestors;
    }

    return $items;
}

/**
 * Singular post/CPT trail.
 */
function method_bc_get_singular_trail( $options ) {
    $items    = [];
    $post     = get_queried_object();
    $pt       = $post->post_type;

    // Get the configured behavior for this post type
    $behavior = isset( $options[ 'bc_' . $pt . '_behavior' ] ) ? $options[ 'bc_' . $pt . '_behavior' ] : '';

    // Resolve the parent behavior into trail items
    $items = array_merge( $items, method_bc_resolve_behavior( $behavior ) );

    // For post types with archives, optionally include the archive
    if ( ! empty( $options[ 'bc_' . $pt . '_archive' ] ) ) {
        $pt_obj = get_post_type_object( $pt );
        if ( $pt_obj ) {
            $archive_label = ! empty( $options[ 'bc_' . $pt . '_label' ] ) ? $options[ 'bc_' . $pt . '_label' ] : $pt_obj->label;

            // For built-in "post" type, use the blog page
            if ( 'post' === $pt ) {
                $blog_page = get_option( 'page_for_posts' );
                $archive_url = $blog_page ? get_permalink( $blog_page ) : home_url( '/' );
            } else {
                $archive_url = get_post_type_archive_link( $pt );
            }

            if ( $archive_url ) {
                $items[] = [
                    'label' => $archive_label,
                    'url'   => $archive_url,
                ];
            }
        }
    }

    // For hierarchical post types (like pages used as CPTs), walk up post parent
    if ( is_post_type_hierarchical( $pt ) && $post->post_parent ) {
        $ancestors = get_ancestors( $post->ID, $pt, 'post_type' );
        $ancestors = array_reverse( $ancestors );
        foreach ( $ancestors as $ancestor_id ) {
            $items[] = [
                'label' => method_bc_get_item_label( $ancestor_id ),
                'url'   => get_permalink( $ancestor_id ),
            ];
        }
    }

    // Current item
    if ( ! empty( $options['bc_current'] ) ) {
        $items[] = [
            'label' => method_bc_get_item_label( $post->ID ),
            'url'   => null, // no link for current
        ];
    }

    return $items;
}

/**
 * Taxonomy term archive trail.
 */
function method_bc_get_taxonomy_trail( $options ) {
    $items = [];
    $term  = get_queried_object();
    $tax   = $term->taxonomy;

    // Get configured behavior
    $behavior = isset( $options[ 'bc_' . $tax . '_behavior' ] ) ? $options[ 'bc_' . $tax . '_behavior' ] : '';

    // Resolve parent behavior
    $items = array_merge( $items, method_bc_resolve_behavior( $behavior ) );

    // For hierarchical taxonomies, walk up term parents
    if ( is_taxonomy_hierarchical( $tax ) && $term->parent ) {
        $ancestors = get_ancestors( $term->term_id, $tax, 'taxonomy' );
        $ancestors = array_reverse( $ancestors );
        foreach ( $ancestors as $ancestor_id ) {
            $items[] = [
                'label' => method_bc_get_term_label( $ancestor_id ),
                'url'   => get_term_link( $ancestor_id, $tax ),
            ];
        }
    }

    // Current term
    if ( ! empty( $options['bc_current'] ) ) {
        $items[] = [
            'label' => method_bc_get_term_label( $term->term_id ),
            'url'   => null,
        ];
    }

    return $items;
}

/**
 * Post type archive trail.
 */
function method_bc_get_post_type_archive_trail( $options ) {
    $items  = [];
    $pt     = get_queried_object()->name;

    // Get configured behavior
    $behavior = isset( $options[ 'bc_' . $pt . '_behavior' ] ) ? $options[ 'bc_' . $pt . '_behavior' ] : '';

    // Resolve parent behavior
    $items = array_merge( $items, method_bc_resolve_behavior( $behavior ) );

    // Current archive
    if ( ! empty( $options['bc_current'] ) ) {
        $archive_label = ! empty( $options[ 'bc_' . $pt . '_label' ] ) ? $options[ 'bc_' . $pt . '_label' ] : get_queried_object()->label;
        $items[] = [
            'label' => $archive_label,
            'url'   => null,
        ];
    }

    return $items;
}

/**
 * Page trail — walk up the page hierarchy.
 */
function method_bc_get_page_trail() {
    $items = [];
    $post  = get_queried_object();

    if ( $post->post_parent ) {
        $ancestors = get_ancestors( $post->ID, 'page', 'post_type' );
        $ancestors = array_reverse( $ancestors );
        foreach ( $ancestors as $ancestor_id ) {
            $items[] = [
                'label' => method_bc_get_item_label( $ancestor_id ),
                'url'   => get_permalink( $ancestor_id ),
            ];
        }
    }

    // Current page
    $options = get_option( 'method_options' );
    if ( ! empty( $options['bc_current'] ) ) {
        $items[] = [
            'label' => method_bc_get_item_label( $post->ID ),
            'url'   => null,
        ];
    }

    return $items;
}

/**
 * Render the breadcrumb HTML markup.
 */
function method_bc_render_markup( $items, $sep, $attributes = [], $options = [] ) {
    if ( empty( $items ) ) {
        return '';
    }

    $wrapper_attrs = get_block_wrapper_attributes();

    $output = '<nav ' . $wrapper_attrs . ' aria-label="' . esc_attr__( 'Breadcrumb', 'method' ) . '">';
    $output .= '<ol class="method-breadcrumb-list">';

    $total = count( $items );
    foreach ( $items as $i => $item ) {
        $is_last = ( $i === $total - 1 );

        $output .= '<li class="method-breadcrumb-item">';

        if ( $item['url'] ) {
            $output .= '<a href="' . esc_url( $item['url'] ) . '">' . esc_html( $item['label'] ) . '</a>';
        } else {
            $output .= '<span aria-current="page">' . esc_html( $item['label'] ) . '</span>';
        }

        $always_sep = ! empty( $options['bc_sep_inclusion'] );
        if ( ! $is_last || $always_sep ) {
            $output .= '<span class="method-breadcrumb-sep" aria-hidden="true">' . esc_html( $sep ) . '</span>';
        }

        $output .= '</li>';
    }

    $output .= '</ol>';
    $output .= '</nav>';

    return $output;
}