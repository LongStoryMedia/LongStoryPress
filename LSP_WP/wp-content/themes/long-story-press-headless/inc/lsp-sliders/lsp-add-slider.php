<?php

function lsp_match_slider_shortcode()
{
    preg_match_all(
    '"'.get_shortcode_regex(['lsp-slider']).'"',
    get_the_content(),
    $matches
  );
    return $matches[0];
}

function lsp_json_parse_shortcode($attstostring)
{
    $parsed_sc = preg_replace_callback_array([
        '/&\D/' => function ($match) {
            return str_replace('&', ',', $match[0]);
        },
        '/&\d=/' => function ($match) {
            return preg_replace('/&\d=/', ' ', $match[0]);
        },
        '/lsp-slider\s/' => function ($match) {
            return str_replace('lsp-slider ', '', $match[0]);
        },
        '/\s/' => function ($match) {
            return str_replace(' ', ',', $match[0]);
        },
        '/:((,)?([^,;])?)*?;/' => function ($match) {
            return str_replace(',', ' ', $match[0]);
        },
        // '/=/' => function ($match) {
        //     return str_replace('=', '":"', $match[0]);
        // },
        '/(\[|\])/' => function ($match) {
            return str_replace(['"', '[', ']'], '', $match[0]);
        },
        // '/(style=)(.*?)(,|\w=|$)/' => function ($match) {
            // return preg_replace(['/(style=)(.*?)(,|\w=|$)/'], ['$1{$2}$3'], $match[0]);
        // },
        // '/(.)$/' => function ($match) {
        //     return preg_replace('/(.)$/', '$1"}', $match[0]);
        // },
      ],
      rawurldecode($attstostring)
    );
    // log_console("parsed_sc", $parsed_sc);
    $atts_arr = explode(",", $parsed_sc);
    // log_console("atts_arr", $atts_arr);
    $parsed_atts = array();
    foreach ($atts_arr as $sc) {
        $styles = array();
        parse_str($sc, $output);
        if(array_keys($output)[0] === "style") {
            // log_console("style?", $output[array_keys($output)[0]]);
            $val = preg_replace(['/;/', '/,$/', '/:\s?/'], [',', '', '='], $output[array_keys($output)[0]]);
            $style_arr = explode(",", $val);
            foreach ($style_arr as $style) {
                parse_str($style, $out);
                $styles[array_keys($out)[0]] = $out[array_keys($out)[0]];
            }
            // log_console("val?", $val);
        }
        // log_console("styles", $styles);
        $parsed_atts[array_keys($output)[0]] = $output[array_keys($output)[0]];
        $parsed_atts["style"] = (object)$styles;
    }
    // log_console("parsed_atts", $parsed_atts);
    return $parsed_atts;
}

function lsp_create_rest_response_from_slider_shortcode($atts)
{
    global $post;
    register_rest_field(
        get_post_type($post),
        'lsp_sliders',
        [
            'get_callback' => function ($post) {
                $lsp_sliders = array();
                $defaults = [
                  'slug' => '',
                  'in-content' => false,
                  'in-background' => true,
                  'position' => 'top',
                ];
                $matches = lsp_match_slider_shortcode();
                foreach ($matches as $shortcode) {
                    $sc = lsp_json_parse_shortcode($shortcode);
                    // log_console("sc", $sc);
                    $atts_arr = array();
                    $this_slider = get_posts([
                      'name' => $sc['slug'],
                      'post_type' => 'lsp_slider',
                      'post_status' => 'publish',
                      'numberposts' => 1,
                    ]);
                    if ($this_slider) {
                        $atts_arr['id'] = $this_slider[0]->ID;
                        $atts_arr['slider_gallery'] = lsp_gallery_rest_cb($this_slider[0]);
                        $atts_arr['slider_data'] = get_post_meta($this_slider[0]->ID, 'lsp_slider_settings', true);
                    }
                    $slider_rest = array_merge($defaults, $atts_arr, $sc);
                        // log_
                    $lsp_sliders[] = $slider_rest;
                    // log_console("lsp_sliders", $lsp_sliders);
                }
                return $lsp_sliders;
            },
            'schema' => null,
        ]
    );
    // log_console("comment", json_encode(lsp_json_parse_shortcode(http_build_query($atts))));
    return '<!--lsp_slider:'.json_encode(lsp_json_parse_shortcode(http_build_query($atts))).'-->';
}

add_shortcode('lsp-slider', 'lsp_create_rest_response_from_slider_shortcode');
