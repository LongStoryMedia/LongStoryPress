<?php


class LSP_MB
{
    /**
      * State:
      * @param id string
      * @param title string
      * @param post_types string|array
      * @param context string
      * @param priority string
      * @param autosave boolean
      * @param fields array
      * @param assets_url string
      * @param filenames string|array
      * @param rest_base string
      * @param state self (array)
      *
      */
    protected $id;
    protected $title;
    protected $post_types;
    protected $context;
    protected $priority;
    protected $autosave;
    protected $fields;
    protected $assets_url;
    protected $filenames;
    protected $rest_base;
    protected $state;

    public function __construct()
    {
        $state = func_get_args();
        if (!empty($state)) {
            foreach ($state[0] as $key => $prop) {
                if (property_exists($this, $key)) {
                    $this->{$key} = $prop;
                }
            }
        }
        $this->state = $state[0];
        add_action('rest_api_init', [$this, 'lsp_rest_mb']);
    }

    public function lsp_add_meta_box()
    {
        add_action('admin_enqueue_scripts', [$this, 'register_assets']);
        add_meta_box(
          $this->id,
          $this->title,
          [$this, 'render_fields'],
          $this->post_types,
          $this->context,
          $this->priority
        );
    }

    public function lsp_rest_mb()
    {
        register_rest_field(
            $this->post_types,
            $this->id,
            [
                'get_callback' => function ($params) {
                    return get_post_meta($params['id'], $this->id, true);
                },
                'schema' => null,
            ]
        );
    }

    /**
     * Register CSS and JS for page.
     *
     * @uses "admin_enqueue_scripts" action
     */
    public function register_assets()
    {
        $lsp_mb_ver  = date("ymd-Gis", filemtime( get_template_directory().'/assets/lspmbGallery.js' ));
        if ($this->filenames) {
            foreach ($this->filenames as $key => $file) {
                if (preg_match('/\.js$/', $file)) {
                    wp_register_script($this->id.$file, content_url(get_raw_theme_root(get_template()).'/'.get_template().'/'.$this->assets_url.'/'.$file, [], $lsp_mb_ver));
                }
                if (preg_match('/\.css$/', $file)) {
                    wp_register_style($this->id.$file, content_url(get_raw_theme_root(get_template()).'/'.get_template().'/'.$this->assets_url.'/'.$file, false, $lsp_mb_ver));
                }
            }
        }
        wp_register_script('lspmb_main', content_url(get_raw_theme_root(get_template()).'/'.get_template().'/'.$this->assets_url.'/lspmbGallery.js', [], $lsp_mb_ver));
        wp_register_style('lspmb_main', content_url(get_raw_theme_root(get_template()).'/'.get_template().'/'.$this->assets_url.'/lspmbGallery.css', false, $lsp_mb_ver));
        wp_localize_script('lspmb_main', 'LSP', [
            'strings' => [
                'saved' => __("{$this->title} Saved", 'lsp'),
                'error' => __('Error', 'lsp'),
            ],
            'api' => [
                'media' => esc_url_raw(rest_url("wp/v2/media")),
                'nonce' => wp_create_nonce('wp_rest'),
            ],
            'mb_state' => $this->state
        ]);
    }

    /**
     * Enqueue CSS and JS for page.
     */
    public function enqueue_assets()
    {
        if (!wp_script_is('lspmb_main', 'registered')) {
            $this->register_assets();
        }
        wp_enqueue_media();
        wp_enqueue_script('media-upload');
        wp_enqueue_script('lspmb_main');
        wp_enqueue_style('lspmb_main');
        if ($this->filenames) {
            foreach ($this->filenames as $key => $file) {
                if (preg_match('/\.js$/', $file)) {
                    wp_enqueue_script($this->id.$file);
                }
                if (preg_match('/\.css$/', $file)) {
                    wp_enqueue_style($this->id.$file);
                }
            }
        }
    }

    public function render_fields()
    {
        $this->enqueue_assets();
        global $post;
        // Nonce field to validate form request came from current site
        wp_nonce_field(basename(__FILE__), "{$this->id}_nonce");
        $field_ids = [];
        foreach ($this->fields as $key => $field) {
            if (array_key_exists("std", $field)) {
                $field_ids[$field["id"]] = $field["std"];
            } else {
                $field_ids[$field["id"]] = $field["value"];
            }
        }
        $mb_settings = get_post_meta($post->ID, $this->id, true);
        $mb_fields = wp_parse_args($mb_settings, $field_ids);
        // Output the Fields
        foreach (array_keys($mb_fields) as $key=>$field) {
            $props = $this->fields[$key]; ?>
          <div>
            <label for="<?php echo esc_attr("{$this->id}_{$props['id']}") ?>">
              <?php _e($props["name"]) ?>
            </label>
            <?php
            switch ($props["type"]) {
              case 'select':
                ?>
                <select
                  id="<?php echo esc_attr("{$this->id}_{$props['id']}") ?>"
                  name="<?php echo esc_attr("{$this->id}[{$props['id']}]") ?>"
                  placeholder="<?php echo esc_attr($props["placeholder"]) ?>"
                  class="<?php echo esc_attr("{$this->id}_{$props['type']}") ?>"
                  value="<?php echo esc_attr($mb_fields[$field]) ?>"
                  >
                  <?php foreach ($props["options"] as $i => $value) {
                    ?>
                    <option value="<?php echo esc_attr($value) ?>" <?php if($value === $mb_fields[$field]) echo "selected='selected'"; ?>>
                      <?php _e($value) ?>
                    </option>
                  <?php
                  }
                  ?>
                </select>
                <?php
                break;
              case 'media':
                ?>
                <input
                  id="<?php echo esc_attr("{$this->id}_gallery") ?>"
                  name="<?php echo esc_attr("{$this->id}[{$props['id']}]") ?>"
                  value="<?php echo esc_attr($mb_fields[$field]) ?>"
                  type="hidden"
                />
                <span id="<?php echo esc_attr("{$this->id}_gallery_src") ?>">
                  <ul id="<?php echo esc_attr("{$this->id}_gallery_list") ?>">
                    <?php
                    if ($mb_fields[$field]) {
                        foreach (explode(",", $mb_fields[$field]) as $img) {
                            ?>
                        <li>
                          <div class="<?php echo esc_attr("{$this->id}_gallery_container") ?>">
                          <span class="<?php echo esc_attr("{$this->id}_gallery_close") ?>"></span>
                          <img
                            src="<?php echo wp_get_attachment_thumb_url($img) ?>"
                            id="<?php echo esc_attr($img) ?>"
                          />
                          </div>
                        </li>
                        <?php
                        }
                    }
                    ?>
                  </ul>
                </span>
                <div class="<?php echo esc_attr("{$this->id}_gallery_button_container") ?>">
                  <input
                    id="<?php echo esc_attr("{$this->id}_gallery_button") ?>"
                    type="button"
                    value="Add Gallery"
                  />
                </div>
                <?php
                break;
              default:
                ?>
                <input
                  type="<?php echo esc_attr($props["type"]) ?>"
                  name="<?php echo esc_attr("{$this->id}[{$props['id']}]") ?>"
                  value="<?php echo esc_attr($mb_fields[$field]) ?>"
                  id="<?php echo esc_attr("{$this->id}_{$props['id']}") ?>"
                  class="widefat"
                  <?php
                  if (is_array($mb_settings)) {
                      if (array_key_exists($field, $mb_settings)) {
                          echo esc_attr("checked");
                      }
                  } ?>
                />
                <?php
                break;
            } ?>
          </div>
          <?php
        }
    }

    public function lsp_save_meta_box($post_id, $post)
    {
        if (
          !isset($_POST["{$this->id}_nonce"])
          || (defined( 'DOING_AUTOSAVE' ) && $this->autosave && DOING_AUTOSAVE)
        ) {
            return;
        }
        if (
          !wp_verify_nonce($_POST["{$this->id}_nonce"], basename(__FILE__))
          || !current_user_can('edit_post', $post_id)
          || !isset($_POST[$this->id])
        ) {
            return $post_id;
        }

        $sanitized = array();
        foreach ($_POST[$this->id] as $key => $value) {
            $sanitized[$key] = wp_filter_post_kses($value);
        }
        // Don't store custom data twice
        if ('revision' === $post->post_type) {
            return;
        }
        if (get_post_meta($post_id, $this->id, false)) {
            // If the custom field already has a value, update it.
            update_post_meta($post_id, $this->id, $sanitized);
        } else {
            // If the custom field doesn't have a value, add it.
            add_post_meta($post_id, $this->id, $sanitized);
        }
        if (!$value) {
            // Delete the meta key if there's no value
            delete_post_meta($post_id, $sanitized);
        }
    }
}
