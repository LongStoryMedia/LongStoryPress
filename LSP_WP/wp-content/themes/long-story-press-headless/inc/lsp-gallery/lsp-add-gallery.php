<?php

function lsp_match_gallery_shortcode()
{
    preg_match_all(
        '"' . get_shortcode_regex(['lsp-gallery']) . '"',
        get_the_content(),
        $matches
    );
    return $matches[0];
}

function lsp_json_parse_shortcode($attstostring)
{
    $parsed_sc = preg_replace_callback_array(
        [
            '/lsp-gallery\s/' => function ($match) {
                return str_replace('lsp-gallery ', '', $match[0]);
            },
            '/(\s|\+)/' => function ($match) {
                return preg_replace('/(\s|\=)/', ',', $match[0]);
            },
            '/:((,)?([^,;])?)*?;/' => function ($match) {
                return str_replace(',', ' ', $match[0]);
            },
            '/(\[|\])/' => function ($match) {
                return str_replace(['"', '[', ']'], '', $match[0]);
            },
        ],
        urldecode($attstostring)
    );
    $atts_arr = explode(",", $parsed_sc);
    $parsed_atts = array();
    foreach ($atts_arr as $sc) {
        parse_str($sc, $output);
        $parsed_atts[array_keys($output)[0]] = $output[array_keys($output)[0]];
    }
    return $parsed_atts;
}

function lsp_create_rest_response_from_gallery_shortcode($atts)
{
    global $post;
    register_rest_field(
        get_post_type($post),
        'lsp_galleries',
        [
            'get_callback' => function ($post) {
                $lsp_galleries = array();
                $defaults = [
                    'slug' => '',
                    'in-content' => false,
                    'in-background' => true,
                    'position' => 'top',
                ];
                $matches = lsp_match_gallery_shortcode();
                foreach ($matches as $shortcode) {
                    $sc = lsp_json_parse_shortcode($shortcode);
                    $atts_arr = array();
                    $this_gallery = get_posts([
                        'name' => $sc['slug'],
                        'post_type' => 'lsp_gallery',
                        'post_status' => 'publish',
                        'numberposts' => 1,
                    ]);
                    if ($this_gallery) {
                        $atts_arr['id'] = $this_gallery[0]->ID;
                        $atts_arr['gallery_images'] = lsp_gallery_rest_cb($this_gallery[0]);
                        $atts_arr['gallery_data'] = get_post_meta($this_gallery[0]->ID, 'lsp_gallery_settings', true);
                    }
                    $gallery_rest = array_merge($defaults, $atts_arr, $sc);
                    $lsp_galleries[] = $gallery_rest;
                }
                return $lsp_galleries;
            },
            'schema' => null,
        ]
    );
    return '<!--lsp_gallery:' . json_encode($atts) . '-->';
}

add_shortcode('lsp-gallery', 'lsp_create_rest_response_from_gallery_shortcode');
