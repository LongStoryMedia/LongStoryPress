<?php

class LSP_Global_Assets
{
    protected $slug = 'lsp-global-assets';
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
        add_action('admin_enqueue_scripts', [$this, 'register_assets']);
    }

    /**
     * Register CSS and JS for page.
     *
     * @uses "admin_enqueue_scripts" action
     */
    public function register_assets()
    {
        wp_register_script($this->slug, $this->assets_url.'/admin-colors.js');
        wp_register_style($this->slug, $this->assets_url.'/admin-colors.css');
        wp_localize_script($this->slug, 'LSP', [
            'api' => [
                'settings' => esc_url_raw(rest_url('lsp-api/v1/settings')),
                'nonce' => wp_create_nonce('wp_rest'),
            ],
            'links' => esc_url_raw($this->assets_url),
        ]);
        wp_enqueue_script($this->slug);
        wp_enqueue_style($this->slug);
    }
}
add_action('init', function() {
  $assets_url = site_url('wp-content/themes/long-story-press-headless/assets');
  //Setup menu
  if (is_admin()) {
      new LSP_Global_Assets($assets_url);
  }
});
