const path = require('path')
const fs = require('fs')
const { mergeWithCustomize, unique } = require('webpack-merge')

const resolveApp = require('./utils/resolve-app')
const config = require('./utils/get-config')

const common = require('./webpack.common.js')
const extendFilePath = resolveApp('webpack.prod.js')
const hasExtendFile = fs.existsSync(extendFilePath)

const WorkboxPlugin = require('workbox-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')

const webpackConfig = mergeWithCustomize({
  customizeArray: unique(
    'plugins',
    ['MiniCssExtractPlugin'],
    (plugin) => plugin.constructor && plugin.constructor.name,
  ),
})(common, {
  mode: 'production',
  output: {
    clean: true,
    ...(config.buildStatic
      ? {
          filename: `${config.jsOutputPath.substring(1)}/[name].[contenthash].js`,
        }
      : {}),
  },
  optimization: {
    chunkIds: 'deterministic',
    moduleIds: 'deterministic',
    splitChunks: {
      chunks: 'async',
      automaticNameDelimiter: '.',
    },
    minimizer: [
      (compiler) => {
        const TerserPlugin = require('terser-webpack-plugin')
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true,
            mangle: true,
            safari10: true,
            compress: {
              drop_console: true,
            },
          },
        }).apply(compiler)
      },
    ],
  },
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      ...config.swOptions,
    }),
    ...(config.buildStatic
      ? [
          new WebpackManifestPlugin({
            generate: (seed, files) =>
              files.reduce((acc, file) => {
                const oldName = path.basename(file.name)
                const newName = path.basename(file.path)
                if (oldName !== newName) acc[oldName] = newName
                return acc
              }, seed),
          }),
          new MiniCssExtractPlugin({
            filename: `${config.cssOutputPath.substring(1)}/[name].[contenthash].css`,
          }),
        ]
      : []),
  ],
})

if (hasExtendFile) {
  require(extendFilePath)(webpackConfig)
}

module.exports = webpackConfig
