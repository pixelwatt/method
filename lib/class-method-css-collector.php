<?php
/**
 * Block CSS Collector
 * Collects CSS from block render callbacks and outputs a single consolidated <style> tag
 */
class Method_CSS_Collector {
    private static ?self $instance = null;
    private array $styles = [];
    private bool $has_output = false;

    public static function instance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Output collected styles in footer (after all blocks have rendered)
        add_action('wp_head', [$this, 'output_styles'], 100);
    }

    /**
     * Add CSS from a block render callback
     * 
     * @param string $css       The CSS rules (without <style> tags)
     * @param string $block_id  Optional unique identifier to prevent duplicates
     * @param int    $priority  Lower numbers output first (useful for parent/child ordering)
     */
    public function add(string $css, string $block_id = '', int $priority = 10): void {
        // Skip if we've already output (late additions won't work)
        if ($this->has_output) {
            return;
        }

        // Prevent duplicate registrations for the same block instance
        if ($block_id && isset($this->styles[$block_id])) {
            return;
        }

        $key = $block_id ?: uniqid('block_css_');
        $this->styles[$key] = [
            'css' => trim($css),
            'priority' => $priority,
        ];
    }

    public function output_styles(): void {
        if (empty($this->styles)) {
            return;
        }

        // Sort by priority
        uasort($this->styles, fn($a, $b) => $a['priority'] <=> $b['priority']);

        $combined = implode("\n\n", array_column($this->styles, 'css'));
        
        // Optional: minify in production
        if (!defined('WP_DEBUG') || !WP_DEBUG) {
            $combined = $this->minify($combined);
        }

        echo '<style id="block-instance-styles">' . "\n" . $combined . "\n</style>\n";
        
        $this->has_output = true;
    }

    private function minify(string $css): string {
        $css = preg_replace('/\/\*[^*]*\*+([^\/][^*]*\*+)*\//', '', $css);
        $css = preg_replace('/\s+/', ' ', $css);
        $css = preg_replace('/\s*([\{\};:,>~+])\s*/', '$1', $css);
        return trim($css);
    }
}

// Helper function for easy access in render callbacks
function method_collect_css(string $css, string $block_id = '', int $priority = 10): void {
    Method_CSS_Collector::instance()->add($css, $block_id, $priority);
}