<?php

if (!defined('ABSPATH')) {
    exit;
}

function lsp_tutorial_post_type()
{
    $labels = [
        'name' => _x('Tutorials', 'Tutorials Name', 'lsp'),
        'singular_name' => _x('Tutorial', 'tutorial name', 'lsp'),
        'menu_name' => _x('Tutorials', 'admin menu', 'lsp'),
        'add_new' => _x('Add Tutorial', 'tutorial', 'lsp'),
        'all_items' => __('Tutorials', 'lsp'),
        'add_new_item' => __('Add Tutorial', 'lsp'),
        'edit_item' => __('Edit Tutorial', 'lsp'),
        'new_item' => __('New Tutorial', 'lsp'),
        'view_item' => __('view tutorial', 'lsp'),
        'search_items' => __('Search Tutorials', 'lsp'),
        'not_found' => __('Tutorial not found', 'lsp'),
        'not_found_in_trash' => __('No tutorials found in trash', 'lsp'),
      ];
    $args = [
        'labels' => $labels,
        'public' => true,
        'show_in_rest' => true,
        'has_archive' => true,
        'publicly_queryable' => true,
        'query_var' => true,
        'rewrite' => true,
        'capability_type' => 'post',
        'menu_icon' => 'dashicons-welcome-learn-more',
        'hierarchical' => false,
        'supports' => [ 'title', 'editor', 'excerpt', 'thumbnail', ],
        'taxonomies' => ['category', 'post_tag'], // add default post categories and tags
        'menu_position' => 5,
        'exclude_from_search' => false,
        'rewrite' => ['slug' => 'tutorials'],
      ];
    register_post_type('lsp_tutorial', $args);
    register_taxonomy(
          'lsp_tutorial_category',
          'tutorial',
          [
          'hierarchical' => true,
          'labels' => [
            'name' => 'tutorial category',
            'singular_name' => 'tutorial category',
          ],
        ]
      );
    register_taxonomy(
          'tutorial_tag',
          'tutorial',
          [
          'hierarchical' => false,
          'labels' => [
            'name' => 'tutorial tag',
            'singular_name' => 'tutorial tag',
          ],
        ]
      );
}
add_action('init', 'lsp_tutorial_post_type');
