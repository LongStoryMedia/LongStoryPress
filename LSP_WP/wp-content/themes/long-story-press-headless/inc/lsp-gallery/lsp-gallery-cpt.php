<?php

if (!defined('ABSPATH')) {
    exit;
}

function lsp_gallery_post_type()
{

    $labels = [
        'name' => _x('Gallerys', 'Gallerys name', 'lsp'),
        'singular_name' => _x('Gallery', 'Gallery name', 'lsp'),
        'menu_name' => _x('Gallerys', 'admin menu', 'lsp'),
        'add_new' => _x('Add Gallery', 'Gallery', 'lsp'),
        'all_items' => __('Gallerys', 'lsp'),
        'add_new_item' => __('Add Gallery', 'lsp'),
        'edit_item' => __('Edit Gallery', 'lsp'),
        'new_item' => __('New Gallery', 'lsp'),
        'view_item' => __('View Gallery', 'lsp'),
        'search_items' => __('Search Gallerys', 'lsp'),
        'not_found' => __('Gallery Not Found', 'lsp'),
        'not_found_in_trash' => __('No galleries found in trash', 'lsp'),
      ];
    $args = [
        'labels' => $labels,
        'description' => __( 'Data input for galleries. Select from available galleries within any post (or page) edit screen and indicate where it should be placed', 'lsp' ),
        'public' => true,
        'show_in_rest' => true,
        'has_archive' => true,
        'publicly_queryable' => true,
        'menu_icon' => 'dashicons-images-alt2',
        'query_var' => true,
        'capability_type' => 'post',
        'hierarchical' => false,
        'supports' => ['title'],
        'menu_position' => 5,
        'exclude_from_search' => false,
        'rewrite' => ['slug' => 'galleries'],
      ];
    register_post_type('lsp_gallery', $args);
    register_taxonomy(
          'lsp_gallery_category',
          'gallery',
          [
          'hierarchical' => true,
          'labels' => [
            'name' => 'gallery category',
            'singular_name' => 'gallery category',
          ],
        ]
      );
    register_taxonomy(
          'gallery_tag',
          'gallery',
          [
          'hierarchical' => false,
          'labels' => [
            'name' => 'gallery tag',
            'singular_name' => 'gallery tag',
          ],
        ]
      );
}
add_action('init', 'lsp_gallery_post_type');
require_once __DIR__.'/lsp-gallery-config.php';
