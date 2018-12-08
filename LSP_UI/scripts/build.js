"use strict";
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

process.chdir("..");

process.on("unhandledRejection", err => {
  throw err;
});
require("../config/env");

const path = require("path");
const fs = require("fs-extra");
const webpack = require("webpack");
const webpackConfig = require("../config/webpack.config.prod");
const paths = require("../config/paths");

fs.emptyDirSync(paths.appDistServer);
fs.emptyDirSync(paths.appDistPublic);
// fs.copySync(paths.appAssets, paths.appDistPublic, { dereference: true })

fs.writeFileSync(
  path.resolve(paths.appDir, "server.conf"),
  `server {
root ${process.env.SITE_ROOT};
server_name ${process.env.LSP_URL} www.${process.env.LSP_URL};

location / {
proxy_pass http://${process.env.SERVER_IP}:${process.env.LSP_RENDER_PORT};
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;
proxy_buffering on;
proxy_buffer_size 1k;
proxy_buffers 24 4k;
proxy_busy_buffers_size 8k;
proxy_max_temp_file_size 2048m;
proxy_temp_file_write_size 32k;
proxy_cache_revalidate on;
proxy_cache_use_stale error timeout updating http_500 http_502
                      http_503 http_504;
proxy_cache_background_update on;
proxy_cache_lock on;
}

location /lsp-api {
proxy_pass http://${process.env.SERVER_IP}:${process.env.LSP_DATA_PORT};
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;
proxy_buffering on;
proxy_buffer_size 1k;
proxy_buffers 24 4k;
proxy_busy_buffers_size 8k;
proxy_max_temp_file_size 2048m;
proxy_temp_file_write_size 32k;
proxy_cache_revalidate on;
proxy_cache_use_stale error timeout updating http_500 http_502
                      http_503 http_504;
proxy_cache_background_update on;
proxy_cache_lock on;
}

listen 443 ssl; # managed by Certbot
ssl_certificate /etc/letsencrypt/live/${process.env.LSP_URL}/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/${process.env.LSP_URL}/privkey.pem;
include /etc/letsencrypt/options-ssl-nginx.conf;
ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
if ($host = www.${process.env.LSP_URL}) {
    return 301 https://$host$request_uri;
}

if ($host = ${process.env.LSP_URL}) {
    return 301 https://$host$request_uri;
}

    server_name ${process.env.LSP_URL} www.${process.env.LSP_URL};
listen 80;
return 404;
}`
);

webpack(webpackConfig, (err, stats) => {
  if (err) throw err;
  console.log(stats.toString({ colors: true }));
});
