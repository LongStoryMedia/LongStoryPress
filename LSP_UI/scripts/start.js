"use strict";
process.env.NODE_ENV = "development";
process.chdir("..");
process.on("unhandledRejection", err => {
  throw err;
});

const fs = require("fs-extra");
const path = require("path");
const paths = require("../config/paths");
const os = require("os");
const localWP = process.argv.includes("--local-wp");

const nets = os.networkInterfaces();
const netKeys = Object.keys(nets);
const localNet = netKeys.filter(
  key =>
    !/^lo/.test(key) && !/^vE/.test(key) && nets[key].address !== "127.0.0.1"
);
const wifi = localNet.filter(key => /wifi/.test(key));
const selectedInterface = Boolean(wifi[0]) ? wifi[0] : localNet[0];
process.stdout.write("\x1b[2J");
console.log("available network interfaces: ", netKeys);
console.log("selected network interface: ", selectedInterface);
const localServerAddress = nets[selectedInterface].filter(
  net => net.family === "IPv4"
)[0].address;

require("../config/env");
process.env.LSP_LAN_IP = localServerAddress;
process.env.NODE_PATH = path.resolve(process.env.LSP_URL);
if (localWP) {
  process.env.LSP_ADMIN = `http://localhost:9999`;
  process.env.LSP_WP_SITE_NAME = "localhost";
} else {
  process.env.LSP_ADMIN = `https://${process.env.LSP_URL.split(".")[0]}.${
    process.env.LSP_WP_MAIN_SITE
  }`;
  process.env.LSP_WP_SITE_NAME = process.env.LSP_URL.split(".")[0];
}
process.env.LSP_URL_PROTOCOL = `http://${
  localServerAddress ? localServerAddress : "localhost"
}:${process.env.LSP_DEV_PORT}`;

const { fork } = require("child_process");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
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
  maxModules: 1500,
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
  public: `localhost:${process.env.LSP_DEV_PORT}`,
  noInfo: true,
  historyApiFallback: true,
  open: true,
  proxy: {
    "/lsp-api": {
      target: `http://localhost:${process.env.LSP_DATA_PORT}`
    },
    "/": {
      target: `http://localhost:${process.env.LSP_RENDER_PORT}`
    }
  },
  stats: STATS,
  after: function() {
    console.log("empty public");
    fs.emptyDirSync(paths.appPublic);
    console.log("empty server");
    fs.emptyDirSync(paths.appServer);
    fs.ensureDirSync(paths.appPublic, "static");
    fs.copySync(paths.appStatic, path.resolve(paths.appPublic, "static"));
    fs.copySync(paths.globalStatic, path.resolve(paths.appPublic, "static"));
    fs.readdir(
      path.resolve(paths.appPublic, "static"),
      { encoding: "utf8" },
      (err, files) => {
        if (err) throw new Error(err);
        files.forEach(file => {
          if (file.split(".").pop() === "scss")
            fs.removeSync(path.resolve(paths.appPublic, `static/${file}`));
          if (file === "sw.js")
            fs.moveSync(
              path.resolve(paths.appPublic, `static/${file}`),
              path.resolve(paths.appPublic, file)
            );
        });
      }
    );
    if (localWP) fork(path.join(paths.appScripts, "runwp.js"));
  }
};

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
    `,
    chalk`
    wp-admin at {blue.underline ${process.env.LSP_ADMIN}}
    `
  );
});

["SIGTERM", "SIGINT"].forEach(sig =>
  process.on(sig, e => {
    // process.stdout.write("\x1b[2J");
    console.log(
      chalk`
      {green process emmitted signal ${e}. shutting down dev server ...}
      `
    );

    if (renderServer) process.kill(renderServer.pid, "SIGINT");
    if (dataServer) process.kill(dataServer.pid, "SIGINT");

    console.log(
      chalk`
      {cyan gracefully shutting down servers ...}
      `
    );
    process.exit();
  })
);
process.on("exit", code => {
  console.log(`exiting with code: ${code}`);
});
