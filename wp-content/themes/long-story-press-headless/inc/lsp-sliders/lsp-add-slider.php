<?php

function lsp_add_slider_shortcode($atts)
{
    global $post;
    register_rest_field(
        get_post_type($post),
        'lsp_sliders',
        [
            'get_callback' => function ($post) {
                preg_match_all(
                  '"'.get_shortcode_regex(['lsp-slider']).'"',
                  get_the_content(),
                  $matches
                );
                $lsp_sliders = array();
                $defaults = [
                  'slug' => '',
                  'in-content' => false,
                  'in-background' => true,
                  'position' => 'top',
                ];
                foreach ($matches[0] as $sc) {
                    $parsed_sc = str_replace(['lsp-slider ', ' ', '[', ']', '"'], ['', ','], $sc);
                    $str_vars = explode(",", $parsed_sc);
                    $atts_arr = array();
                    foreach ($str_vars as $key => $value) {
                        parse_str($value, $atts);
                        foreach ($atts as $key => $value) {
                            $atts_arr[$key] = $value;
                        }
                    }
                    $this_slider = get_posts([
                      'name' => $atts_arr['slug'],
                      'post_type' => 'lsp_slider',
                      'post_status' => 'publish',
                      'numberposts' => 1
                    ]);
                    if ($this_slider) {
                        $atts_arr['id'] = $this_slider[0]->ID;
                        $atts_arr['slider_gallery'] = lsp_gallery_rest_cb($this_slider[0]);
                    }
                    $slider_rest = array_merge($defaults, $atts_arr);
                    $lsp_sliders[] = $slider_rest;
                }
                return $lsp_sliders;
            },
            'schema' => null,
        ]
    );
    return;
}

add_shortcode('lsp-slider', 'lsp_add_slider_shortcode');
