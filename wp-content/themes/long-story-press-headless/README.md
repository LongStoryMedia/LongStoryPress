# long-story-press-headless

Very simple WP theme exclusively for admin. It has some custom APIs for site settings (contact, theme colors, mission statement, etc.) that are routed to the WP rest API, optional sliders to add to specific pages (this is a work in progress), and one additional post type (tutorials).

The rest are functions to handle CORS, and rest API routing. This is to be coupled with [LSP_UI](https://github.com/LongStoryMedia/LSP_UI), which contains the headless frontend theme and a [Node.js](https://nodejs.org/en/) API server with nginx as the reverse proxy and WP server.

The additional REST API through node (rather than directly calling WP REST API) is so that the WooCommerce API can be used in the frontend theme without exposing API keys (see [https://github.com/woocommerce/woocommerce/issues/19256](https://github.com/woocommerce/woocommerce/issues/19256)).

full repo [here](https://github.com/LongStoryMedia/LongStoryPress)
