<?php

if (!defined('ABSPATH')) {
    exit;
}

function lsp_slider_post_type()
{

    $labels = [
        'name' => _x('Sliders', 'Sliders name', 'lsp'),
        'singular_name' => _x('Slider', 'Slider name', 'lsp'),
        'menu_name' => _x('Sliders', 'admin menu', 'lsp'),
        'add_new' => _x('Add Slider', 'Slider', 'lsp'),
        'all_items' => __('Sliders', 'lsp'),
        'add_new_item' => __('Add Slider', 'lsp'),
        'edit_item' => __('Edit Slider', 'lsp'),
        'new_item' => __('New Slider', 'lsp'),
        'view_item' => __('View Slider', 'lsp'),
        'search_items' => __('Search Sliders', 'lsp'),
        'not_found' => __('Slider Not Found', 'lsp'),
        'not_found_in_trash' => __('No sliders found in trash', 'lsp'),
      ];
    $args = [
        'labels' => $labels,
        'description' => __( 'Data input for sliders. Select from available sliders within any post (or page) edit screen and indicate where it should be placed', 'lsp' ),
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
        'rewrite' => ['slug' => 'sliders'],
      ];
    register_post_type('lsp_slider', $args);
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
require_once __DIR__.'/lsp-slider-config.php';
