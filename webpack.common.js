const fs = require('fs')

const resolveApp = require('./utils/resolve-app')
const config = require('./utils/get-config')

const configureBabelLoader = require('./webpack/loaders/babel')
const configureCSSLoader = require('./webpack/loaders/style')

const WebpackBar = require('webpackbar')
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const configureNunjucksPlugin = require('./webpack/plugins/nunjucks')
const InjectComponentsCSSPlugin = require('./webpack/plugins/inject-components-css')
const DonePlugin = require('./webpack/plugins/done')
const resolveAliases = require('./webpack/resolveAliases')

const extendFilePath = resolveApp('webpack.common.js')
const hasExtendFile = fs.existsSync(extendFilePath)

let webpackConfig = {
  mode: 'development',
  context: resolveApp(),
  entry: {
    main: './index',
    critical: './source/sass/critical.scss',
    dev: './source/sass/_dev/dev.scss',
  },
  output: {
    filename: `${config.jsOutputPath}/[name].js`,
    chunkFilename: `${config.jsOutputPath}/chunks/[name].[contenthash].js`,
    path: config.dist,
    publicPath: config.publicPath,
  },
  stats: {
    colors: true,
  },
  resolve: {
    alias: resolveAliases(),
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  resolveLoader: {
    modules: [resolveApp('/node_modules')],
  },
  module: {
    rules: [
      ...configureBabelLoader(),
      {
        test: /\.(woff2?|ttf|otf|eot|svg|jpe?g|png|gif|webp)$/,
        type: 'asset/resource',
      },
      ...configureCSSLoader(),
    ],
  },
  plugins: [
    new WebpackBar(),
    // This plugin is needed due to Webpack 5 not always exiting properly when done building
    new DonePlugin(),
    new InjectComponentsCSSPlugin({
      sourcePath: `${config.styles}/*.scss`,
      componentsPath: config.components,
      start: '/* components:scss */',
      end: '/* endinject */',
    }),
    new MiniCssExtractPlugin({
      filename: `${config.cssOutputPath}/[name].css`,
      chunkFilename: `${config.cssOutputPath}/chunks/[name].[contenthash].css`,
    }),
    configureNunjucksPlugin(),
    new ESLintPlugin({
      context: resolveApp(''),
      emitWarning: true,
    }),
    new StylelintPlugin({
      configFile: resolveApp('stylelint.config.js'),
      files: [resolveApp('source/**/*.scss')].join(','),
    }),
    new CopyPlugin({
      patterns: config.copy || [],
    }),
  ],
}

if (hasExtendFile) {
  require(extendFilePath)(webpackConfig)
}

module.exports = webpackConfig
