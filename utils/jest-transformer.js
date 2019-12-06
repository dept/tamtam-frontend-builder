const webpackConfig = require('../gulpfile.js/tasks/script/webpack-config')
webpackConfig.legacyConfig.module.rules[1].use.options.presets[0][1].modules = 'commonjs'

module.exports = require('babel-jest').createTransformer(
  webpackConfig.legacyConfig.module.rules[1].use.options,
)
