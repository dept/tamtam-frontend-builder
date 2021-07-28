const fs = require('fs')
const { merge } = require('webpack-merge')
const config = require('./utils/get-config')
const resolveApp = require('./utils/resolve-app')
const common = require('./webpack.common.js')

const extendFilePath = resolveApp('webpack.dev.js')
const hasExtendFile = fs.existsSync(extendFilePath)

const webpackConfig = merge(common, {
  mode: 'development',
  target: 'web',
  devtool: 'inline-source-map',
  entry: {
    'dev': './source/sass/_dev/dev.scss',
  },
  devServer: {
    port: config.port,
    compress: true,
    contentBase: config.dist,
    disableHostCheck: true,
    hot: true,
    clientLogLevel: 'debug',
    overlay: { warnings: true, errors: true },
    writeToDisk: true,
    watchContentBase: true
  },
  optimization: {
    chunkIds: 'named',
    moduleIds: 'named',
    splitChunks: {
      chunks: 'async',
      automaticNameDelimiter: '.',
    },
    emitOnErrors: true,
  }
})

if (hasExtendFile) {
  require(extendFilePath)(webpackConfig)
}

module.exports = webpackConfig
