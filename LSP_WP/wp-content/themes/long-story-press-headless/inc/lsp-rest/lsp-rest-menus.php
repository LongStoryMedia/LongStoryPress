<?php

class LSP_REST_Menus
{

    /**
     * The namespace.
     *
     * @var string
     */
    protected $namespace;

    /**
     * Rest base for the current object.
     *
     * @var string
     */
    protected $rest_base;

    public function __construct($namespace, $rest_base = '/menus')
    {
        $this->namespace = $namespace;
        $this->rest_base = $rest_base;
    }

    /**
     * Register menu routes for WP API v2.
     *
     * @since  1.2.0
     */
    public function register_routes()
    {
        register_rest_route($this->namespace, $this->rest_base, array(
            array(
                'methods'  => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_menus'),
            )
        ));
        register_rest_route($this->namespace, $this->rest_base . '/(?P<slug>[a-zA-Z0-9_-]+)', array(
            array(
                'methods'  => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_menu'),
            )
        ));
    }

    /**
     * Get menus.
     *
     * @return array All registered menus
     */
    public function get_menus()
    {
        $rest_url = trailingslashit(get_rest_url() . $this->namespace . '/menus/');
        $wp_menus = wp_get_nav_menus();

        $i = 0;
        $rest_menus = array();
        foreach ($wp_menus as $wp_menu) {
            $menu = (array) $wp_menu;
            $rest_menus[$i]                = $menu;
            $rest_menus[$i]['id']          = $menu['term_id'];
            $rest_menus[$i]['name']        = $menu['name'];
            $rest_menus[$i]['slug']        = $menu['slug'];
            $rest_menus[$i]['description'] = $menu['description'];
            $rest_menus[$i]['count']       = $menu['count'];
            $rest_menus[$i]['meta']['links']['collection'] = $rest_url;
            $rest_menus[$i]['meta']['links']['self']       = $rest_url . $menu['term_id'];
            $i++;
        }

        return $rest_menus;
    }


    /**
     * Get a menu.
     *
     * @param  $request
     * @return array Menu data
     */
    public function get_menu($request)
    {
        $id             = $request['slug'];
        $rest_url       = get_rest_url() . $this->namespace . '/menus/';
        $wp_menu_object = $id ? wp_get_nav_menu_object($id) : array();
        $wp_menu_items  = $id ? wp_get_nav_menu_items($id) : array();
        $rest_menu = array();
        if ($wp_menu_object) {
            $menu = (array) $wp_menu_object;
            $rest_menu['id']          = abs($menu['term_id']);
            $rest_menu['name']        = $menu['name'];
            $rest_menu['slug']        = $menu['slug'];
            $rest_menu['description'] = $menu['description'];
            $rest_menu['count']       = abs($menu['count']);
            $rest_menu_items = array();
            foreach ($wp_menu_items as $item_object) {
                $rest_menu_items[] = $this->format_menu_item($item_object);
            }
            $rest_menu_items = $this->nested_menu_items($rest_menu_items, 0);
            $rest_menu['items']                       = $rest_menu_items;
            $rest_menu['meta']['links']['collection'] = $rest_url;
            $rest_menu['meta']['links']['self']       = $rest_url . $id;
        }
        return $rest_menu;
    }


    /**
     * Handle nested menu items.
     *
     * Given a flat array of menu items, split them into parent/child items
     * and recurse over them to return children nested in their parent.
     *
     * @param  $menu_items
     * @param  $parent
     * @return array
     */
    private function nested_menu_items(&$menu_items, $parent = null)
    {
        $parents = array();
        $children = array();
        // Separate menu_items into parents & children.
        array_map(function ($i) use ($parent, &$children, &$parents) {
            if ($i['id'] != $parent && $i['parent'] == $parent) {
                $parents[] = $i;
            } else {
                $children[] = $i;
            }
        }, $menu_items);
        foreach ($parents as &$parent) {
            if ($this->has_children($children, $parent['id'])) {
                $parent['children'] = $this->nested_menu_items($children, $parent['id']);
            }
        }
        return $parents;
    }


    /**
     * Check if a collection of menu items contains an item that is the parent id of 'id'.
     *
     * @param  array $items
     * @param  int $id
     * @return array
     */
    private function has_children($items, $id)
    {
        return array_filter($items, function ($i) use ($id) {
            return $i['parent'] == $id;
        });
    }


    /**
     * Returns all child nav_menu_items under a specific parent.
     *
     * @param int   $parent_id      The parent nav_menu_item ID
     * @param array $nav_menu_items Navigation menu items
     * @param bool  $depth          Gives all children or direct children only
     * @return array	returns filtered array of nav_menu_items
     */
    public function get_nav_menu_item_children($parent_id, $nav_menu_items, $depth = true)
    {
        $nav_menu_item_list = array();
        foreach ((array) $nav_menu_items as $nav_menu_item) {
            if ($nav_menu_item->menu_item_parent == $parent_id) {
                $nav_menu_item_list[] = $this->format_menu_item($nav_menu_item, true, $nav_menu_items);
                if ($depth) {
                    if ($children = $this->get_nav_menu_item_children($nav_menu_item->ID, $nav_menu_items)) {
                        $nav_menu_item_list = array_merge($nav_menu_item_list, $children);
                    }
                }
            }
        }
        return $nav_menu_item_list;
    }


    /**
     * Format a menu item for REST API consumption.
     *
     * @param  object|array $menu_item  The menu item
     * @param  bool         $children   Get menu item children (default false)
     * @param  array        $menu       The menu the item belongs to (used when $children is set to true)
     * @return array	a formatted menu item for REST
     */
    public function format_menu_item($menu_item, $children = false, $menu = array())
    {
        $item = (array) $menu_item;
        $menu_item = array(
            'id'          => $item['ID'],
            'order'       => (int) $item['menu_order'],
            'parent'      => $item['menu_item_parent'],
            'title'       => $item['title'],
            'url'         => $item['url'],
            'attr'        => $item['attr_title'],
            'target'      => $item['target'],
            'classes'     => implode(' ', $item['classes']),
            'xfn'         => $item['xfn'],
            'description' => $item['description'],
            'object_id'   => $item['object_id'],
            'object'      => $item['object'],
            'slug'        => get_post($item['object_id'])->post_name,
            'type'        => $item['type'],
            'type_label'  => $item['type_label'],
        );
        if ($children === true && !empty($menu)) {
            $menu_item['children'] = $this->get_nav_menu_item_children($item['ID'], $menu);
        }
        return $menu_item;
    }
}
