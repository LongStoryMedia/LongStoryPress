"use strict";
process.env.NODE_ENV = "development";
process.chdir("../");
process.on("unhandledRejection", err => {
  throw err;
});

const fs = require("fs-extra");
const path = require("path");
const paths = require("../config/paths");
const os = require("os");

const {
  LSP_HOST,
  LSP_URL,
  LSP_DEV_PORT,
  LSP_RENDER_PORT,
  NODE_ENV
} = process.env;

const nets = os.networkInterfaces();
const netKeys = Object.keys(nets);
const localNet = netKeys.filter(
  key =>
    !/^lo/.test(key) && !/^vE/.test(key) && nets[key].address !== "127.0.0.1"
);
const localServerAddress = nets[localNet[0]].filter(
  net => net.family === "IPv4"
)[0].address;

fs.writeFileSync(
  path.resolve(paths.appDir, `.env.build.${NODE_ENV}`),
  `LSP_LAN_IP=${localServerAddress}\nNODE_PATH=${path.resolve(LSP_URL)}`
);

require("../config/env");

const { fork, exec } = require("child_process");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const express = require("express");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackConfig = require("../config/webpack.config.dev");
const chalk = require("chalk");

let dataServer, renderServer;

const STATS = {
  all: undefined,
  assets: false,
  assetsSort: "size",
  builtAt: false,
  cached: false,
  cachedAssets: false,
  children: false,
  chunks: false,
  chunkGroups: false,
  chunkModules: false,
  chunkOrigins: false,
  chunksSort: "size",
  colors: true,
  depth: false,
  entrypoints: false,
  env: false,
  errors: true,
  errorDetails: true,
  hash: false,
  maxModules: 15,
  modules: false,
  modulesSort: "size",
  moduleTrace: false,
  performance: false,
  providedExports: false,
  publicPath: false,
  reasons: false,
  source: false,
  timings: false,
  usedExports: false,
  version: false,
  warnings: true
};

const options = {
  hot: true,
  host: process.env.LSP_HOST,
  port: process.env.LSP_DEV_PORT,
  noInfo: true,
  proxy: {
    "/": {
      target: `
        http://localhost:${process.env.LSP_RENDER_PORT}
      `
    }
  },
  stats: STATS,
  after: function() {
    console.log("empty public");
    fs.emptyDirSync(paths.appServer);
    console.log("empty server");
    fs.emptyDirSync(paths.appPublic);
  }
};

exec("cd .. && lsp-start", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  chalk`
    {blue stdout: ${stdout}}\n
    `;
  console.log(`stderr: ${stderr}`);
});

webpack(webpackConfig.engines, (err, stats) => {
  if (err) throw err;
  if (!renderServer || !dataServer) {
    renderServer = fork(path.join(paths.appScripts, `runssr.js`));
    dataServer = fork(path.join(paths.appScripts, `runapi.js`));
  }
});

webpackDevServer.addDevServerEntrypoints(webpackConfig.devServer, options);
const compiler = webpack(webpackConfig.devServer);
const server = new webpackDevServer(compiler, options);

server.listen(options.port, options.host, err => {
  if (err) console.log(err);
  console.log(
    chalk`
    view app at {green.underline http://localhost:${process.env.LSP_DEV_PORT}}
    or in LAN at {green.underline http://${localServerAddress}:${
      process.env.LSP_DEV_PORT
    }}
    `
  );
});

["SIGINT", "SIGTERM"].forEach(sig => {
  process.on(sig, () => {
    server.close();
    process.exit();
  });
});
process.stdin.on("data", function(data) {
  process.stdout.write(data);
});
