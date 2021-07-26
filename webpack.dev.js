const { merge } = require('webpack-merge')
const config = require('./utils/get-config')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: config.port,
    compress: true,
    contentBase: './',
    disableHostCheck: true,
    hot: true,
    clientLogLevel: 'none',
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
