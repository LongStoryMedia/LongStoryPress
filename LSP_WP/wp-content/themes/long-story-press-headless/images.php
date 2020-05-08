<?php
add_theme_support('post-thumbnails');

add_image_size('hd', 1900);
add_image_size('slider_hd', 1900, 800, true);
add_image_size('slider_large', 1024, 430, true);
add_image_size('slider_medium', 768, 320, true);
add_image_size('slider_small', 480, 200, true);
add_image_size('slider_thumb', 300, 125, true);

remove_image_size("woocommerce_thumbnail");
remove_image_size("woocommerce_single");
remove_image_size("woocommerce_gallery_thumbnail");
remove_image_size("shop_catalog");
remove_image_size("shop_single");
remove_image_size("shop_thumbnail");

function lsm_custom_sizes($sizes)
{
    return array_merge($sizes, [
        'hd' => __('HD'),
        'slider_hd' => __('slider_hd'),
        'slider_large' => __('slider_large'),
        'slider_medium' => __('slider_medium'),
        'slider_small' => __('slider_small'),
        'slider_thumb' => __('slider_thumb'),
    ]);
}
add_filter('image_size_names_choose', 'lsm_custom_sizes');
