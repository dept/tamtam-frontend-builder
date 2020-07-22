const config = require('../config')
const log = require('../src/debug/log')
const requireCached = require('../src/gulp/require-cached')
const compilerPromise = require('./script/create-compiler-promise')
const webpackConfig = require('./script/webpack-config')

const browserSync = requireCached('browser-sync')
const webpack = requireCached('webpack')

function jsWatch(callback) {
  const legacyConfig = webpackConfig.generateConfig('legacy')

  let initialCompile = true
  if (config.webpackWatcher) {
    config.webpackWatcher.close(() => {
      legacyConfig.resolve.alias = webpackConfig.getAliasObject()

      log.info({
        sender: 'gulp',
        message: 'Alias change detected. Restarting the webpack watcher.',
      })
    })
  }

  config.webpackWatcher = webpack(legacyConfig).watch(200, (error, stats) => {
    compilerPromise.onWebpackCallback(error, stats)

    if (initialCompile) {
      initialCompile = false
      callback()
    }

    browserSync.reload()
  })
}

module.exports = {
  jsWatch,
}
