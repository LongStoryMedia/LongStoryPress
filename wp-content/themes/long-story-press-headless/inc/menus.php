<?php
 function register_menus() {
	register_nav_menu( 'highlights', 'highlights');
	register_nav_menu( 'main-menu', 'main menu');
	register_nav_menu( 'shop', 'shop');
	register_nav_menu( 'social', 'social');
}
add_action( 'after_setup_theme', 'register_menus');
