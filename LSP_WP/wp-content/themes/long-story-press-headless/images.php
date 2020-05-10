<?php
add_theme_support('post-thumbnails');

add_image_size('hd', 1900);
add_image_size('gallery_hd', 1900, 800, true);
add_image_size('gallery_large', 1024, 430, true);
add_image_size('gallery_medium', 768, 320, true);
add_image_size('gallery_small', 480, 200, true);
add_image_size('gallery_thumb', 300, 125, true);

remove_image_size("woocommerce_thumbnail");
remove_image_size("woocommerce_single");
remove_image_size("woocommerce_gallery_thumbnail");
remove_image_size("shop_catalog");
remove_image_size("shop_single");
remove_image_size("shop_thumbnail");

function lsp_custom_sizes($sizes)
{
    return array_merge($sizes, [
        'hd' => __('HD'),
        'gallery_hd' => __('gallery_hd'),
        'gallery_large' => __('gallery_large'),
        'gallery_medium' => __('gallery_medium'),
        'gallery_small' => __('gallery_small'),
        'gallery_thumb' => __('gallery_thumb'),
    ]);
}
add_filter('image_size_names_choose', 'lsp_custom_sizes');
