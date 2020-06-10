<?php

class LSP_Render_Settings
{
  /**
   * Menu slug.
   *
   * @var string
   */
  protected $slug = 'lsp-settings';
  /**
   * URL for assets.
   *
   * @var string
   */
  protected $assets_url;

  /**
   * LSP_Content_Areas constructor.
   *
   * @param string $assets_url URL for assets
   */
  public function __construct($assets_url)
  {
    $this->assets_url = $assets_url;
    add_action('admin_menu', [$this, 'add_page']);
    add_action('admin_enqueue_scripts', [$this, 'register_assets']);
  }

  /**
   * Add CF Popup submenu page.
   *
   * @since 0.0.3
   *
   * @uses "admin_menu"
   */
  public function add_page()
  {
    add_menu_page(
      __('Site Settings', 'lsp'),
      __('Site Settings', 'lsp'),
      'manage_options',
      $this->slug,
      [$this, 'render_admin'],
      'dashicons-layout',
      2
    );
  }

  /**
   * Register CSS and JS for page.
   *
   * @uses "admin_enqueue_scripts" action
   */
  public function register_assets()
  {
    wp_register_script($this->slug, $this->assets_url . '/settings.js', ['jquery']);
    wp_register_style($this->slug, $this->assets_url . '/settings.css');
    wp_localize_script($this->slug, 'LSP', [
      'strings' => [
        'saved' => __('Settings Saved', 'lsp'),
        'error' => __('Error', 'lsp'),
      ],
      'api' => [
        'settings' => esc_url_raw(site_url('wp-json/lsp-api/v1/settings', 'https')),
        'nonce' => wp_create_nonce('wp_rest'),
        'defaults' => LSP_Edit_Settings::$defaults,
      ],
    ]);
  }

  /**
   * Enqueue CSS and JS for page.
   */
  public function enqueue_assets()
  {
    if (!wp_script_is($this->slug, 'registered')) {
      $this->register_assets();
    }
    wp_enqueue_script($this->slug);
    wp_enqueue_style($this->slug);
  }

  /**
   * Render plugin admin page.
   */
  public function render_admin()
  {
    add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']); ?>
    <form id="lsp-form" autocomplete="on">
      <div id="feedback">
      </div>
      <section>
        <h2 class="section-title">Site Info</h2>
        <div>
          <p class="label"><?php esc_html_e('Title', 'lsp'); ?></p class="label">
          <div id="title" class="known-data"><?php esc_html_e(get_option('blogname')); ?></div>
          <sub>change site title <a href="/wp-admin/options-general.php">here</a>.</sub>
        </div>
        <div>
          <p class="label"><?php esc_html_e('Tagline', 'lsp'); ?></p class="label">
          <div id="tagline" class="known-data"><?php esc_html_e(get_option('blogdescription')); ?></div>
          <sub>change tagline <a href="/wp-admin/options-general.php">here</a>.</sub>
        </div>
        <div>
          <p class="label">
            <?php esc_html_e('Site Description', 'lsp'); ?>
          </p class="label">
          <?php wp_editor('', 'description', [
            'media_buttons' => false,
            'default_editor' => '',
            'textarea_rows' => 10,
          ]); ?>
        </div>
      </section>
      <section>
        <h2 class="section-title">Contact Info</h2>
        <div class="text-input">
          <label for="contact_title">
            <?php esc_html_e('Title', 'lsp'); ?>
          </label>
          <input id="contact_title" type="text" />
        </div>
        <div class="text-input">
          <label for="street">
            <?php esc_html_e('Street', 'lsp'); ?>
          </label>
          <input id="street" type="text" name="address-1" />
        </div>
        <div class="text-input">
          <label for="city">
            <?php esc_html_e('City', 'lsp'); ?>
          </label>
          <input id="city" type="text" name="city" />
        </div>
        <div class="text-input">
          <label for="state_province">
            <?php esc_html_e('State or Province', 'lsp'); ?>
          </label>
          <input id="state_province" type="text" name="state" />
        </div>
        <div class="text-input">
          <label for="postal_code">
            <?php esc_html_e('Zip or Postal Code', 'lsp'); ?>
          </label>
          <input id="postal_code" type="number" name="postal_code" />
        </div>
        <div class="text-input">
          <label for="country">
            <?php esc_html_e('Country', 'lsp'); ?>
          </label>
          <input id="country" type="text" name="state" />
        </div>
        <div class="text-input">
          <label for="email">
            <?php esc_html_e('Email', 'lsp'); ?>
          </label>
          <input id="email" type="email" name="email" />
        </div>
        <div class="text-input">
          <label for="phone">
            <?php esc_html_e('Phone', 'lsp'); ?>
          </label>
          <input id="phone" type="tel" name="phone" />
        </div>
      </section>
      <section>
        <h2 class="section-title">Site Color Pallet</h2>
        <div class="text-input">
          <label for="primary_color">
            <?php esc_html_e('Primary Color', 'lsp'); ?>
          </label>
          <input id="primary_color" type="color" />
          <input type="text" id="primary_color_text" onchange="__LSP_SETTINGS__.onChange()" />
        </div>
        <div class="text-input">
          <label for="secondary_color">
            <?php esc_html_e('Secondary Color', 'lsp'); ?>
          </label>
          <input id="secondary_color" type="color" />
          <input type="text" id="secondary_color_text" onchange="__LSP_SETTINGS__.onChange()" />
        </div>
        <div class="text-input">
          <label for="accent_color">
            <?php esc_html_e('Accent Color', 'lsp'); ?>
          </label>
          <input id="accent_color" type="color" />
          <input type="text" id="accent_color_text" onchange="__LSP_SETTINGS__.onChange()" />
        </div>
        <div class="text-input">
          <label for="background_one">
            <?php esc_html_e('Background 1', 'lsp'); ?>
          </label>
          <input id="background_one" type="color" />
          <input type="text" id="background_one_text" onchange="__LSP_SETTINGS__.onChange()" />
        </div>
        <div class="text-input">
          <label for="background_two">
            <?php esc_html_e('Background 2', 'lsp'); ?>
          </label>
          <input id="background_two" type="color" />
          <input type="text" id="background_two_text" onchange="__LSP_SETTINGS__.onChange()" />
        </div>
        <div class="text-input">
          <label for="backdrop">
            <?php esc_html_e('Backdrop', 'lsp'); ?>
          </label>
          <input id="backdrop" type="color" />
          <input type="text" id="backdrop_text" onchange="__LSP_SETTINGS__.onChange()" />
        </div>
        <div class="text-input">
          <label for="text_color">
            <?php esc_html_e('Text Color', 'lsp'); ?>
          </label>
          <input id="text_color" type="color" />
          <input type="text" id="text_color_text" onchange="__LSP_SETTINGS__.onChange()" />
        </div>
        <div class="text-input">
          <label for="header_text_color">
            <?php esc_html_e('Header Text Color', 'lsp'); ?>
          </label>
          <input id="header_text_color" type="color" />
          <input type="text" id="header_text_color_text" onchange="__LSP_SETTINGS__.onChange()" />
        </div>
        <div class="text-input">
          <label for="link_text_color">
            <?php esc_html_e('Link Text Color', 'lsp'); ?>
          </label>
          <input id="link_text_color" type="color" />
          <input type="text" id="link_text_color_text" onchange="__LSP_SETTINGS__.onChange()" />
        </div>
        <div class="text-input">
          <label for="contrast_text_color">
            <?php esc_html_e('Contrast Text Color', 'lsp'); ?>
          </label>
          <input id="contrast_text_color" type="color" />
          <input type="text" id="contrast_text_color_text" onchange="__LSP_SETTINGS__.onChange()" />
        </div>
        <button id="setDefault">Defaults</button>
      </section>
      <?php submit_button(__('Save', 'lsp')); ?>
    </form>
<?php
  }
}
