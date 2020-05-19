import { DefinePlugin } from 'webpack'
import CompressionPlugin from 'compression-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import createConfig from './createConfig'
import { appRoot, appPublic, appServer } from './paths'
const env = require('./env')(appRoot)

export default [
  createConfig('render-server', [new DefinePlugin({ __isBrowser__: false })]),
  createConfig('data-server', [new DefinePlugin({ __isBrowser__: false })]),
  createConfig('client', [
    new CleanWebpackPlugin([appPublic, appServer], { root: appRoot }),
    new DefinePlugin({ __isBrowser__: true }),
    new DefinePlugin(env.stringified),
    new CompressionPlugin()
  ])
]
