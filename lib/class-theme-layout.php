<?php

//======================================================================
// THEME LAYOUT CLASS
//======================================================================


class MethodThemeLayout extends Method_Layout {

	protected function set_opts() {
		$this->opts = get_option( 'method_options' );
	}

	protected function determine_attributes() {
		global $wp_query;
		if ( true == $this->attr['is_archive'] ) {
			switch ( $this->attr['post_type'] ) {
				case 'post':
					$this->attr['components'] = array( 'activated' );
					break;
			}
		} else {
			switch ( $this->attr['post_type'] ) {
				case 'page':
					if ( $this->attr['is_front'] ) {
						$this->attr['components'] = array( 'activated' );
					} else {
						$template = get_page_template_slug( $this->id );
						switch ( $template ) {
							case 'templates/page-template-custom.php':
								$this->attr['components'] = array( 'activated' );
								break;
							default:
								$this->attr['components'] = array( 'activated' );
								break;
						}
					}
					break;
				case 'post':
					$this->attr['components'] = array( 'activated' );
					break;
				default:
					break;
			}
		}
		return;
	}

	protected function build_header() {
		$this->scripts .= '

		';
		$this->html .= '
		
		';
		return;
	}

	protected function build_footer() {
		$this->html .= '
		
		';
		return;
	}

	protected function build_components() {
		if ( true == $this->attr['is_archive'] ) {
			global $wp_query;
		}
		foreach ( $this->attr['components'] as $component ) {
			switch ( $component ) {
				case 'activated':
					// Placeholder element. Should be removed from production theme.
					$this->html .= '
						<div class="error404">
							<div class="container-fluid">
								<div class="row justify-content-center align-items-center">
									<div class="col-12 col-sm-8 col-md-5 col-lg-4">
										<div class="error404-content text-center">
											<h1>Epic!</h1>
											<br>
											<h2>You\'re Up &amp Running.</h2>
											<p>This site is now running a build of Method.</p>
											<a href="https://github.com/pixelwatt/method" target="_blank" class="btn btn-lg btn-primary m-auto">Method on GitHub</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					';
					break;
				default:
					break;
			}
		}
		return;
	}

	/*
	Usage for archive pages:
	get_header();
	$layout = new MethodThemeLayout;
	echo $layout->build_page( '', true );
	get_footer();

	Usage for single pages:
	get_header();
	$layout = new MethodThemeLayout;
	echo $layout->build_page( $post->ID );
	get_footer();

	*/
}
