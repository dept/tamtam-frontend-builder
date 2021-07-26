const fs = require('fs')
const resolveApp = require('./utils/resolve-app')

const createAliasObject = require('./webpack/create-alias-object')
const createBabelLoaderConfig = require('./webpack/create-babel-loader-config')

const ESLintPlugin = require('eslint-webpack-plugin')
const WebpackBar = require('webpackbar');
const CopyPlugin = require('copy-webpack-plugin');
const SassLintPlugin = require('sass-lint-webpack');
const config = require('./utils/get-config')

const extendFilePath = resolveApp('webpack.extend.js')
const hasExtendFile = fs.existsSync(extendFilePath)

const babelPlugins = [
  '@babel/syntax-dynamic-import',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-proposal-optional-chaining',
]
console.log(resolveApp('source/sass/**/*.scss'))


let webpackConfig = {
  mode:  'development',
  context: resolveApp(),
  entry: {
    'main': './source/javascript/main',
  },
  output: {
    path: resolveApp('source/javascript'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    alias: createAliasObject(),
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  resolveLoader: {
    modules: [`${__dirname}/../../node_modules`],
  },
  module: {
    rules: createBabelLoaderConfig(babelPlugins),
  },
  plugins:[
    new ESLintPlugin({
      context: resolveApp(''),
      emitWarning: true
    }),
    new WebpackBar(),
    new SassLintPlugin({
      files: [
        resolveApp('source/sass/**/*.scss'),
        resolveApp('components/**/*.scss'),
      ].join(','),
      configPath: resolveApp('.sass-lint.yml')
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
