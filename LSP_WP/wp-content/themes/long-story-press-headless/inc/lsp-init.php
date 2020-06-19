<?php

function lsp_global_assets()
{
    return [
        "path" => ABSPATH . preg_replace(['/https?:\/\//', '/\..+?$/', '/:\d+?$/'], '', get_option('siteurl')) . '-assets',
        "url" => get_option('siteurl') . '/' . preg_replace(['/https?:\/\//', '/\..+?$/', '/:\d+?$/'], '', get_option('siteurl')) . '-assets',
        "content" => content_url(get_raw_theme_root(get_template()) . '/' . get_template()),
    ];
}
require_once __DIR__ . '/lsp-settings/lsp-edit-settings.php';
require_once __DIR__ . '/lsp-settings/lsp-render-settings.php';
require_once __DIR__ . '/lsp-settings/lsp-settings-endpoints.php';
require_once __DIR__ . '/lsp-rest/lsp-rest-utility.php';
require_once __DIR__ . '/lsp-rest/lsp-posts-controller.php';
require_once __DIR__ . '/lsp-rest/lsp-attachments-controller.php';
require_once __DIR__ . '/lsp-rest/lsp-rest-menus.php';
require_once __DIR__ . '/lsp-meta-box/lsp-meta-box.php';
require_once __DIR__ . '/lsp-tutorial-cpt.php';
require_once __DIR__ . '/lsp-gallery/lsp-gallery-cpt.php';
require_once __DIR__ . '/lsp-gallery/lsp-add-gallery.php';
require_once __DIR__ . '/lsp-add-preview-link-to-subpage.php';

add_action('init', function () {
    if (is_admin()) {
        new LSP_Render_Settings(lsp_global_assets()['content'] . '/assets');
    }
});

add_action('rest_api_init', function () {
    $namespace = 'lsp-api/v1';
    $post_types = array_unique(array_merge(array_values(get_post_types(['public' => true, '_builtin' => false])), ['page', 'post']));

    foreach ($post_types as $post_type) {
        $unprefix = explode("_", $post_type, 2);
        $name = array_pop($unprefix);
        $pluralized_name = substr($name, -1) == 'y'
            ? substr($name, 0, strlen($name) - 1) . 'ies'
            : $name . 's';
        $post_controller = new LSP_REST_Posts_Controller($post_type, $pluralized_name);
        $post_controller->register_routes();
        register_rest_field(
            $post_type,
            'lsp_gallery',
            [
                'get_callback' => 'lsp_gallery_rest_cb',
                'schema' => $post_controller->get_public_item_schema(),
            ]
        );
        register_rest_field(
            $post_type,
            'children',
            [
                'get_callback' => 'lsp_get_children_for_page',
                'schema' => $post_controller->get_public_item_schema(),
            ]
        );
        register_rest_field(
            $post_type,
            'price',
            [
                'get_callback' => 'lsp_get_price_for_product',
                'schema' => $post_controller->get_public_item_schema(),
            ]
        );
        register_rest_field(
            $post_type,
            'lsp_product_tags',
            [
                'get_callback' => 'lsp_get_tags_for_product',
                'schema' => $post_controller->get_public_item_schema()
            ]
        );
        register_rest_field(
            $post_type,
            'lsp_product_categories',
            [
                'get_callback' => 'lsp_get_categories_for_product',
                'schema' => $post_controller->get_public_item_schema()
            ]
        );
        register_rest_field(
            $post_type,
            'lsp_tags',
            [
                'get_callback' => 'lsp_get_tags_for_post',
                'schema' => $post_controller->get_public_item_schema()
            ]
        );
        register_rest_field(
            $post_type,
            'lsp_categories',
            [
                'get_callback' => 'lsp_get_categories_for_post',
                'schema' => $post_controller->get_public_item_schema()
            ]
        );
        add_filter('rest_' . $post_type . '_query', 'lsp_add_taxonomy_filters', 10, 2);
    }
    (new LSP_Settings_Endpoints())->add_routes();
    (new LSP_Attachments_Controller('attachment'))->register_routes();
    (new LSP_REST_Menus($namespace))->register_routes();
});

function lsp_add_taxonomy_filters($args, $request)
{
    global $wp;
    $vars = apply_filters('rest_query_vars', $wp->public_query_vars);
    $vars = array_unique(array_merge($vars, array('meta_query', 'meta_key', 'meta_value', 'meta_compare', 'lsp_tags', 'lsp_categories')));

    foreach ($vars as $var) {
        if (isset($request[$var])) {
            $args[$var] = $request[$var];
        }
    }
    return $args;
}

function lsp_load_global($hook)
{
    $lsp_global_ver  = date("ymd-Gis", filemtime(get_template_directory() . '/assets/lspGlobal.js'));
    wp_enqueue_style('lsp_colors', lsp_global_assets()['url'] . '/admin-colors.css', array(), $lsp_global_ver);
    wp_register_script('_$', 'https://unpkg.com/long-story-library/umd/long-story-library.min.js', null, null, true);
    wp_enqueue_script('_$');
}

add_action('admin_enqueue_scripts', 'lsp_load_global');

add_action('init', function () {
    if (!file_exists(lsp_global_assets()['path'])) {
        mkdir(lsp_global_assets()['path']);
    }
    if (!file_exists(lsp_global_assets()['path'] . '/colors.css')) {
        LSP_Edit_Settings::write_color_css();
    }
});
