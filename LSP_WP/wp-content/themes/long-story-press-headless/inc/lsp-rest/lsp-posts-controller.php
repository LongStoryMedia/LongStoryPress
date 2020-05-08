<?php

class LSP_Posts_Controller extends WP_REST_Posts_Controller {

  /**
   * The namespace.
   *
   * @var string
   */
  protected $namespace;

	/**
	 * Post type.
	 *
	 * @var string
	 */
	protected $post_type;

  /**
     * Rest base for the current object.
     *
     * @var string
     */
  protected $rest_base;

	/**
	 * Constructor.
	 *
	 * @since 4.7.0
	 *
	 * @param string $post_type Post type.
	 */
	public function __construct( $post_type, $rest_base = null ) {
		$this->post_type = $post_type;
		$this->namespace = 'lsp-api/v1';
		$obj = get_post_type_object( $post_type );
    if((bool) $rest_base) {
      $this->rest_base = $rest_base;
    } elseif (! empty( $obj->rest_base )) {
      $this->rest_base = $obj->rest_base;
    } else {
      $this->rest_base = $obj->name;
    }
		$this->meta = new WP_REST_Post_Meta_Fields( $this->post_type );
	}
}
