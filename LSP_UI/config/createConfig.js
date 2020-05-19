const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require("webpack-manifest-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const paths = require("./paths");
const devMode = process.env.NODE_ENV === "development";

const rules = [
  {
    test: /\.(m?jsx?)$/,
    enforce: "pre",
    use: require.resolve("eslint-loader"),
    include: paths.appRoot
  }
];

const babelLoader = {
  test: /\.(m?jsx?)$/,
  loader: require.resolve("babel-loader"),
  options: {
    cwd: paths.appRoot,
    root: paths.appRoot,
    configFile: path.resolve(paths.appRoot, "babel.config.js")
  }
};

module.exports = (name, customPlugins, shouldWatch) => {
  let nodeFields,
    outputPath,
    loaderRules,
    customOptimization,
    devTool,
    customWatchOptions;
  if (name !== "client") {
    nodeFields = { externals: [nodeExternals()], target: "node" };
    devTool = devMode ? "cheap-module-source-map" : "";
    customWatchOptions = {};
    outputPath = devMode ? paths.appServer : paths.appDistServer;
    loaderRules = rules.concat([
      {
        oneOf: [
          babelLoader,
          {
            test: /\.(bmp|gif|jpe?g|png)$/,
            loader: "url-loader?emitFile=false",
            options: {
              emitFile: false
            }
          },
          {
            test: /\.s?(c|a)ss$/,
            use: [
              {
                loader: "css-loader/locals",
                options: {
                  modules: true,
                  localIdentName: "[name]__[local]__[hash:base64:5]"
                }
              },
              require.resolve("sass-loader")
            ]
          },
          {
            test: /\.svg$/,
            loader: "raw-loader?emitFile=false"
          },
          {
            exclude: [/\.(s?(c|a)ss|bmp|gif|jpe?g|svg|png)$/],
            loader: "file-loader?emitFile=false"
          }
        ]
      }
    ]);
  } else {
    nodeFields = {
      node: {
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty"
      },
      target: "web"
    };
    devTool = devMode ? "cheap-module-source-map" : "";
    customWatchOptions = {
      aggregateTimeout: 2000
    };
    customOptimization = {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: false,
          uglifyOptions: {
            compress: {
              inline: false
            }
          }
        })
      ],
      runtimeChunk: false,
      splitChunks: {
        chunks: "all",
        maxSize: 300000,
        minSize: 5000,
        maxAsyncRequests: Infinity,
        maxInitialRequests: Infinity
      }
    };
    outputPath = devMode ? paths.appPublic : paths.appDistPublic;
    loaderRules = rules.concat([
      {
        oneOf: [
          babelLoader,
          {
            test: /\.(bmp|gif|jpe?g|png)$/,
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "static/images/[name].[hash:8].[ext]"
            }
          },
          {
            test: /\.s(c|a)ss$/,
            use: [
              devMode
                ? require.resolve("style-loader")
                : MiniCssExtractPlugin.loader,
              {
                loader: require.resolve("css-loader"),
                options: {
                  modules: true,
                  importLoaders: 2,
                  sourceMap: true,
                  localIdentName: "[name]__[local]__[hash:base64:5]"
                }
              },
              {
                loader: require.resolve("postcss-loader"),
                options: {
                  plugins: [
                    require("autoprefixer"),
                    require("postcss-import"),
                    require("postcss-clean")
                  ]
                }
              },
              require.resolve("sass-loader")
            ]
          },
          {
            test: /\.css$/,
            use: [
              devMode
                ? require.resolve("style-loader")
                : MiniCssExtractPlugin.loader,
              require.resolve("css-loader"),
              {
                loader: require.resolve("postcss-loader"),
                options: {
                  plugins: devMode
                    ? [
                        require("autoprefixer"),
                        require("postcss-import"),
                        require("postcss-clean")
                      ]
                    : []
                }
              }
            ]
          },
          {
            test: /\.svg$/,
            loader: require.resolve("raw-loader")
          },
          {
            test: /\.((o|t)tf|woff2?)$/,
            loader: require.resolve("file-loader"),
            options: {
              name: "static/fonts/[name].[hash:8].[ext]"
            }
          },
          {
            exclude: [
              /\.((m|e)?js(x|on)?|html|s?(c|a)ss|bmp|gif|jpe?g|svg|png|(o|t)tf|woff2?)$/
            ],
            loader: require.resolve("file-loader"),
            options: {
              name: "static/[name].[hash:8].[ext]"
            }
          }
        ]
      }
    ]);
    if (devMode) customPlugins.push(new webpack.HotModuleReplacementPlugin());
    if (!devMode) customPlugins.push(new CompressionPlugin());
    customPlugins = customPlugins.concat([
      new MiniCssExtractPlugin({
        filename: devMode ? "[name].css" : "[name].[hash].css",
        chunkFilename: devMode ? `[name].css` : `[hash].[name].css`
      }),
      new WebpackAssetsManifest({
        writeToFileEmit: true,
        fileName: "static/manifest.json"
      }),
      new StyleLintPlugin({
        syntax: "scss"
      })
    ]);
  }
  const common = {
    ...nodeFields,
    name: name,
    devtool: devTool,
    mode: devMode ? "development" : "production",
    watch: shouldWatch,
    watchOptions: shouldWatch ? customWatchOptions : {},
    context: paths.appRoot,
    resolve: {
      alias: {
        Site: path.resolve(process.env.LSP_URL, "src"),
        LSP: path.resolve(paths.appRoot, "src/shared")
      }
    },
    entry: [
      require.resolve("babel-polyfill"),
      path.resolve(paths.appSrc, `${name}/index.js`)
    ],
    output: {
      path: outputPath,
      filename: devMode ? `${name}.[name].js` : `${name}.[hash].[name].js`,
      chunkFilename: devMode ? `${name}.[name].js` : `${name}.[hash].[name].js`,
      publicPath: `/`
    },
    module: {
      rules: loaderRules
    },
    plugins: customPlugins
  };
  let client = {},
    server = {};
  if (name === "client") client = { optimization: customOptimization };
  return { ...common, ...client, ...server };
};
