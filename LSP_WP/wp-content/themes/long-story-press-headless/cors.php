<?php

add_filter('rest_url', function($url) {
    $url = str_replace(home_url(), site_url(), $url);
    return $url;
});

 add_action('send_headers', function () {
     if (!did_action('rest_api_init') && 'HEAD' === $_SERVER['REQUEST_METHOD']) {
         header('Access-Control-Allow-Origin: *');
         header('Access-Control-Expose-Headers: Link');
         header('Access-Control-Allow-Methods: HEAD');
     }
 });

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

    add_filter('rest_pre_serve_request', function ($value) {
        header( 'Access-Control-Allow-Headers: Authorization, X-WP-Nonce');
        header( 'Access-Control-Allow-Origin: *' );
        header( 'Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE' );
        header( 'Access-Control-Allow-Credentials: true' );
        return $value;
    });
}, 15);
