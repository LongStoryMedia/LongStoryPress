<?php
// Logging functions
require_once 'inc/log.php';
// CORS handling
require_once 'inc/cors.php';
require_once 'inc/lsp-rest/lsp-rest-utility.php';
require_once 'inc/lsp-rest/lsp-posts-controller.php';
require_once 'inc/lsp-rest/lsp-attachments-controller.php';
require_once 'inc/lsp-meta-box/lsp-meta-box.php';

require_once 'inc/lsp-tutorial-cpt.php';
require_once 'inc/lsp-sliders/lsp-slider-cpt.php';
require_once 'inc/lsp-sliders/pages-slider-metabox.php';
require_once 'inc/lsp-sliders/lsp-add-slider.php';
// Admin modifications
require_once 'inc/admin.php';
// Add Menus
require_once 'inc/admin-colors.php';
require_once 'inc/menus.php';
// Add custom API endpoints
require_once 'inc/lsp-rest/lsp-default-rest-routes.php';
// require_once 'inc/lsp-sliders/lsp-slider-endpoints.php';
require_once 'inc/lsp-settings/lsp-settings-init.php';
require_once 'inc/images.php';

function lsp_load_global($hook) {
    $lsp_global_ver  = date("ymd-Gis", filemtime( __DIR__ . '/assets/lspGlobal.js' ));
    wp_enqueue_script( 'L$', content_url(get_raw_theme_root(get_template()).'/'.get_template().'/assets/lspGlobal.js'), array(), $lsp_global_ver );
}
add_action('admin_enqueue_scripts', 'lsp_load_global');
