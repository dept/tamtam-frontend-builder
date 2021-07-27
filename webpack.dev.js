const { merge } = require('webpack-merge')
const config = require('./utils/get-config')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  target: 'web',
  devtool: 'inline-source-map',
  entry: {
    'dev': './source/sass/_dev/dev.scss',
  },
  devServer: {
    port: config.port,
    compress: true,
    contentBase: '.',
    disableHostCheck: true,
    hot: true,
    clientLogLevel: 'debug',
    overlay: { warnings: true, errors: true },
    writeToDisk: true
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

