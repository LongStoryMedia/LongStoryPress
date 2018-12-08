<?php

add_action('rest_api_init', function () {
    $namespace = 'lsp-api/v1';
    (new LSP_Attachments_Controller('attachment'))->register_routes();
    $post_types = array_values(get_post_types(['public' => true, '_builtin' => false]));

    array_push($post_types, 'post', 'page');

    foreach ($post_types as $post_type) {
      $parsed_slug = explode("_", $post_type, 2);
      $slug = array_pop($parsed_slug).'s';
      (new LSP_Posts_Controller($post_type, $slug))->register_routes();
      register_rest_field(
        $post_type,
        'price',
        [
          'get_callback' => function ($post) {
            if(get_post_meta($post['id'], "_price", true) !== "") {
              return get_post_meta($post['id'], "_price", true);
            }
            return null;
          },
          'schema' => null,
        ]
      );
      register_rest_field(
          $post_type,
          'lsp_gallery',
          [
              'get_callback' => 'lsp_gallery_rest_cb',
              'schema' => null,
          ]
      );
    }
});
