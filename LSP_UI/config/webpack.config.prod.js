const webpack = require('webpack')
const createConfig = require('./createConfig')
const fs = require('fs-extra')
const path = require('path')
const paths = require('./paths')
const env = require('./env')(paths.appRoot)

module.exports = [
  createConfig('client', [
    new webpack.DefinePlugin({ __isBrowser__: true }),
    new webpack.DefinePlugin(env.stringified)
  ], false),
  createConfig('render-server', [new webpack.DefinePlugin({ __isBrowser__: false })], false),
  createConfig('data-server', [new webpack.DefinePlugin({ __isBrowser__: false })], false)
]
