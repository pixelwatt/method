<?php

//======================================================================
//
// BOOTSTRAP ACCORDION CLASS
//
// This class creates a Bootstrap accordion.
//
//======================================================================

class MethodBSAccordion {
    private $items = array();
    private $opts = array();

    function __construct() {
        $this->setOptions( array() );
    }

    public function setOptions( $args ) {
        $defaults = array(
            'id' => 'accordion',
            'class' => 'accordion',
            'alwaysOpen' => false,
            'headerTag' => 'h3',
        );
        $this->opts = wp_parse_args( $args, $defaults );
    }

    public function addItem($title, $content) {
        $this->items[] = array(
            'title' => $title,
            'content' => $content
        );
    }

    public function render() {
        $output = '';
        if ( 0 < count( $this->items ) ) {
            $output .= '<div id="' . $this->opts['id'] . '" class="' . $this->opts['class'] . '">';
            $i = 1;
            foreach ( $this->items as $item ) {
                $output .= '
                    <div class="accordion-item accordion-item-' . $i . '">
                        <' . $this->opts['headerTag'] . ' class="accordion-header" id="heading' . $i . '">
                            <button class="accordion-button' . ( 1 == $i ? '' : ' collapsed' ) . '" type="button" data-bs-toggle="collapse" data-bs-target="#collapse' . $i . '" aria-expanded="' . ( 1 == $i ? 'true' : 'false' ) . '" aria-controls="collapse' . $i . '">
                                ' . $item['title'] . '
                            </button>
                        </' . $this->opts['headerTag'] . '>
                        <div id="collapse' . $i . '" class="accordion-collapse collapse' . ( 1 == $i ? ' show' : '' ) . '" aria-labelledby="heading' . $i . '"' . ( ! $this->opts['alwaysOpen'] ? ' data-bs-parent="#' . $this->opts['id'] . '"' : '' ) . '>
                            <div class="accordion-body">
                                ' . $item['content'] . '
                            </div>
                        </div>
                    </div>
                ';
                $i++;
            }
            $output .= '</div>';
        }
        return $output;
    }

    private function filter_content( $content ) {
		if ( ! empty( $content ) ) {
			$content = apply_filters( 'the_content', $content );
		}
		return $content;
	}

}
