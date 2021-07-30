const fs = require('fs')
const chokidar = require('chokidar')
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
    progress: true,
    compress: true,
    contentBase: config.dist,
    disableHostCheck: true,
    hot: true,
    // overlay: true,
    writeToDisk: false,
    watchContentBase: true,
    after: (_, server) => {
      chokidar.watch([`${config.source}/**/*.html`]).on('all', () => {
        server.sockWrite(server.sockets, 'content-changed')
      })
    },
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
