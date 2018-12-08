<?php

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
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: *');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
}, 15);
