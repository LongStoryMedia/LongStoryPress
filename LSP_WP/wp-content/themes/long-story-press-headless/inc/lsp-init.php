<?php

function lsp_global_assets()
{
    return [
    "path" => ABSPATH.preg_replace(['/https?:\/\//', '/\..+?$/', '/:\d+?$/'], '', get_option('siteurl')).'-assets',
    "url" => get_option('siteurl').'/'.preg_replace(['/https?:\/\//', '/\..+?$/', '/:\d+?$/'], '', get_option('siteurl')).'-assets',
    "content" => content_url(get_raw_theme_root(get_template()).'/'.get_template()),
  ];
}
require_once __DIR__.'/lsp-settings/lsp-edit-settings.php';
require_once __DIR__.'/lsp-settings/lsp-render-settings.php';
require_once __DIR__.'/lsp-settings/lsp-settings-endpoints.php';
require_once __DIR__.'/lsp-rest/lsp-rest-utility.php';
require_once __DIR__.'/lsp-rest/lsp-posts-controller.php';
require_once __DIR__.'/lsp-rest/lsp-attachments-controller.php';
require_once __DIR__.'/lsp-rest/lsp-rest-menus.php';
require_once __DIR__.'/lsp-meta-box/lsp-meta-box.php';
require_once __DIR__.'/lsp-tutorial-cpt.php';
require_once __DIR__.'/lsp-gallerys/lsp-gallery-cpt.php';
require_once __DIR__.'/lsp-gallerys/lsp-add-gallery.php';
require_once __DIR__.'/lsp-add-preview-link-to-subpage.php';

add_action('init', function () {
    if (is_admin()) {
        new LSP_Render_Settings(lsp_global_assets()['content'].'/assets');
    }
});

add_action('rest_api_init', function () {
    $namespace = 'lsp-api/v1';
    $post_types = array_values(get_post_types(['public' => true, '_builtin' => false]));

    array_push($post_types, 'post', 'page');

    foreach ($post_types as $post_type) {
        $unprefix = explode("_", $post_type, 2);
        $pluralize = array_pop($unprefix).'s';
        (new LSP_Posts_Controller($post_type, $pluralize))->register_routes();
        register_rest_field(
        $post_type,
        'price',
        [
          'get_callback' => 'lsp_get_price_for_product',
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
        register_rest_field(
          $post_type,
          'children',
          [
              'get_callback' => 'lsp_get_children_for_page',
              'schema' => null,
          ]
      );
    }
    (new LSP_Settings_Endpoints())->add_routes();
    (new LSP_Attachments_Controller('attachment'))->register_routes();
    (new LSP_REST_Menus($namespace))->register_routes();
});

function lsp_load_global($hook)
{
    $lsp_global_ver  = date("ymd-Gis", filemtime(get_template_directory().'/assets/lspGlobal.js'));
    wp_enqueue_style('lsp_colors', lsp_global_assets()['url'].'/admin-colors.css', array(), $lsp_global_ver);
    wp_enqueue_script('L$', lsp_global_assets()['content'].'/assets/lspGlobal.js', array(), $lsp_global_ver);
}

add_action('admin_enqueue_scripts', 'lsp_load_global');

add_action('init', function () {
    if (!file_exists(lsp_global_assets()['path'])) {
        mkdir(lsp_global_assets()['path']);
    }
    if (!file_exists(lsp_global_assets()['path'].'/colors.css')) {
        LSP_Edit_Settings::write_color_css();
    }
});
