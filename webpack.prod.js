const fs = require('fs')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

const extendFilePath = resolveApp('webpack.prod.js')
const hasExtendFile = fs.existsSync(extendFilePath)

const webpackConfig = merge(common, {
  mode: 'production',
  bail: true,
  optimization: {
    chunkIds: 'deterministic',
    moduleIds: 'deterministic',
    splitChunks: {
      chunks: 'async',
      automaticNameDelimiter: '.',
    },
    minimizer: [
      (compiler) => {
        const TerserPlugin = require('terser-webpack-plugin');
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
})


if (hasExtendFile) {
  require(extendFilePath)(webpackConfig)
}

module.exports = webpackConfig
