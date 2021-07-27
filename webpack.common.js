const fs = require('fs')
const resolveApp = require('./utils/resolve-app')

const config = require('./utils/get-config')

const createAliasObject = require('./webpack/create-alias-object')
const configureBabelLoader = require('./webpack/loaders/babel')
const configureNunjucksPlugin = require('./webpack/loaders/nunjucks')

const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const CopyPlugin = require('copy-webpack-plugin');
const SassLintPlugin = require('sass-lint-webpack');
const configureCSSLoader = require('./webpack/loaders/style')

const extendFilePath = resolveApp('webpack.extend.js')
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
    path: config.clientDist,
    publicPath: config.publicPath,
  },
  stats:{
    // children: true,
    errorDetails: true
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
    ],
  },
  plugins:[
    new WebpackBar(),
    // new webpack.ProvidePlugin({
    //   process: 'process/browser',
    // }),
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


// console.log(JSON.stringify(webpackConfig))

module.exports = webpackConfig
