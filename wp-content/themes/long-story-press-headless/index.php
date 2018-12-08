<script>
var _pointElsewhere = '<?php echo get_home_url(null, 'wp-admin', null) ?>'
</script>
<meta content="0; URL=_pointElsewhere" http-equiv="refresh">
<!--

$args = array(
    'post_type'      => 'page',
    'posts_per_page' => -1,
    'post_parent'    => $post->ID,
    'order'          => 'ASC',
    'orderby'        => 'menu_order'
 );


$parent = new WP_Query( $args );

  if ( $parent->have_posts() ) :
  while ( $parent->have_posts() ) : $parent->the_post();
// Redirect individual post and pages to the REST API endpoint
//if ( is_single() ) {
	// header( 'Location: /wp-admin/' );
//} elseif ( is_page() ) {
//	header( 'Location: /wp-json/wp/v2/pages/' . get_queried_object()->ID );
//} else {
//	header( 'Location: /wp-json/' );
//}

just in case the meta tag is not read properly, here is plan B: a JS redirect -->
<script type="text/javascript">
  window.location = _pointElsewhere;
</script>
