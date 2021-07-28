const fs = require('fs')
const resolveApp = require('./utils/resolve-app')

const config = require('./utils/get-config')

const createAliasObject = require('./webpack/create-alias-object')
const configureBabelLoader = require('./webpack/loaders/babel')
const configureCSSLoader = require('./webpack/loaders/style')

const WebpackBarPlugin = require('webpackbar');
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const SassLintPlugin = require('sass-lint-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const configureNunjucksPlugin = require('./webpack/plugins/nunjucks')

const extendFilePath = resolveApp('webpack.common.js')
const hasExtendFile = fs.existsSync(extendFilePath)

const babelPlugins = [
  '@babel/syntax-dynamic-import',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-proposal-optional-chaining',
]

let webpackConfig = {
  mode:  'development',
  context: resolveApp(),
  entry: {
    'main': './index',
    'critical': './source/sass/critical.scss',
  },
  output: {
    filename: `.${config.jsOutputPath}/[name].js`,
    path: config.dist,
    publicPath: config.publicPath,
  },
  stats:{
    colors: true
  },
  resolve: {
    alias: createAliasObject(),
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  resolveLoader: {
    modules: [resolveApp('/node_modules')],
  },
  module: {
    rules: [
      ...configureBabelLoader(babelPlugins),
      ...configureCSSLoader(),
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        type: "asset",
      },
    ],
  },
  plugins:[
    new CleanWebpackPlugin(),
    new WebpackBarPlugin(),
    configureNunjucksPlugin(),
    new ESLintPlugin({
      context: resolveApp(''),
      emitWarning: true
    }),
    new SassLintPlugin({
      files: [
        resolveApp('source/sass/**/*.scss'),
        resolveApp('components/**/*.scss'),
      ].join(','),
      configPath: resolveApp('.sass-lint.yml')
    }),
    new MiniCssExtractPlugin({
      filename: `.${config.cssOutputPath}/[name].css`,
    }),
    new CopyPlugin({
      patterns: config.copy || []
    }),
  ]
}

if (hasExtendFile) {
  require(extendFilePath)(webpackConfig)
}

module.exports = webpackConfig
