const config = require('../config')
const fs = require('fs')
const log = require('../src/debug/log')

const compilerPromise = require('./script/create-compiler-promise')
const webpackConfigs = require('./script/webpack-config')
const hasESFile = fs.existsSync(`${config.source.getPath('javascript')}/main-es.js`)

const compilerConfigs = {}

compilerConfigs.legacyConfig = webpackConfigs.legacyConfig
if (hasESFile) compilerConfigs.modernConfig = webpackConfigs.modernConfig

function js(callback) {
  Promise.all(compilerPromise.create(compilerConfigs))
    .then(a => {
      callback()
    })
    .catch(e => {
      log.error(
        {
          sender: 'js',
          message: JSON.stringify(e),
        },
        true,
        true,
      )
      callback(e)
    })
}

module.exports = {
  compilerConfigs,
  js,
}
