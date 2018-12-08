<?php

class LSP_Edit_Settings
{
    /**
     * Option key to save settings.
     *
     * @var string
     */
    protected static $option_key = '_lsp_settings';
    /**
     * Default settings.
     *
     * @var array
     */
    public static $defaults = [
      'site' => [
        'title' => '',
        'tagline' => '',
        'description' => '',
      ],
      'contact' => [
        'contact_title' => '',
        'street' => '',
        'city' => '',
        'state_province' => '',
        'postal_code' => '',
        'country' => '',
        'email' => '',
        'phone' => '',
      ],
      'colors' => [
        'primary_color' => '#0e0e0e',
        'secondary_color' => '#0073aa',
        'accent_color' => '#5af2ff',
        'background_one' => '#ffffff',
        'background_two' => '#cccccc',
        'backdrop' => '#ffffff',
        'text_color' => '#000000',
        'header_text_color' => '#000000',
        'link_text_color' => '#0073aa',
        'contrast_text_color' => '#ffffff',
      ]
    ];

    /**
     * Get saved settings.
     *
     * @return array
     */
    public static function get_settings()
    {
        $saved = get_option(self::$option_key, []);
        return wp_parse_args($saved, self::$defaults); // why merge and not replace?
    }

    /**
     * Save settings.
     *
     * Array keys must be whitelisted (IE must be keys of self::$defaults
     *
     * @param array $settings
     */
    public static function save_settings(array $settings)
    {
        update_option(self::$option_key, $settings);
    }
}
