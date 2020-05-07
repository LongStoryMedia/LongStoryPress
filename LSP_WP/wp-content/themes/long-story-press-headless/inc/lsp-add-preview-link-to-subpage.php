<?php
function lsp_preview_link_input_config() {
  global $post;
  if(is_page() && $post->post_parent) {
    return new LSP_MB([
      'id' => 'lsp_subsection',
      'title' => esc_html__('Convert to Subsection', 'lsp'),
      'post_types' => ['page'],
      'context' => 'side',
      'priority' => 'low',
      'autosave' => true,
      'rest_base' => 'pages',
      'fields' => [
        [
          'id' => 'subsection',
          'type' => 'checkbox',
          'name' => esc_html__('Subsection', 'lsp'),
          'description' => esc_html__('is this page meant to act as a section of it\'s parent?', 'lsp'),
          'checked' => false,
          'value' => 'subsection',
        ],
        [
          'id' => 'link_to',
          'type' => 'text',
          'name' => esc_html__('Add Preview Link', 'lsp'),
          'description' => esc_html__('if this is a child page, and is meant to act as a section of it\'s parent, you may add a link to direct the visitor to another page with more information', 'lsp'),
          'value' => '',
        ],
      ],
    ]);
  }
}

add_action('save_post', [lsp_preview_link_input_config(), 'lsp_save_meta_box'], 1, 2);
add_action('add_meta_boxes', [lsp_preview_link_input_config(), 'lsp_add_meta_box']);
