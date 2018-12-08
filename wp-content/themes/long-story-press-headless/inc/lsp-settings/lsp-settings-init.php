<?php

require_once __DIR__.'/lsp-edit-settings.php';
require_once __DIR__.'/lsp-render-settings.php';
require_once __DIR__.'/lsp-settings-endpoints.php';

add_action('init', function () {
    $assets_url = site_url('wp-content/themes/long-story-press-headless/assets');
    //Setup menu
    if (is_admin()) {
        new LSP_Render_Settings($assets_url);
    }
    $endpoints = new LSP_Settings_Endpoints();
    //Setup REST API
    $endpoints->add_routes();
});
