const config = require('../config')
const requireCached = require('../src/gulp/require-cached')
const fs = require('fs')
const gulp = requireCached('gulp')

const compilerPromise = require('./script/create-compiler-promise')
const webpackConfigs = require('./script/webpack-config')
const hasESFile = fs.existsSync(`${config.source.getPath('javascript')}/main-es.js`)

const compilerConfigs = {}

compilerConfigs.legacyConfig = webpackConfigs.legacyConfig
if (hasESFile) compilerConfigs.modernConfig = webpackConfigs.modernConfig

gulp.task('js', function() {
  return Promise.all(compilerPromise.create(compilerConfigs)).catch(e =>
    console.warn('Error whilst compiling JS', e),
  )
})

module.exports = {
  compilerConfigs,
}
