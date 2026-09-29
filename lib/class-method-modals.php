<?php
/**
 * Modal Registry
 * Collects modals from any source and prints them once, directly under <body>.
 *
 * A Bootstrap modal printed where its block sits ends up inside the Section
 * block's z-indexed stacking context, where the body-level backdrop paints
 * over it. So a modal's content is rendered where it is declared (block
 * render, which is early enough for the content's own asset enqueues), handed
 * to this registry, and the markup is printed on wp_footer.
 *
 * The registry does not care where a modal comes from. The Modal block
 * (lib/blocks/method-modal) registers from its render callback, so a block in
 * post content, a template part or a synced pattern all work the same way.
 * Any other source can either call method_register_modal() directly, or hook
 * `method/register_modals` and run its stored block content through
 * do_blocks():
 *
 *     add_action( 'method/register_modals', function ( $registry ) {
 *         $registry->push_context( array( 'scope' => 'site', 'source' => 'my-source' ) );
 *         do_blocks( $stored_block_content );
 *         $registry->pop_context();
 *     } );
 */
class Method_Modals {
    const SCRIPT_HANDLE = 'method-modal-view-script';

    const DEFAULT_CLOSE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>';

    private static ?self $instance = null;
    private array $modals  = [];   // id => modal, in registration order
    private array $printed = [];   // already-printed ids => true
    private array $context = [];   // stack of scope/source defaults
    private array $asset_snapshots = []; // stack of asset queues, see snapshot_assets()
    private bool $closed   = false; // true once the last footer pass has run

    public static function instance(): self {
        return self::$instance ??= new self();
    }

    private function __construct() {
        // Before the Modal block registers (init:10), so core reuses this
        // handle for the block's viewScript instead of registering its own.
        add_action( 'init', [ $this, 'register_script' ], 9 );

        // Block themes render the template before wp_head, so by now every
        // modal declared in the template or post content is registered and
        // wins an id collision with anything added here.
        add_action( 'wp_enqueue_scripts', [ $this, 'collect' ], 5 );

        // Second pass catches modals registered by other wp_footer callbacks,
        // and still runs ahead of the CSS collector's flush and the footer
        // scripts (both wp_footer:20).
        add_action( 'wp_footer', [ $this, 'print_modals' ], 5 );
        add_action( 'wp_footer', [ $this, 'print_late_modals' ], 19 );

        // Hoisted content never reaches the `the_content` filters that run
        // after do_blocks(), so the same ones are applied here.
        add_filter( 'method/modal_content', 'wptexturize' );
        add_filter( 'method/modal_content', 'shortcode_unautop' );
        add_filter( 'method/modal_content', 'wp_replace_insecure_home_url' );
        add_filter( 'method/modal_content', 'do_shortcode', 11 );
        add_filter( 'method/modal_content', 'wp_filter_content_tags', 12 );
        add_filter( 'method/modal_content', 'convert_smilies', 20 );
    }

    /**
     * Registers the front-end trigger script (lib/blocks/utils/modals.js,
     * built into the Modal block's view script). It needs Bootstrap, which
     * ships in the `method` script bundle.
     */
    public function register_script(): void {
        $build = '/lib/blocks/method-modal/build/frontend';
        if ( ! file_exists( get_template_directory() . $build . '.js' ) ) {
            return;
        }

        $asset_file = get_template_directory() . $build . '.asset.php';
        $asset      = file_exists( $asset_file ) ? require $asset_file : array();

        /**
         * Filters the script handles the modal trigger script depends on.
         *
         * @param string[] $handles Script handles. Default the `method` bundle,
         *                          which provides `window.bootstrap.Modal`.
         */
        $bootstrap = (array) apply_filters( 'method/modal_script_dependencies', array( 'method' ) );

        wp_register_script(
            self::SCRIPT_HANDLE,
            get_template_directory_uri() . $build . '.js',
            array_values( array_unique( array_merge( $asset['dependencies'] ?? array(), $bootstrap ) ) ),
            $asset['version'] ?? METHOD_VERSION,
            array(
                'strategy'  => 'defer',
                'in_footer' => true,
            )
        );
    }

    public function collect(): void {
        /**
         * Fires when sources other than rendered blocks should register their
         * modals, e.g. sitewide modals.
         *
         * @param Method_Modals $registry The modal registry.
         */
        do_action( 'method/register_modals', $this );

        $this->enqueue_assets();
    }

    /**
     * Remembers which assets are enqueued right now, so that whatever a
     * modal's content enqueues while it renders can be told apart. Pair every
     * call with assets_since_snapshot().
     */
    public function snapshot_assets(): void {
        $this->asset_snapshots[] = self::get_asset_queues();
    }

    /**
     * @return array[] Handles enqueued since the matching snapshot_assets(),
     *                 as `styles`, `scripts` and `modules`. Empty without one.
     */
    public function assets_since_snapshot(): array {
        $before = array_pop( $this->asset_snapshots );
        if ( null === $before ) {
            return array();
        }

        $assets = array();
        foreach ( self::get_asset_queues() as $type => $queue ) {
            $assets[ $type ] = array_values( array_diff( $queue, $before[ $type ] ) );
        }
        return $assets;
    }

    private static function get_asset_queues(): array {
        return array(
            'styles'  => wp_styles()->queue,
            'scripts' => wp_scripts()->queue,
            'modules' => wp_script_modules()->get_queue(),
        );
    }

    /**
     * Enqueues the trigger script and the assets of every modal's content.
     *
     * They were enqueued once already, while the content rendered. But
     * WordPress dequeues what was enqueued during the render of a block that
     * prints nothing, and a block that holds only modals (a synced pattern,
     * say) prints nothing.
     */
    public function enqueue_assets(): void {
        if ( empty( $this->modals ) ) {
            return;
        }

        if ( wp_script_is( self::SCRIPT_HANDLE, 'registered' ) ) {
            wp_enqueue_script( self::SCRIPT_HANDLE );
        }

        foreach ( $this->modals as $modal ) {
            foreach ( $modal['assets']['styles'] ?? array() as $handle ) {
                wp_enqueue_style( $handle );
            }
            foreach ( $modal['assets']['scripts'] ?? array() as $handle ) {
                wp_enqueue_script( $handle );
            }
            foreach ( $modal['assets']['modules'] ?? array() as $id ) {
                wp_enqueue_script_module( $id );
            }
        }
    }

    /**
     * Sets the scope and source given to modals registered until the matching
     * pop_context(), unless a modal passes its own.
     */
    public function push_context( array $context ): void {
        $this->context[] = $context;
    }

    public function pop_context(): void {
        array_pop( $this->context );
    }

    public static function default_options(): array {
        return array(
            'size'             => 'default',
            'fullscreen_below' => '',
            'centered'         => false,
            'scrollable'       => false,
            'static_backdrop'  => false,
            'hide_title'       => false,
            'title_tag'        => 'h2',
            'close_icon'       => '',
            'close_label'      => __( 'Close', 'method' ),
        );
    }

    /**
     * @param array $args See method_register_modal().
     * @return string|false The id the modal can be opened with, or false if
     *                      it was not registered.
     */
    public function register( array $args ) {
        $context = end( $this->context ) ?: array();

        $args = wp_parse_args( $args, array(
            'id'      => '',
            'title'   => '',
            'content' => '',
            'scope'   => $context['scope'] ?? 'post',
            'source'  => $context['source'] ?? '',
            'class'   => '',
            'css'     => '',
            'assets'  => array(),
            'options' => array(),
        ) );
        $args['options'] = wp_parse_args( (array) $args['options'], self::default_options() );
        $args['options']['size']             = (string) $args['options']['size'];
        $args['options']['fullscreen_below'] = (string) $args['options']['fullscreen_below'];

        /**
         * Filters a modal before it is registered.
         *
         * @param array|false $args Modal arguments. Return false to skip the modal.
         */
        $args = apply_filters( 'method/modal_args', $args );
        if ( ! is_array( $args ) || empty( $args ) ) {
            return false;
        }

        $id = method_sanitize_modal_id( $args['id'] );
        if ( '' === $id ) {
            return false;
        }
        $args['id'] = $id;

        // First registration wins: a synced pattern used twice, or the same
        // post shown twice, registers the same modal again.
        if ( isset( $this->modals[ $id ] ) ) {
            /**
             * Fires when a modal is registered with an id that is already taken.
             *
             * @param array $args     The rejected modal.
             * @param array $existing The modal that holds the id.
             */
            do_action( 'method/modal_duplicate', $args, $this->modals[ $id ] );
            return $id;
        }

        if ( $this->closed ) {
            _doing_it_wrong( __METHOD__, 'Modals must be registered before wp_footer priority 19.', '2.0.0-beta26' );
            return false;
        }

        /**
         * Filters a modal's rendered content.
         *
         * @param string $content Rendered HTML.
         * @param array  $args    Modal arguments.
         */
        $args['content'] = (string) apply_filters( 'method/modal_content', (string) $args['content'], $args );

        if ( '' !== trim( (string) $args['css'] ) ) {
            method_collect_css( $args['css'], '#' . $id . '.method-modal', 10 );
        }

        $tier = $args['options']['fullscreen_below'];
        if ( 'fullscreen' !== $args['options']['size'] && '' !== self::get_fullscreen_css( $tier ) ) {
            // One shared rule per tier, however many modals use it.
            method_collect_css( self::get_fullscreen_css( $tier ), 'method-modal-fullscreen-' . $tier, 5 );
        }

        if ( wp_script_is( self::SCRIPT_HANDLE, 'registered' ) ) {
            wp_enqueue_script( self::SCRIPT_HANDLE );
        }

        $this->modals[ $id ] = $args;

        /**
         * Fires after a modal is registered.
         *
         * @param array $args Modal arguments.
         */
        do_action( 'method/modal_registered', $args );

        return $id;
    }

    public function is_registered( string $id ): bool {
        return isset( $this->modals[ $id ] );
    }

    /**
     * @param string|null $scope Limit to one scope ('post', 'site', ...).
     * @return array[] Registered modals keyed by id.
     */
    public function all( ?string $scope = null ): array {
        if ( null === $scope ) {
            return $this->modals;
        }
        return array_filter( $this->modals, fn( $modal ) => $scope === $modal['scope'] );
    }

    /**
     * "Full screen below" rule for a tier, from the theme's breakpoints.
     * The per-modal border and radius are id-scoped, hence the !important.
     */
    public static function get_fullscreen_css( string $tier ): string {
        $bps = method_get_block_breakpoints();
        $max = array(
            'mobile' => $bps['mobile_max'],
            'tablet' => $bps['tablet_max'],
        );
        if ( ! isset( $max[ $tier ] ) ) {
            return '';
        }

        $dialog = '.method-modal .modal-dialog.method-modal-fullscreen-' . $tier;

        return '@media (max-width:' . $max[ $tier ] . ') { '
            . $dialog . ' { width:100vw; max-width:none; height:100%; margin:0; } '
            . $dialog . ' .modal-content { height:100%; border:0 !important; border-radius:0 !important; } '
            . $dialog . ' .modal-header { border-radius:0; } '
            . $dialog . ' .modal-body { overflow-y:auto; } '
            . '}';
    }

    public function get_markup( array $modal ): string {
        $id      = $modal['id'];
        $options = $modal['options'];
        $sizes   = method_get_modal_sizes();
        $size    = isset( $sizes[ $options['size'] ] ) ? $options['size'] : 'default';

        $dialog_classes = array( 'modal-dialog' );
        if ( ! empty( $sizes[ $size ]['class'] ) ) {
            $dialog_classes[] = $sizes[ $size ]['class'];
        }
        if ( $options['centered'] ) {
            $dialog_classes[] = 'modal-dialog-centered';
        }
        if ( $options['scrollable'] ) {
            $dialog_classes[] = 'modal-dialog-scrollable';
        }
        if ( 'fullscreen' !== $size && '' !== self::get_fullscreen_css( $options['fullscreen_below'] ) ) {
            $dialog_classes[] = 'method-modal-fullscreen-' . $options['fullscreen_below'];
        }

        $title    = trim( wp_kses( (string) $modal['title'], array() ) );
        $title_id = $id . '-title';

        $attributes = array(
            'class'                   => trim( 'modal fade method-modal ' . $modal['class'] ),
            'id'                      => $id,
            'tabindex'                => '-1',
            'aria-hidden'             => 'true',
            'data-method-modal-scope' => $modal['scope'],
        );
        if ( '' !== $title ) {
            $attributes['aria-labelledby'] = $title_id;
        } else {
            $attributes['aria-label'] = __( 'Dialog', 'method' );
        }
        if ( ! empty( $sizes[ $size ]['width'] ) ) {
            $attributes['style'] = '--method-modal-width:' . $sizes[ $size ]['width'];
        }
        if ( $options['static_backdrop'] ) {
            $attributes['data-bs-backdrop'] = 'static';
        }

        $attribute_html = '';
        foreach ( $attributes as $name => $value ) {
            $attribute_html .= ' ' . $name . '="' . esc_attr( $value ) . '"';
        }

        $heading = '';
        if ( '' !== $title ) {
            $tag     = in_array( $options['title_tag'], array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' ), true ) ? $options['title_tag'] : 'h2';
            $heading = '<' . $tag . ' class="modal-title' . ( $options['hide_title'] ? ' visually-hidden' : '' ) . '" id="' . esc_attr( $title_id ) . '">' . $title . '</' . $tag . '>';
        }

        $icon       = self::DEFAULT_CLOSE_ICON;
        $icon_class = 'method-modal-close-icon';
        $icons      = method_get_theme_icons();
        if ( $options['close_icon'] && is_array( $icons ) && ! empty( $icons[ $options['close_icon'] ]['svg'] ) ) {
            $icon        = $icons[ $options['close_icon'] ]['svg'];
            $icon_class .= ' method-modal-close-icon-custom';
        }

        $markup = '
            <div' . $attribute_html . '>
                <div class="' . esc_attr( implode( ' ', $dialog_classes ) ) . '">
                    <div class="modal-content">
                        <div class="modal-header">
                            ' . $heading . '
                            <button type="button" class="method-modal-close" data-bs-dismiss="modal" aria-label="' . esc_attr( $options['close_label'] ) . '"><span class="' . $icon_class . '" aria-hidden="true">' . $icon . '</span></button>
                        </div>
                        <div class="modal-body">' . $modal['content'] . '</div>
                    </div>
                </div>
            </div>';

        /**
         * Filters a modal's markup before it is printed.
         *
         * @param string $markup Modal HTML.
         * @param array  $modal  Modal arguments.
         */
        return (string) apply_filters( 'method/modal_markup', $markup, $modal );
    }

    public function print_modals(): void {
        // Covers modals registered after wp_enqueue_scripts.
        $this->enqueue_assets();

        foreach ( $this->modals as $id => $modal ) {
            if ( isset( $this->printed[ $id ] ) ) {
                continue;
            }
            $this->printed[ $id ] = true;
            echo $this->get_markup( $modal );
        }
    }

    public function print_late_modals(): void {
        $this->print_modals();
        $this->closed = true;
    }
}

Method_Modals::instance();

/**
 * Registers a modal to be printed in the footer. Any link to `#<id>` on the
 * page opens it.
 *
 * Call this while the page is rendering and no later than wp_footer priority
 * 18. Render `content` before calling, not from a footer callback, so that
 * asset enqueues made by the content happen in time.
 *
 * @param array $args {
 *     @type string $id      Required. Sanitized with method_sanitize_modal_id().
 *     @type string $title   Plain text. Labels the dialog even when hidden.
 *     @type string $content Rendered HTML for the modal body.
 *     @type string $scope   'post' or 'site'. Default 'post'.
 *     @type string $source  Free-form origin, e.g. 'block'.
 *     @type string $class   Extra classes for the modal element.
 *     @type string $css     CSS for this modal, printed with the block CSS.
 *     @type array  $assets  Handles the content enqueued while it rendered, as
 *                           `styles`, `scripts` and `modules`, to be kept
 *                           enqueued. See Method_Modals::snapshot_assets().
 *     @type array  $options size, fullscreen_below ('', 'mobile', 'tablet'),
 *                           centered, scrollable, static_backdrop, hide_title,
 *                           title_tag, close_icon (theme icon slug), close_label.
 * }
 * @return string|false The id the modal can be opened with (also when that id
 *                      was already registered; the first registration wins),
 *                      or false if the modal was not registered.
 */
function method_register_modal( array $args ) {
    return Method_Modals::instance()->register( $args );
}

/**
 * Makes a value safe to use as a modal's element id, link hash and CSS id
 * selector. Mirrors sanitizeModalId() in lib/blocks/utils/modalId.js.
 *
 * @param string $id
 * @return string Sanitized id, or '' if nothing usable is left.
 */
function method_sanitize_modal_id( $id ) {
    $id = preg_replace( '/[^a-z0-9_-]+/', '-', strtolower( (string) $id ) );
    $id = trim( $id, '-_' );
    if ( '' === $id ) {
        return '';
    }
    // A CSS identifier cannot start with a digit.
    return preg_match( '/^[a-z]/', $id ) ? $id : 'modal-' . $id;
}

/**
 * Sizes offered by the Modal block.
 *
 * @return array[] Size slug => array of `label`, `class` (added to
 *                 .modal-dialog) and `width` (max width; '' for none).
 */
function method_get_modal_sizes() {
    $sizes = array(
        'sm'         => array( 'label' => __( 'Small', 'method' ), 'class' => 'modal-sm', 'width' => '300px' ),
        'default'    => array( 'label' => __( 'Default', 'method' ), 'class' => '', 'width' => '500px' ),
        'lg'         => array( 'label' => __( 'Large', 'method' ), 'class' => 'modal-lg', 'width' => '800px' ),
        'xl'         => array( 'label' => __( 'Extra large', 'method' ), 'class' => 'modal-xl', 'width' => '1140px' ),
        'fullscreen' => array( 'label' => __( 'Full screen', 'method' ), 'class' => 'modal-fullscreen', 'width' => '' ),
    );

    /**
     * Filters the sizes offered by the Modal block. `default` and
     * `fullscreen` are expected to stay.
     *
     * @param array[] $sizes Size slug => array of `label`, `class`, `width`.
     */
    return (array) apply_filters( 'method/modal_sizes', $sizes );
}
