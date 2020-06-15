<?php

function lsp_recursive_meta_search($search, $fields, $post_id)
{
    foreach ($fields as $key => $value) {
        $post_meta = get_post_meta($post_id, $key, true);
        if (strpos($key, $search)) {
            return $value;
        } elseif (is_array($post_meta)) {
            $dig = lsp_recursive_meta_search($search, $post_meta, $post_id);
            if (!is_null($dig)) {
                return $dig;
            }
        }
    }
}

function lsp_filter_NAN($val)
{
    return ((string) $val != "" && (int) $val != 0);
}

function lsp_map_filter_values($cb, $arr, $filter = true)
{
    if (!$filter) {
        return array_values(
            array_filter(
                array_map($cb, $arr, array_keys($arr)),
                function ($val) {
                    return $val !== null;
                }
            )
        );
    }
    return array_values(
        array_filter(
            array_map($cb, $arr, array_keys($arr))
        )
    );
}

function lsp_gallery_rest_cb($post)
{
    $post_id = is_array($post) ? $post['id'] : $post->ID;
    $gallery_found = lsp_recursive_meta_search('gallery', get_post_meta($post_id), $post_id);
    $the_gallery = (bool) $gallery_found ? $gallery_found : "";
    $gal_ids = is_array($the_gallery) ? explode(",", $the_gallery[0]) : explode(",", $the_gallery);
    $ids = array_filter($gal_ids, "lsp_filter_NAN");
    $thumbID = get_post_meta($post_id, "_thumbnail_id", true);
    if ((bool) $thumbID) {
        array_unshift($ids, $thumbID);
    }
    $gallery = array();
    $captions = lsp_map_filter_values(
        function ($val, $i) {
            if ($i % 4 === 1 || $i === 1) {
                return $val;
            } else {
                return "";
            }
        },
        $gal_ids,
        false
    );
    $links = lsp_map_filter_values(
        function ($val, $i) {
            if ($i % 4 === 2 || $i === 2) {
                return $val;
            } else {
                return "";
            }
        },
        $gal_ids,
        false
    );
    $targets = lsp_map_filter_values(
        function ($val, $i) {
            if ($i % 4 === 3 || $i === 3) {
                return $val;
            } else {
                return "";
            }
        },
        $gal_ids,
        false
    );
    if (array_sum($ids) > 0) {
        foreach (array_values($ids) as $key => $img_id) {
            $attachment_post = get_post($img_id);
            if (is_null($attachment_post)) {
                continue;
            }

            $attachment = wp_get_attachment_image_src($img_id, 'full');
            if (!is_array($attachment)) {
                continue;
            }
            $gallery[] = array(
                'id'                => (int) $img_id,
                'src'               => current($attachment),
                'name'              => get_the_title($img_id),
                'alt'               => get_post_meta($img_id, '_wp_attachment_image_alt', true),
                'media_details'     => wp_get_attachment_metadata($img_id),
                'mime_type'         => get_post_mime_type($img_id),
                'target'            => $targets[$key],
                'caption'           => $captions[$key],
                'link'              => $links[$key],
                'srcset'            => wp_get_attachment_image_srcset((int) $img_id, 'hd'),
                'sizes_vw'          => str_replace(" 100vw,", "", implode(",", [
                    wp_get_attachment_image_sizes((int) $img_id),
                    wp_get_attachment_image_sizes((int) $img_id, 'medium_large'),
                    wp_get_attachment_image_sizes((int) $img_id, 'large'),
                    "1900px"
                ])),
                'sizes'             => str_replace(" 100vw,", "", implode(",", [
                    wp_get_attachment_image_sizes((int) $img_id),
                    wp_get_attachment_image_sizes((int) $img_id, 'medium_large'),
                    "1024px"
                ])),
                'sizes_sm'          => str_replace(" 100vw,", "", implode(",", [
                    preg_replace('/300px$/', '150px', wp_get_attachment_image_sizes((int) $img_id, 'thumbnail')),
                    preg_replace('/768px$/', '300px', wp_get_attachment_image_sizes((int) $img_id)),
                    "768px"
                ])),
            );

            if (empty($gallery[$key]['media_details'])) {
                $gallery['media_details'] = new stdClass;
            } elseif (!empty($gallery[$key]['media_details']['sizes'])) {
                foreach ($gallery[$key]['media_details']['sizes'] as $size => &$size_data) {
                    if (isset($size_data['mime-type'])) {
                        $size_data['mime_type'] = $size_data['mime-type'];
                        unset($size_data['mime-type']);
                    }

                    $image_src = wp_get_attachment_image_src($img_id, $size);
                    if (!$image_src) {
                        continue;
                    }

                    $size_data['source_url'] = $image_src[0];
                }


                if (!empty($attachment)) {
                    $gallery[$key]['media_details']['sizes']['full'] = array(
                        'file'       => wp_basename($attachment[0]),
                        'width'      => $attachment[1],
                        'height'     => $attachment[2],
                        'mime_type'  => get_post_mime_type($post_id),
                        'source_url' => $attachment[0],
                    );
                }
            } else {
                $gallery[$key]['media_details']['sizes'] = new stdClass;
            }
        }
    }
    return $gallery;
}

function lsp_get_children_for_page($post)
{
    $post_id = is_array($post) ? $post['id'] : $post->ID;
    $post_link = is_array($post) ? $post['link'] : $post->link;
    $children = get_posts([
        'post_type' => 'any',
        'post_parent' => $post_id
    ]);
    $res = array();
    foreach ($children as $child) {
        $subsection = get_post_meta($child->ID, 'lsp_subsection', true);
        $child_sub = (bool) $subsection ? [
            'subsection' => (bool) $subsection['subsection'],
            'link_to' => $subsection['link_to']
        ] : false;
        $res[] = [
            'id' => $child->ID,
            'slug' => $child->post_name,
            'title' => $child->post_title,
            'content' => $child->post_content,
            'excerpt' => $child->post_excerpt,
            'featured_media' => (int) get_post_thumbnail_id($child),
            'lsp_gallery' => lsp_gallery_rest_cb($child),
            'children' => lsp_get_children_for_page($child),
            'price' => lsp_get_price_for_product($child),
            'link' => $post_link . $child->post_name,
            'lsp_subsection' => $child_sub
        ];
    }
    return $res;
}

function lsp_get_price_for_product($post)
{
    $post_id = is_array($post) ? $post['id'] : $post->ID;
    if (get_post_meta($post_id, "_price", true) !== "") {
        return get_post_meta($post_id, "_price", true);
    }
    return false;
}

function lsp_get_tags_for_product($post)
{
    $post_id = is_array($post) ? $post['id'] : $post->ID;
    $terms = get_the_terms($post_id, 'product_tag');

    $tags = array();
    if (!empty($terms) && !is_wp_error($terms)) {
        foreach ($terms as $term) {
            $tags[] = [
                'slug' => $term->slug,
                'id' => $term->term_id
            ];
        }
    }
    return $tags;
}

function lsp_get_tags_for_post($post)
{
    $post_id = is_array($post) ? $post['id'] : $post->ID;
    $terms = get_the_terms($post_id, 'post_tag');

    $tags = array();
    if (!empty($terms) && !is_wp_error($terms)) {
        foreach ($terms as $term) {
            $tags[] = [
                'slug' => $term->slug,
                'id' => $term->term_id
            ];
        }
    }
    return $tags;
}

function lsp_get_categories_for_product($post)
{
    $post_id = is_array($post) ? $post['id'] : $post->ID;
    $terms = get_the_terms($post_id, 'product_cat');

    $tags = array();
    if (!empty($terms) && !is_wp_error($terms)) {
        foreach ($terms as $term) {
            $tags[] = [
                'slug' => $term->slug,
                'id' => $term->term_id
            ];
        }
    }
    return $tags;
}

function lsp_get_categories_for_post($post)
{
    $post_id = is_array($post) ? $post['id'] : $post->ID;
    $terms = get_the_category($post_id);

    $tags = array();
    if (!empty($terms) && !is_wp_error($terms)) {
        foreach ($terms as $term) {
            $tags[] = [
                'slug' => $term->slug,
                'id' => $term->term_id
            ];
        }
    }
    return $tags;
}
