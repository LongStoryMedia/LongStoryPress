<?php
class LSPSliderBox
{
    public $selected_slider;

    public static function lsp_add_slider_box()
    {
        $_self = new self();
        add_meta_box('lsp_slider_meta_box', 'Sliders on page', array($_self, 'lsp_render_slider_box'), 'page', 'side', 'low');
        add_meta_box('lsp_slider_meta_box', 'Sliders on page', array($_self, 'lsp_render_slider_box'), 'post', 'side', 'low');
    }

    public function lsp_render_slider_box()
    {
        global $post; // Get the current post data
        $details = get_post_meta($post->ID, 'lsp', true); // Get the saved values
        $query = new WP_Query([
          'post_type' => 'lsp_slider',
          'post_status' => 'publish',
          'posts_per_page' => -1,
        ]); ?>
    		<fieldset>
    			<div>
    				<label for="lsp_slider_meta_box">
    					<?php _e('Slider', 'lsp'); ?>
    				</label>
            <select id="sliderSelect">
            <?php
              while ($query->have_posts()) {
                  $query->the_post();
                  $post_id = get_the_ID();
                  $slider_meta = get_metadata('post', $post_id);
                  $title = __(get_the_title());
                  // for($i = 1; $i < count($slider_meta); $i++) {
                  //   echo $slider_meta["page"];
                  //   foreach($slider_meta[$i] as $datum) {
                  //     echo $datum;
                  //     echo '-';
                  //   }
                  // }
                  echo "<option value='${title}'>";
                  echo esc_html__($title);
                  echo '</option>';
              }
        wp_reset_query(); ?>
            </select>
    				<!-- <input
    					type="text"
    					name="lsp_slider_meta_box"
    					id="lsp_slider_meta_box"
    					value="<?php /*echo var_dump($this);*/?>"
    				> -->
    			</div>
    		</fieldset>

        <script>
          var select = document.getElementById("sliderSelect")
          select.addEventListener("change", function(e) {
            fetch('http://localhost:8080/pages', {method: 'GET'}).then(function(res){
              console.log(res)
              return JSON.stringify(res)
            })
            console.log(e.target.value)
            console.log(<?php echo __($this->selected_slider) ?>)
          })
        </script>

    	<?php
        wp_nonce_field('lsp_form_metabox_nonce', 'lsp_form_metabox_process');
    }

    public static function lsp_save_slider_box($post_id, $post)
    {
        // Verify that our security field exists. If not, bail.
        if (!isset($_POST['lsp_form_metabox_process'])) {
            return;
        }
        // Verify data came from edit/dashboard screen
        if (!wp_verify_nonce($_POST['lsp_form_metabox_process'], 'lsp_form_metabox_nonce')) {
            return $post->ID;
        }
        if (!current_user_can('edit_post', $post->ID)) {
            return $post->ID;
        }
        if (!isset($_POST['lsp_slider_meta_box'])) {
            return $post->ID;
        }
        /**
         * Sanitize the submitted data
         * This keeps malicious code out of our database.
         * `wp_filter_post_kses` strips our dangerous server values
         * and allows through anything you can include a post.
         */
        $sanitized = wp_filter_post_kses($_POST['lsp_slider_meta_box']);
        update_post_meta($post->ID, 'lsp', $sanitized);
    }

    public static function lsp_save_revisions($post_id)
    {
        $parent_id = wp_is_post_revision($post_id);
        if ($parent_id) {
            $parent = get_post($parent_id);
            $details = get_post_meta($parent->ID, 'lsp', true);
            if (!empty($details)) {
                add_metadata('post', $post_id, 'lsp', $details);
            }
        }
    }

    public static function lsp_restore_revisions($post_id, $revision_id)
    {
        $post = get_post($post_id);
        $revision = get_post($revision_id);
        $details = get_metadata('post', $revision->ID, 'lsp', true);
        update_post_meta($post_id, 'lsp', $details);
    }

    public static function slider_shortcode()
    {
        return "<div id='test'></div>";
    }
}

add_action('add_meta_boxes', 'LSPSliderBox::lsp_add_slider_box');
add_action('save_post', 'LSPSliderBox::lsp_save_slider_box', 1, 2);
add_action('save_post', 'LSPSliderBox::lsp_save_revisions');
add_action('wp_restore_post_revision', 'LSPSliderBox::lsp_restore_revisions', 10, 2);
add_shortcode('slider', 'LSPSliderBox::slider_shortcode');
