import express from "express";
import cors from "cors";
import path from "path";
import React from "react";
import chalk from "chalk";
import { renderToNodeStream } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import serialize from "serialize-javascript";
import compression from "compression";
import { preloadAll } from "react-loadable";
import fetch from "isomorphic-fetch";
import { HelmetProvider } from "react-helmet-async";
import _$ from "long-story-library";
import App from "../shared/App";
import routes from "Site/routes";
import paths from "../../config/paths";
import { removeMarkup, filterManifest } from "../shared/utils/helpers";

const app = express();
const publicDir =
  process.env.NODE_ENV !== "development"
    ? path.resolve(paths.appRoot, process.env.LSP_URL, "dist", "public")
    : path.resolve(paths.appRoot, process.env.LSP_URL, "public");
const isEmpty = (obj) =>
  !!(Object.entries(obj).length === 0 && obj.constructor === Object);

app.use(cors());
app.use(compression());
app.use(express.static(publicDir, { maxAge: 365 * 24 * 3600000 }));

const manifestPath = `/static/manifest.json`;
const colorsJSON = `${process.env.LSP_ADMIN}/${process.env.LSP_WP_SITE_NAME}-assets/colors.json`;

app.get("/site.webmanifest", (req, res) => {
  fetch(colorsJSON)
    .then((colors) => colors.json())
    .then((clr) => {
      res.json({
        name: process.env.LSP_SITE_NAME,
        short_name: process.env.SITE_ACRONYM,
        icons: [
          {
            src: "/static/icon/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/static/icon/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        theme_color: clr.primary_color,
        background_color: clr.background_one,
        display: "fullscreen",
      });
    });
});

app.get("/browserconfig.xml", (req, res) => {
  fetch(colorsJSON)
    .then((colors) => colors.json())
    .then((clr) => {
      res.send(`<?xml version="1.0" encoding="utf-8"?>
      <browserconfig>
          <msapplication>
              <tile>
                  <square150x150logo src="/static/icon/mstile-150x150.png"/>
                  <TileColor>${clr.primary_color}</TileColor>
              </tile>
          </msapplication>
      </browserconfig>`);
    });
});

app.get("*", async (req, res) => {
  const activeRoute = routes.find((route) => matchPath(req.path, route)) || {};
  // fetchInitialData only cares about the last param
  // the rest can be constructed in ../shared/routes
  const lastParam = req.path.split("/").pop();
  // build querystring
  const reqParam = isEmpty(req.query)
    ? lastParam
    : `${lastParam}?${Object.keys(req.query)
        .map((key) => `${key}=${req.query[key]}`)
        .join("&")}`;

  const getContent = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(reqParam)
    : Promise.resolve();

  const manifest = await fetch(
    `${process.env.LSP_URL_PROTOCOL}${manifestPath}`
  );

  const assets = await manifest.json();

  const clsResponse = await fetch(colorsJSON);

  const colors = await clsResponse.json();
  const main = filterManifest(assets, /^(?=main~).+?\.js$/, "script");
  const bundles = filterManifest(assets, /^(?!main~).+?\.js$/, "script");
  const styles = filterManifest(assets, /.+?\.css$/, "link");

  const data = await getContent;
  const context = { data };
  const metaImg = _$(data).OBJ(
    ["body", "lsp_gallery", 0],
    _$(data).OBJ(["body", "lsp_galleries", 0, "gallery_images", 0])
  );
  const title = _$(data).OBJ(["head", "title"], "");
  const content = _$(data).OBJ(["body", "content"], "");
  const markup = renderToNodeStream(
    <HelmetProvider context={context}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
  let html = [];
  markup.on("data", (data) => {
    html = html.concat(data);
  });
  markup.on("end", () => {
    res.send(
      `<!DOCTYPE html><html><head>
      <title>${title}</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width" />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content="${title}" />
      <link rel="apple-touch-icon" sizes="180x180" href="/static/icon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/static/icon/android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/static/icon/android-chrome-512x512.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/icon/android-icon-32x32.png" />
      <link rel="icon" type="image/png" sizes="36x36" href="/static/icon/android-icon-36x36.png" />
      <link rel="icon" type="image/png" sizes="48x48" href="/static/icon/android-icon-48x48.png" />
      <link rel="icon" type="image/png" sizes="72x72" href="/static/icon/android-icon-72x72.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/static/icon/android-icon-96x96.png" />
      <link rel="icon" type="image/png" sizes="144x144" href="/static/icon/android-icon-144x144.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/icon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/icon/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/static/icon/safari-pinned-tab.svg" color="#24393f" />
      <link rel="shortcut icon" href="/static/icon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#131f32" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="theme-color" content="${colors.primary_color}" />
      <meta name="twitter:image" content="${_$(metaImg).OBJ(["src"])}"/>
      <meta name="og:image" content="${_$(metaImg).OBJ(["src"])}"/>
      <meta property="og:image:type" content="${_$(metaImg).OBJ([
        "mime_type",
      ])}"/>
      <meta property="og:description" content="${removeMarkup(content).slice(
        0,
        248
      )}..." />
      <link href="${process.env.LSP_ADMIN}/${
        process.env.LSP_WP_SITE_NAME
      }-assets/colors.css" rel="stylesheet" />
      ${styles}
      </head>
      <body class="background_backdrop color_text_color">
      <div id="app">${html}</div>
      <script>window.__INITIAL_DATA__=${serialize(data)}</script>
      ${bundles}
      ${main}
      <script>
      if('serviceWorker' in navigator){
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js?manifestPath=${encodeURIComponent(
            manifestPath
          )}',{scope:'/'})
          .then(function(registration){
            console.log("service worker registered. scope:", registration.scope)
          })
          .catch(function(err){
            console.log("there was an error registering service worker:", err)
          });
        });
      }
      </script>
      </body>
      </html>`
    );
  });
});

export default preloadAll()
  .then(() => {
    app.listen(process.env.LSP_RENDER_PORT, () => {
      console.log(
        chalk`{bold.red SSR} is listening on port {cyan.underline ${process.env.LSP_RENDER_PORT}}`
      );
    });
  })
  .catch((err) => err && console.log(err));
