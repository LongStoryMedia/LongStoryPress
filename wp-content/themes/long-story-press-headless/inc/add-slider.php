<?php
/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function slider_block_assets()
{
    wp_enqueue_style(
        array( 'wp-blocks' ) // Dependency to include the CSS after it.
        // filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' ) // Version: filemtime — Gets file modification time.
    );
} // End function column_block_cgb_block_assets().
// Hook: Frontend assets.
add_action('enqueue_block_assets', 'slider_block_assets');
/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function slider_block_editor_assets()
{
    // Scripts.
    wp_enqueue_script(
        array( 'wp-blocks', 'wp-i18n', 'wp-element' ) // Dependencies, defined above.
    );
    // Styles.
    wp_enqueue_style(
        array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
    );
} // End function column_block_cgb_editor_assets().
// Hook: Editor assets.
add_action('enqueue_block_editor_assets', 'slider_block_editor_assets');
