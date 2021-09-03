const fs = require('fs')
const { merge } = require('webpack-merge')

const resolveApp = require('./utils/resolve-app')
const config = require('./utils/get-config')

const common = require('./webpack.common.js')
const extendFilePath = resolveApp('webpack.dev.js')
const hasExtendFile = fs.existsSync(extendFilePath)

const webpackConfig = merge(common, {
  mode: 'development',
  target: 'web',
  devtool: 'inline-source-map',
  devServer: {
    port: config.port,
    allowedHosts: 'all',
    hot: true,
    client: {
      overlay: false,
      progress: false,
    },
    devMiddleware: {
      writeToDisk: false,
    },
    static: {
      directory: config.dist,
      watch: true,
    },
    watchFiles: [`${config.source}/**/*.html`, `${config.data}/**/*.json`],
  },
  optimization: {
    chunkIds: 'named',
    moduleIds: 'named',
    splitChunks: {
      chunks: 'async',
      automaticNameDelimiter: '.',
    },
    emitOnErrors: true,
  },
})

if (hasExtendFile) {
  require(extendFilePath)(webpackConfig)
}

module.exports = webpackConfig
