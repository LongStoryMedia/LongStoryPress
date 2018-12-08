import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs-extra";
import React from "react";
import chalk from "chalk";
import { renderToNodeStream } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import serialize from "serialize-javascript";
import compression from "compression";
import { preloadAll } from "react-loadable";
import App from "../shared/App";
import routes from "../shared/routes";
import config from "../shared/config";

const app = express();
const staticFiles = process.env.NODE_ENV !== "production"
  ? path.resolve(process.cwd(), config.url, "public")
  : path.resolve(process.cwd(), config.url, "dist/public");

app.use(cors());
app.use(compression());
app.use(express.static(staticFiles));

app.get("*", (req, res, next) => {
  const activeRoute = routes.find(route => matchPath(req.url, route)) || {};
  // fetchInitialData only cares about the last parameter
  // the rest can be constructed in ../shared/routes
  const reqParam = req.url.split("/").pop();
  const getContent = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(reqParam)
    : Promise.resolve();

  getContent
    .then(data => {
      const context = { data };
      const ssr = (
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      );
      const markup = renderToNodeStream(ssr);
      const manifest = fs.createReadStream(
        path.resolve(staticFiles, "manifest.json"),
        "utf-8"
      );
      let jTags, cTags;
      const filterManifest = (manifest, regExp, writeString) =>
        Object.values(JSON.parse(manifest))
          .map(fileName => {
            if (regExp.test(fileName)) return writeString(fileName);
            return "";
          })
          .join("");
      const readStream = stream =>
        new Promise((resolve, reject) => {
          const content = [];
          stream.on("data", chunk =>
            content.push(Buffer.from(chunk, "base64"))
          );
          stream.on("end", () => resolve(Buffer.concat(content).toString()));
          stream.on("error", reject);
        });
      manifest.on("data", data => {
        jTags = filterManifest(
          data,
          /.+?\.js$/,
          script => `<script src="${script}" defer async></script>`
        );
        cTags = filterManifest(
          data,
          /.+?\.css$/,
          css => `<link rel="stylesheet" href="${css}" />`
        );
      });
      manifest.on("end", () => {
        readStream(markup)
          .then(html => {
            res.send(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>LSP</title>
                ${cTags}
              </head>
              <body>
                <div id="app">${html}</div>
                ${jTags}
                <script>window.__INITIAL_DATA__=${serialize(data)}</script>
              </body>
            </html>
            `);
          })
          .catch(err => new Error(err));
      });
    })
    .catch(err => new Error(err));
});

export default preloadAll().then(() => {
  app.listen(config.ssrPort, () => {
    console.log(
      chalk`{bold.red SSR} is listening on port {cyan.underline ${
        process.env.LSP_RENDER_PORT
      }}`
    );
  });
});
