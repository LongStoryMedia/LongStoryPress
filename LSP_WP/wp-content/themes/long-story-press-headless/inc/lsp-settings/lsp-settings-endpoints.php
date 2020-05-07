<?php
class LSP_Settings_Endpoints
{
    /**
    * Add routes.
    */
    protected $text_args = [
            'type' => 'string',
            'required' => false,
            'sanitize_callback' => 'sanitize_text_field',
        ];
    public function create_args()
    {
        $_self = new self();
        return [
          'contact' => [
              'required' => false,
              'contact_title' => $_self->text_args,
              'street' => $_self->text_args,
              'city' => $_self->text_args,
              'state_province' => $_self->text_args,
              'postal_code' => $_self->text_args,
              'country' => $_self->text_args,
              'email' => $_self->text_args,
              'phone' => $_self->text_args,
          ],
          'site' => [
              'required' => false,
              'title' => $_self->text_args,
              'tagline' => $_self->text_args,
              'description' => $_self->text_args,
          ],
          'colors' => [
              'required' => false,
              'primary_color' => $_self->text_args,
              'secondary_color' => $_self->text_args,
              'accent_color' => $this->text_args,
              'background_one' => $_self->text_args,
              'background_two' => $_self->text_args,
              'text_color' => $_self->text_args,
              'header_text_color' => $_self->text_args,
              'link_text_color' => $_self->text_args,
              'contrast_text_color' => $_self->text_args,
          ],
        ];
    }
    public function add_routes()
    {
        register_rest_route(
                    'lsp-api/v1',
                    '/settings',
                    [
                        'methods' => 'POST',
                        'callback' => [$this, 'update_settings'],
                        'args' => $this->create_args(),
                        'permissions_callback' => [$this, 'permissions'],
                    ]
                );
        register_rest_route(
                    'lsp-api/v1',
                    '/settings',
                    [
                        'methods' => 'GET',
                        'callback' => [$this, 'get_settings'],
                        'args' => $this->create_args(),
                    ]
                );
    }
    /**
    * Check request permissions.
    *
    * @return bool
    */
    public function permissions()
    {
        return current_user_can('manage_options');
    }
    /**
    * Update settings.
    *
    * @param WP_REST_Request $request
    */
    public function update_settings(WP_REST_Request $request)
    {
        $settings = [
                    'contact' => $request->get_param('contact'),
                    'site' => $request->get_param('site'),
                    'colors' => $request->get_param('colors')
                ];
        LSP_Edit_Settings::save_settings($settings);
        return rest_ensure_response(LSP_Edit_Settings::get_settings())->set_status(204);
    }
    /**
    * Get settings via API.
    *
    * @param WP_REST_Request $request
    */
    public function get_settings(WP_REST_Request $request)
    {
        return rest_ensure_response(LSP_Edit_Settings::get_settings());
    }
}
