<?php

if (!defined('ABSPATH')) {
    exit;
}

function lsp_slider_post_type()
{
    $labels = [
        'name' => _x('sliders', 'sliders name', 'lsp'),
        'singular_name' => _x('slider', 'slider name', 'lsp'),
        'menu_name' => _x('Sliders', 'admin menu', 'lsp'),
        'add_new' => _x('add slider', 'slider', 'lsp'),
        'all_items' => __('sliders', 'lsp'),
        'add_new_item' => __('add slider', 'lsp'),
        'edit_item' => __('edit slider', 'lsp'),
        'new_item' => __('new slider', 'lsp'),
        'view_item' => __('view slider', 'lsp'),
        'search_items' => __('search sliders', 'lsp'),
        'not_found' => __('slider not found', 'lsp'),
        'not_found_in_trash' => __('No sliders found in trash', 'lsp'),
      ];
    $args = [
        'labels' => $labels,
        'public' => true,
        'show_in_rest' => true,
        'has_archive' => true,
        'publicly_queryable' => true,
        'show_in_nav_menus' => false,
        'menu_icon' => 'dashicons-images-alt2',
        'query_var' => true,
        'rewrite' => true,
        // 'capability_type' => ['slider', 'sliders'],
        'hierarchical' => true,
        'supports' => [
          'title',
          // 'editor',
          // 'excerpt',
          // 'thumbnail',
          // 'author',
          // 'trackbacks',
          // 'custom-fields',
          // 'comments',
          // 'revisions',
          'page-attributes', // (menu order, hierarchical must be true to show Parent option)
          // 'post-formats',
        ],
        'taxonomies' => ['category', 'post_tag'], // add default post categories and tags
        'menu_position' => 5,
        'exclude_from_search' => false,
        'rewrite' => ['slug' => 'sliders'],
        'rest_base' => 'sliders',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        // 'register_meta_box_cb' => 'add_all_the_stuff_to_edit_screen',
      ];
    register_post_type('lsp_slider', $args);
    flush_rewrite_rules();
    register_taxonomy(
          'lsp_slider_category',
          'slider',
          [
          'hierarchical' => true,
          'labels' => [
            'name' => 'slider category',
            'singular_name' => 'slider category',
          ],
        ]
      );
    register_taxonomy(
          'slider_tag',
          'slider',
          [
          'hierarchical' => false,
          'labels' => [
            'name' => 'slider tag',
            'singular_name' => 'slider tag',
          ],
        ]
      );
}
add_action('init', 'lsp_slider_post_type');
