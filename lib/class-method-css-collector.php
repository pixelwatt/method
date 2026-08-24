<?php
/**
 * Block CSS Collector
 * Collects CSS from block render callbacks and outputs a single consolidated <style> tag
 */
class Method_CSS_Collector {
    private static ?self $instance = null;
    private array $styles  = [];   // pending, keyed
    private array $flushed = [];   // already-printed keys => true
    private int $flush_count = 0;

    public static function instance(): self {
        return self::$instance ??= new self();
    }

    private function __construct() {
        // Primary flush in <head>; second flush catches anything
        // rendered during the template (nav panels, hooks, late blocks).
        add_action('wp_head',   [$this, 'output_styles'], 100);
        add_action('wp_footer', [$this, 'output_styles'], 20);
    }

    public function add(string $css, string $block_id = '', int $priority = 10): void {
        $key = $block_id ?: uniqid('block_css_');

        // Dedupe against pending AND already-printed styles.
        if ($block_id && (isset($this->styles[$key]) || isset($this->flushed[$key]))) {
            return;
        }

        $this->styles[$key] = [
            'css'      => trim($css),
            'priority' => $priority,
        ];
    }

    public function output_styles(): void {
        if (empty($this->styles)) {
            return;
        }

        uasort($this->styles, fn($a, $b) => $a['priority'] <=> $b['priority']);
        $combined = implode("\n\n", array_column($this->styles, 'css'));

        if (!defined('WP_DEBUG') || !WP_DEBUG) {
            $combined = $this->minify($combined);
        }

        $id = 'block-instance-styles' . ($this->flush_count ? '-' . $this->flush_count : '');
        echo '<style id="' . esc_attr($id) . '">' . "\n" . $combined . "\n</style>\n";

        // Move pending -> flushed; later add() calls start a fresh batch.
        foreach (array_keys($this->styles) as $key) {
            $this->flushed[$key] = true;
        }
        $this->styles = [];
        $this->flush_count++;
    }

    /* ---- Cache-integration primitives ---- */

    /** Marker for "what's been collected so far". */
    public function snapshot(): array {
        return array_merge(array_keys($this->flushed), array_keys($this->styles));
    }

    /** Everything collected since a snapshot — store this beside cached markup. */
    public function diff_since(array $snapshot_keys): array {
        $known = array_flip($snapshot_keys);
        $diff  = [];
        foreach ($this->styles as $key => $entry) {
            if (!isset($known[$key])) {
                $diff[$key] = $entry;
            }
        }
        return $diff;
    }

    /** Re-add previously captured CSS (cache hit path). Dedupe applies. */
    public function inject(array $entries): void {
        foreach ($entries as $key => $entry) {
            if (isset($this->styles[$key]) || isset($this->flushed[$key])) {
                continue;
            }
            $this->styles[$key] = $entry;
        }
    }

    private function minify(string $css): string {
        $css = preg_replace('/\/\*[^*]*\*+([^\/][^*]*\*+)*\//', '', $css);
        $css = preg_replace('/\s+/', ' ', $css);
        $css = preg_replace('/\s*([\{\};:,>~])\s*/', '$1', $css);
        return trim($css);
    }
}

// Helper function for easy access in render callbacks
function method_collect_css(string $css, string $block_id = '', int $priority = 10): void {
    Method_CSS_Collector::instance()->add($css, $block_id, $priority);
}