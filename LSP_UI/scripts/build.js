"use strict";
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

process.chdir("..");

process.on("unhandledRejection", err => {
  throw err;
});
require("../config/env");

process.env.LSP_WP_SITE_NAME = process.env.LSP_URL.split(".")[0];

const path = require("path");
const fs = require("fs-extra");
const webpack = require("webpack");
const webpackConfig = require("../config/webpack.config.prod");
const paths = require("../config/paths");

const config =
  !process.argv[2] || process.argv[2] === "ssl"
    ? webpackConfig.all
    : webpackConfig[process.argv[2]];

process.env.LSP_WP_SITE_NAME = process.env.LSP_URL.split(".")[0];
process.env.NODE_PATH = `${path.resolve(process.env.LSP_URL)}`;

(!process.argv[2] || process.argv[2] === "ssl") &&
  fs.emptyDirSync(paths.appDistServer);
(!process.argv[2] || process.argv[2] === "ssl") &&
  fs.emptyDirSync(paths.appDistPublic);
fs.ensureDirSync(paths.appDistPublic, "static");
fs.copySync(paths.appStatic, path.resolve(paths.appDistPublic, "static"), {
  dereference: true
});
fs.copySync(paths.globalStatic, path.resolve(paths.appDistPublic, "static"));
fs.readdir(
  path.resolve(paths.appDistPublic, "static"),
  { encoding: "utf8" },
  (err, files) => {
    if (err) throw new Error(err);
    files.forEach(file => {
      if (file.split(".").pop() === "scss")
        fs.removeSync(path.resolve(paths.appDistPublic, `static/${file}`));
      if (file === "sw.js")
        fs.moveSync(
          path.resolve(paths.appDistPublic, `static/${file}`),
          path.resolve(paths.appDistPublic, file)
        );
    });
  }
);

const proxySettings = `
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
  proxy_cache_use_stale error timeout updating http_500 http_502  http_503 http_504;
  proxy_cache_background_update on;
  proxy_cache_lock on;
`;

const cert = `
  listen [::]:443 ssl http2;
  listen 443 ssl http2;
  ssl_certificate ${process.env.SSL_FULLCHAIN};
  ssl_certificate_key ${process.env.SSL_PRIVKEY};
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
`;

const sslRedirect = `
server {
  if ($host = www.${process.env.LSP_URL}) {
    return 301 https://$host$request_uri;
  }

  if ($host = ${process.env.LSP_URL}) {
    return 301 https://$host$request_uri;
  }

  server_name ${process.env.LSP_URL} www.${process.env.LSP_URL};
  listen 80;
  listen [::]:80;
  return 404;
}`;

fs.writeFileSync(
  path.resolve(paths.appRoot, "..", `${process.env.LSP_URL}.nginx.conf`),
  `server {
    server_name ${process.env.LSP_URL} www.${process.env.LSP_URL};

    location / {
      proxy_pass http://${process.env.LSP_HOST}:${process.env.LSP_RENDER_PORT};
      ${proxySettings}
    }

    location /lsp-api {
      proxy_pass http://${process.env.LSP_HOST}:${process.env.LSP_DATA_PORT};
      ${proxySettings}
    }

    location ~\.((ht|x)ml|js(x|on)?|png|jpg|(g|t)iff?|ico|svg|s?(c|a)ss|mp(3|4)|pdf|ogg|wav|m4a) {
      root ${process.env.LSP_ROOT}/${process.env.LSP_URL}/dist/public;
    }

    ${process.argv[2] === "ssl" ? cert : "listen 80;"}
  }

  ${process.argv[2] === "ssl" ? sslRedirect : ""}`
);

webpack(config, (err, stats) => {
  if (err) throw err;
  console.log(stats.toString({ colors: true }));

  if (
    (process.argv[2] !== "client" && !process.argv[3]) ||
    (process.argv[3] && process.argv[3] !== "client")
  ) {
    fs.readdir(paths.appDistServer, { encoding: "utf-8" }, (err, files) => {
      let startAPI, startSSR;
      files.forEach(file => {
        if (/render-server.+?\.main\.js/.test(file)) startSSR = file;
        if (/data-server.+?\.main\.js/.test(file)) startAPI = file;
      });
      const apiName = `${process.env.SITE_ACRONYM}-api,port:${
        process.env.LSP_DATA_PORT
      }`;
      const ssrName = `${process.env.SITE_ACRONYM}-ssr,port:${
        process.env.LSP_RENDER_PORT
      }`;

      if (
        !process.argv[2] ||
        process.argv[2] === "api" ||
        (process.argv[2] === "ssl" &&
          (!process.argv[3] || process.argv[3] === "api"))
      ) {
        console.log("writing api start script");
        fs.writeFileSync(
          path.resolve(paths.appDir, `pm2-start-api`),
          `#!/bin/sh
                  pm2 delete ${apiName}
                  pm2 start ${path.resolve(
                    paths.appDistServer,
                    startAPI
                  )} --env production --name="${apiName}"
                `
        );
      }

      if (
        !process.argv[2] ||
        process.argv[2] === "ssr" ||
        (process.argv[2] === "ssl" &&
          (!process.argv[3] || process.argv[3] === "ssr"))
      ) {
        console.log("writing ssr start script");
        fs.writeFileSync(
          path.resolve(paths.appDir, `pm2-start-ssr`),
          `#!/bin/sh
                  pm2 delete ${ssrName}
                  pm2 start ${path.resolve(
                    paths.appDistServer,
                    startSSR
                  )} --env production --name="${ssrName}"
                `
        );
      }
    });
  }
});
