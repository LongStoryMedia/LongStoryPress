<?php

function taxonomy_checklist_checked_ontop_filter($args)
{
    $args['checked_ontop'] = false;
    return $args;
}

add_filter('wp_terms_checklist_args', 'taxonomy_checklist_checked_ontop_filter');
