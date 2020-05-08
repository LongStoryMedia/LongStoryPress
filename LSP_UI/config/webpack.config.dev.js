const webpack = require("webpack");
const path = require("path");
const fs = require("fs-extra");
const createConfig = require("./createConfig");
const paths = require("./paths");
const env = require("./env")(paths.appRoot);

module.exports = {
  devServer: createConfig(
    "client",
    [
      new webpack.DefinePlugin({ __isBrowser__: true }),
      new webpack.DefinePlugin(env.stringified)
    ],
    true
  ),
  engines: [
    createConfig(
      "render-server",
      [
        new webpack.DefinePlugin({ __isBrowser__: false }),
        new webpack.DefinePlugin(env.stringified)
      ],
      true
    ),
    createConfig(
      "data-server",
      [new webpack.DefinePlugin({ __isBrowser__: false })],
      true
    )
  ]
};
