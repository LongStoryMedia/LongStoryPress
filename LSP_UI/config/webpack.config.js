const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const createConfig = require('./createConfig')
const paths = require('./paths')
const env = require('./env')(paths.appRoot)

module.exports = [
  createConfig('render-server', [new webpack.DefinePlugin({ __isBrowser__: false })]),
  createConfig('data-server', [new webpack.DefinePlugin({ __isBrowser__: false })]),
  createConfig('client', [
    new CleanWebpackPlugin([paths.appPublic, paths.appServer], { root: paths.appRoot }),
    new webpack.DefinePlugin({ __isBrowser__: true }),
    new webpack.DefinePlugin(env.stringified),
    new CompressionPlugin()
  ])
]
