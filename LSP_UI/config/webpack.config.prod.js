const webpack = require("webpack");
const createConfig = require("./createConfig").default;
const fs = require("fs-extra");
const path = require("path");
const paths = require("./paths");
const env = require("./env")(paths.appRoot);

module.exports = {
  all: [
    createConfig(
      "client",
      [
        new webpack.DefinePlugin({ __isBrowser__: true }),
        new webpack.DefinePlugin(env.stringified)
      ],
      false
    ),
    createConfig(
      "render-server",
      [
        new webpack.DefinePlugin({ __isBrowser__: false }),
        new webpack.DefinePlugin(env.stringified)
      ],
      false
    ),
    createConfig(
      "data-server",
      [new webpack.DefinePlugin({ __isBrowser__: false })],
      false
    )
  ],
  client: [
    createConfig(
      "client",
      [
        new webpack.DefinePlugin({ __isBrowser__: true }),
        new webpack.DefinePlugin(env.stringified)
      ],
      false
    )
  ],
  ssr: [
    createConfig(
      "render-server",
      [
        new webpack.DefinePlugin({ __isBrowser__: false }),
        new webpack.DefinePlugin(env.stringified)
      ],
      false
    )
  ],
  api: [
    createConfig(
      "data-server",
      [new webpack.DefinePlugin({ __isBrowser__: false })],
      false
    )
  ]
};
