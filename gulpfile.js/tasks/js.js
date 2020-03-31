const config = require('../config')
const requireCached = require('../src/gulp/require-cached')
const fs = require('fs')
const gulp = requireCached('gulp')
const log = require('../src/debug/log')

const compilerPromise = require('./script/create-compiler-promise')
const webpackConfigs = require('./script/webpack-config')
const hasESFile = fs.existsSync(`${config.source.getPath('javascript')}/main-es.js`)

const compilerConfigs = {}

compilerConfigs.legacyConfig = webpackConfigs.legacyConfig
if (hasESFile) compilerConfigs.modernConfig = webpackConfigs.modernConfig

gulp.task('js', function(callback) {
  Promise.all(compilerPromise.create(compilerConfigs))
    .then(() => callback())
    .catch(e => {
      log.error({
        sender: 'js',
        message: 'Error whilst compiling JS',
      })
      callback(e)
    })
})

module.exports = {
  compilerConfigs,
}
