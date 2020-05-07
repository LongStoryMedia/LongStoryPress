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
        $saved = get_option(self::$option_key, self::$defaults);
        return wp_parse_args($saved, self::$defaults);
    }

    /**
     * Save settings.
     *
     * Array keys must be whitelisted (IE must be keys of self::$defaults)
     *
     * @param array $settings
     */
    public static function save_settings(array $settings)
    {
        $whitelisted_settings = array();
        foreach ($settings as $key => $value) {
            if (array_key_exists($key, self::$defaults)) {
                $whitelisted_settings[$key] = array();
                foreach ($value as $k => $v) {
                    if (array_key_exists($k, self::$defaults[$key])) {
                        $whitelisted_settings[$key][$k] = $v;
                    }
                }
            }
        }
        update_option(self::$option_key, $whitelisted_settings);
        self::write_color_css();
    }
    /**
       * create css file containing custom site colors
       *
       * @return file
       */
    public static function write_color_css()
    {
        $settings = self::get_settings();
        $colors = $settings['colors'];

        $css = ".color_primary_color, .children_color_primary_color>*, .active_color_primary_color:active, .focus_color_primary_color:focus, .visited_color_primary_color:visited, .hover_color_primary_color:hover, .children_hover_color_primary_color:hover>*, .pseudo_color_primary_color:before, .pseudo_color_primary_color:after {color: ".
        $colors['primary_color']
        .";} .color_secondary_color, .children_color_secondary_color>*, .active_color_secondary_color:active, .focus_color_secondary_color:focus, .visited_color_secondary_color:visited, .hover_color_secondary_color:hover, .children_hover_color_secondary_color:hover>*, .pseudo_color_secondary_color:before, .pseudo_color_secondary_color:after {color: ".
        $colors['secondary_color']
        .";} a:hover, .color_accent_color, .children_color_accent_color>*, .active_color_accent_color:active, .focus_color_accent_color:focus, .visited_color_accent_color:visited, .hover_color_accent_color:hover, .children_hover_color_accent_color:hover>*, .pseudo_color_accent_color:before, .pseudo_color_accent_color:after {color: ".
        $colors['accent_color']
        .";} .color_background_one, .children_color_background_one>*, .active_color_background_one:active, .focus_color_background_one:focus, .visited_color_background_one:visited, .hover_color_background_one:hover, .children_hover_color_background_one:hover>*, .pseudo_color_background_one:before, .pseudo_color_background_one:after {color: ".
        $colors['background_one']
        .";} .color_background_two, .children_color_background_two>*, .active_color_background_two:active, .focus_color_background_two:focus, .visited_color_background_two:visited, .hover_color_background_two:hover, .children_hover_color_background_two:hover>*, .pseudo_color_background_two:before, .pseudo_color_background_two:after {color: ".
        $colors['background_two']
        .";} .color_backdrop, .children_color_backdrop>*, .active_color_backdrop:active, .focus_color_backdrop:focus, .visited_color_backdrop:visited, .hover_color_backdrop:hover, .children_hover_color_backdrop:hover>*, .pseudo_color_backdrop:before, .pseudo_color_backdrop:after {color: ".
        $colors['backdrop']
        .";} .color_text_color, .children_color_text_color>*, .active_color_text_color:active, .focus_color_text_color:focus, .visited_color_text_color:visited, .hover_color_text_color:hover, .children_hover_color_text_color:hover>*, .pseudo_color_text_color:before, .pseudo_color_text_color:after {color: ".
        $colors['text_color']
        .";} h1, h2, .color_header_text_color, .children_color_header_text_color>*, .active_color_header_text_color:active, .focus_color_header_text_color:focus, .visited_color_header_text_color:visited, .hover_color_header_text_color:hover, .children_hover_color_header_text_color:hover>*, .pseudo_color_header_text_color:before, .pseudo_color_header_text_color:after {color: ".
        $colors['header_text_color']
        .";} a, .color_link_text_color, .children_color_link_text_color>*, .active_color_link_text_color:active, .focus_color_link_text_color:focus, .visited_color_link_text_color:visited, .hover_color_link_text_color:hover, .children_hover_color_link_text_color:hover>*, .pseudo_color_link_text_color:before, .pseudo_color_link_text_color:after {color: ".
        $colors['link_text_color']
        .";} .color_contrast_text_color, .children_color_contrast_text_color>*, .active_color_contrast_text_color:active, .focus_color_contrast_text_color:focus, .visited_color_contrast_text_color:visited, .hover_color_contrast_text_color:hover, .children_hover_color_contrast_text_color:hover>*, .pseudo_color_contrast_text_color:before, .pseudo_color_contrast_text_color:after {color: ".
        $colors['contrast_text_color']
        .";} .pseudo_background_primary_color:before, .pseudo_background_primary_color:after, .hover_background_primary_color:hover, .children_hover_background_primary_color:hover>*, .active_background_primary_color:active, .focus_background_primary_color:focus, .visited_background_primary_color:visited, .background_primary_color, .children_background_primary_color>* {background-color: ".
        $colors['primary_color']
        .";} a:before, a:after, .pseudo_background_secondary_color:before, .pseudo_background_secondary_color:after, .hover_background_secondary_color:hover, .children_hover_background_secondary_color:hover>*, .active_background_secondary_color:active, .focus_background_secondary_color:focus, .visited_background_secondary_color:visited, .background_secondary_color, .children_background_secondary_color>* {background-color: ".
        $colors['secondary_color']
        .";} .pseudo_background_accent_color:before, .pseudo_background_accent_color:after, .hover_background_accent_color:hover, .children_hover_background_accent_color:hover>*, .active_background_accent_color:active, .focus_background_accent_color:focus, .visited_background_accent_color:visited, .background_accent_color, .children_background_accent_color>* {background-color: ".
        $colors['accent_color']
        .";} .pseudo_background_background_one:before, .pseudo_background_background_one:after, .hover_background_background_one:hover, .children_hover_background_background_one:hover>*, .active_background_background_one:active, .focus_background_background_one:focus, .visited_background_background_one:visited, .background_background_one, .children_background_background_one>* {background-color: ".
        $colors['background_one']
        .";} .pseudo_background_background_two:before, .pseudo_background_background_two:after, .hover_background_background_two:hover, .children_hover_background_background_two:hover>*, .active_background_background_two:active, .focus_background_background_two:focus, .visited_background_background_two:visited, .background_background_two, .children_background_background_two>* {background-color: ".
        $colors['background_two']
        .";} .pseudo_background_backdrop:before, .pseudo_background_backdrop:after, .hover_background_backdrop:hover, .children_hover_background_backdrop:hover>*, .active_background_backdrop:active, .focus_background_backdrop:focus, .visited_background_backdrop:visited, .background_backdrop, .children_background_backdrop>* {background-color: ".
        $colors['backdrop']
        .";} .pseudo_background_text_color:before, .pseudo_background_text_color:after, .hover_background_text_color:hover, .children_hover_background_text_color:hover>*, .active_background_text_color:active, .focus_background_text_color:focus, .visited_background_text_color:visited, .background_text_color, .children_background_text_color>* {background-color: ".
        $colors['text_color']
        .";} .pseudo_background_header_text_color:before, .pseudo_background_header_text_color:after, .hover_background_header_text_color:hover, .children_hover_background_header_text_color:hover>*, .active_background_header_text_color:active, .focus_background_header_text_color:focus, .visited_background_header_text_color:visited, .background_header_text_color, .children_background_header_text_color>* {background-color: ".
        $colors['header_text_color']
        .";} .pseudo_background_link_text_color:before, .pseudo_background_link_text_color:after, .hover_background_link_text_color:hover, .children_hover_background_link_text_color:hover>*, .active_background_link_text_color:active, .focus_background_link_text_color:focus, .visited_background_link_text_color:visited, .background_link_text_color, .children_background_link_text_color>* {background-color: ".
        $colors['link_text_color']
        .";} .pseudo_background_contrast_text_color:before, .pseudo_background_contrast_text_color:after, .hover_background_contrast_text_color:hover, .children_hover_background_contrast_text_color:hover>*, .active_background_contrast_text_color:active, .focus_background_contrast_text_color:focus, .visited_background_contrast_text_color:visited, .background_contrast_text_color, .children_background_contrast_text_color>* {background-color: ".
        $colors['contrast_text_color']
        .";} .border_primary_color, .hover_border_primary_color:hover, .focus_border_primary_color:focus, .active_border_primary_color:active, .visited_border_primary_color:visited, .children_border_primary_color>*, .children_hover_border_primary_color:hover>*, .pseudo_border_primary_color:before, .pseudo_border_primary_color:after {border-color: ".
        $colors['primary_color']
        .";} .border_secondary_color, .hover_border_secondary_color:hover, .focus_border_secondary_color:focus, .active_border_secondary_color:active, .visited_border_secondary_color:visited, .children_border_secondary_color>*, .children_hover_border_secondary_color:hover>*, .pseudo_border_secondary_color:before, .pseudo_border_secondary_color:after {border-color: ".
        $colors['secondary_color']
        .";} .border_accent_color, .hover_border_accent_color:hover, .focus_border_accent_color:focus, .active_border_accent_color:active, .visited_border_accent_color:visited, .children_border_accent_color>*, .children_hover_border_accent_color:hover>*, .pseudo_border_accent_color:before, .pseudo_border_accent_color:after {border-color: ".
        $colors['accent_color']
        .";} .border_background_one, .hover_border_background_one:hover, .focus_border_background_one:focus, .active_border_background_one:active, .visited_border_background_one:visited, .children_border_background_one>*, .children_hover_border_background_one:hover>*, .pseudo_border_background_one:before, .pseudo_border_background_one:after {border-color: ".
        $colors['background_one']
        .";} .border_background_two, .hover_border_background_two:hover, .focus_border_background_two:focus, .active_border_background_two:active, .visited_border_background_two:visited, .children_border_background_two>*, .children_hover_border_background_two:hover>*, .pseudo_border_background_two:before, .pseudo_border_background_two:after {border-color: ".
        $colors['background_two']
        .";} .border_backdrop, .hover_border_backdrop:hover, .focus_border_backdrop:focus, .active_border_backdrop:active, .visited_border_backdrop:visited, .children_border_backdrop>*, .children_hover_border_backdrop:hover>*, .pseudo_border_backdrop:before, .pseudo_border_backdrop:after {border-color: ".
        $colors['backdrop']
        .";} .border_text_color, .hover_border_text_color:hover, .focus_border_text_color:focus, .active_border_text_color:active, .visited_border_text_color:visited, .children_border_text_color>*, .children_hover_border_text_color:hover>*, .pseudo_border_text_color:before, .pseudo_border_text_color:after {border-color: ".
        $colors['text_color']
        .";} .border_header_text_color, .hover_border_header_text_color:hover, .focus_border_header_text_color:focus, .active_border_header_text_color:active, .visited_border_header_text_color:visited, .children_border_header_text_color>*, .children_hover_border_header_text_color:hover>*, .pseudo_border_header_text_color:before, .pseudo_border_header_text_color:after {border-color: ".
        $colors['header_text_color']
        .";} .border_link_text_color, .hover_border_link_text_color:hover, .focus_border_link_text_color:focus, .active_border_link_text_color:active, .visited_border_link_text_color:visited, .children_border_link_text_color>*, .children_hover_border_link_text_color:hover>*, .pseudo_border_link_text_color:before, .pseudo_border_link_text_color:after {border-color: ".
        $colors['link_text_color']
        .";} .border_contrast_text_color, .hover_border_contrast_text_color:hover, .focus_border_contrast_text_color:focus, .active_border_contrast_text_color:active, .visited_border_contrast_text_color:visited, .children_border_contrast_text_color>*, .children_hover_border_contrast_text_color:hover>*, .pseudo_border_contrast_text_color:before, .pseudo_border_contrast_text_color:after {border-color: ".
        $colors['contrast_text_color']
        .";}";

        $admin_css = "#adminmenu, #adminmenu .wp-submenu, #adminmenuback, #adminmenuwrap, #wpadminbar { background-color: ".
        $colors['primary_color']
        ."; } a, #adminmenu li.menu-top:hover, #adminmenu li.opensub>a.menu-top, #adminmenu li>a.menu-top:focus, #wpadminbar:not(.mobile) .ab-top-menu > li:hover > .ab-item, #wpadminbar:not(.mobile) > #wp-toolbar li:hover span.ab-label, #adminmenu a:hover, .components-button.is-link, #adminmenu .wp-submenu a:hover, #adminmenu a:hover { color: ".
        $colors['link_text_color']
        ."; } #wpadminbar .ab-top-menu > li.hover > .ab-item, #wpadminbar.nojq .quicklinks .ab-top-menu > li > .ab-item:focus, #wpadminbar:not(.mobile) .ab-top-menu > li:hover > .ab-item, #wpadminbar:not(.mobile) .ab-top-menu > li > .ab-item:focus, #adminmenu div.wp-menu-image::before, #wpadminbar #adminbarsearch::before, #wpadminbar .ab-icon::before, #wpadminbar .ab-item::before, #adminmenu .wp-submenu a:focus, #adminmenu li.menu-top > a:focus { color: ".
        $colors['secondary_color']
        ."; }   #wpadminbar .ab-top-menu > li.hover > .ab-item, #wpadminbar:not(.mobile) .ab-top-menu > li:hover > .ab-item, #wpadminbar:not(.mobile) .ab-top-menu > li > .ab-item:focus, #adminmenu div.wp-menu-image::before:hover, #wpadminbar #adminbarsearch::before:hover, #wpadminbar .ab-icon::before:hover, #wpadminbar .ab-item::before:hover, a:active, a:hover, #adminmenu .wp-submenu a:focus, #adminmenu .wp-submenu a:hover, #adminmenu a:hover, #adminmenu li.menu-top > a:focus, .components-button.is-link:active, .components-button.is-link:hover { color: ".
        $colors['accent_color']
        ."; } a:active, a:hover, #adminmenu li a:focus div.wp-menu-image:before, #adminmenu li.opensub div.wp-menu-image:before, #adminmenu li:hover div.wp-menu-image:before, #wpadminbar .quicklinks .ab-sub-wrapper .menupop.hover>a, #wpadminbar .quicklinks .menupop ul li a:focus, #wpadminbar .quicklinks .menupop ul li a:focus strong, #wpadminbar .quicklinks .menupop ul li a:hover, #wpadminbar .quicklinks .menupop ul li a:hover strong, #wpadminbar .quicklinks .menupop.hover ul li a:focus, #wpadminbar .quicklinks .menupop.hover ul li a:hover, #wpadminbar .quicklinks .menupop.hover ul li div[tabindex]:focus, #wpadminbar .quicklinks .menupop.hover ul li div[tabindex]:hover, #wpadminbar li #adminbarsearch.adminbar-focused:before, #wpadminbar li .ab-item:focus .ab-icon:before, #wpadminbar li .ab-item:focus:before, #wpadminbar li a:focus .ab-icon:before, #wpadminbar li.hover .ab-icon:before, #wpadminbar li.hover .ab-item:before, #wpadminbar li:hover #adminbarsearch:before, #wpadminbar li:hover .ab-icon:before, #wpadminbar li:hover .ab-item:before, #wpadminbar.nojs .quicklinks .menupop:hover ul li a:focus, #wpadminbar.nojs .quicklinks .menupop:hover ul li a:hover, #collapse-button:focus, #collapse-button:hover { color: ".
        $colors['accent_color']
        ."; } h1, h2, h3 { color: ".
        $colors['header_text_color']
        ."; } body, .components-panel__header { background-color: ".
        $colors['backdrop']
        ."; color: ".
        $colors['text_color']
        ."; } .components-panel__header { border-color: transparent; } .edit-post-sidebar__panel-tab.is-active, .components-button.is-primary:focus:not(:disabled):not([aria-disabled='true']), .components-button.is-primary:hover { border-color: transparent; } .alternate, .striped>tbody>:nth-child(odd), ul.striped>:nth-child(odd), #lsp-form>section, .edit-post-sidebar, .try-gutenberg-panel, .welcome-panel, .postbox { background-color: ".
        $colors['background_two']
        ."; } .wrap .page-title-action:focus { color: ".
        $colors['secondary_color']
        ."; background-color: ".
        $colors['background_two']
        ."; box-shadow: ".
        $colors['secondary_color']
        ."; } .split-page-title-action a, .split-page-title-action a:active, .split-page-title-action .expander:after, .wrap .add-new-h2, .wrap .add-new-h2:active, .wrap .page-title-action, .wrap .page-title-action:active { color: ".
        $colors['secondary_color']
        ."; background-color: ".
        $colors['background_two']
        ."; } .split-page-title-action a:hover, .split-page-title-action .expander:hover:after, .components-button.is-primary:focus:not(:disabled):not([aria-disabled='true']), .components-button.is-primary:hover, .wp-core-ui .button-primary:hover  { background-color: ".
        $colors['secondary_color']
        ."; color: ".
        $colors['background_two']
        ."; } .components-button.is-primary:hover, .wp-core-ui .button-primary:hover  { border-color: transparent; background-color: ".
        $colors['accent_color']
        ."; } .split-page-title-action a:focus, .split-page-title-action .expander:focus:after { border-color: transparent; box-shadow: ".
        $colors['secondary_color']
        ."; color: ".
        $colors['background_two']
        ."; } #adminmenu .wp-has-current-submenu .wp-submenu .wp-submenu-head, #adminmenu .wp-menu-arrow, #adminmenu .wp-menu-arrow div, #adminmenu li.current a.menu-top, #adminmenu li.wp-has-current-submenu a.wp-has-current-submenu, .folded #adminmenu li.current.menu-top, .folded #adminmenu li.wp-has-current-submenu { color: ".
        $colors['background_one']
        ."; } .components-button.is-primary, .wp-core-ui .button-primary { border-color: transparent; background-color: ".
        $colors['secondary_color']
        ."; color: ".
        $colors['background_one']
        ."; }";

        $colors_json = "{\"primary_color\":\"".
        $colors['primary_color']
        ."\",\"secondary_color\":\"".
        $colors['secondary_color']
        ."\",\"accent_color\":\"".
        $colors['accent_color']
        ."\",\"background_one\":\"".
        $colors['background_one']
        ."\",\"background_two\":\"".
        $colors['background_two']
        ."\",\"backdrop\":\"".
        $colors['backdrop']
        ."\",\"text_color\":\"".
        $colors['text_color']
        ."\",\"header_text_color\":\"".
        $colors['header_text_color']
        ."\",\"link_text_color\":\"".
        $colors['link_text_color']
        ."\",\"contrast_text_color\":\"".
        $colors['contrast_text_color']
        ."\"}";
        if (!file_exists(lsp_global_assets()['path'])) {
            mkdir(lsp_global_assets()['path']);
        }
        file_put_contents(lsp_global_assets()['path'].'/colors.css', $css);
        file_put_contents(lsp_global_assets()['path'].'/admin-colors.css', $admin_css);
        file_put_contents(lsp_global_assets()['path'].'/colors.json', $colors_json);
    }
}
