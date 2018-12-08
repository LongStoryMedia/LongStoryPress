<?php

function lsp_recursive_meta_search($search, $fields, $post_id)
{
    foreach ($fields as $key => $value) {
      $post_meta = get_post_meta($post_id, $key, true);
        if (preg_match($search, $key)) {
            return $value;
        } elseif (is_array($post_meta)) {
            return lsp_recursive_meta_search($search, $post_meta, $post_id);
        } else {
            continue;
        }
    }
}

function lsp_gallery_rest_cb($post)
{
    $post_id = is_array($post) ? $post['id'] : $post->ID;
    $ids = explode(",", lsp_recursive_meta_search('/gallery/', get_post_meta($post_id), $post_id));
    $thumbID = get_post_meta($post_id, "_thumbnail_id", true);
    if ((bool)$thumbID) {
        array_unshift($ids, $thumbID);
    }
    $gallery = array();
    foreach ($ids as $key => &$img_id) {
        $attachment_post = get_post($img_id);
        if (is_null($attachment_post)) {
            continue;
        }

        $attachment = wp_get_attachment_image_src($img_id, 'full');
        if (! is_array($attachment)) {
            continue;
        }

        $gallery[] = array(
            'id'                => (int) $img_id,
            'src'               => current($attachment),
            'name'              => get_the_title($img_id),
            'alt'               => get_post_meta($img_id, '_wp_attachment_image_alt', true),
            'media_details'     => wp_get_attachment_metadata($img_id),
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
                if (! $image_src) {
                    continue;
                }

                $size_data['source_url'] = $image_src[0];
            }

            $full_src = wp_get_attachment_image_src($img_id, 'full');

            if (!empty($full_src)) {
                $gallery[$key]['media_details']['sizes']['full'] = array(
                  'file'       => wp_basename($full_src[0]),
                  'width'      => $full_src[1],
                  'height'     => $full_src[2],
                  'mime_type'  => $post->post_mime_type,
                  'source_url' => $full_src[0],
                );
            }
        } else {
            $gallery[$key]['media_details']['sizes'] = new stdClass;
        }
    }
    return $gallery;
}
