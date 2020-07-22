const config = require('../config')
const fs = require('fs')
const log = require('../src/debug/log')

const compilerPromise = require('./script/create-compiler-promise')
const webpackConfigs = require('./script/webpack-config')
const hasESFile = fs.existsSync(`${config.source.getPath('javascript')}/main-es.js`)

const compilerConfigs = {}

function js(callback) {
  compilerConfigs.legacyConfig = webpackConfigs.generateConfig('legacy')
  if (hasESFile) compilerConfigs.modernConfig = webpackConfigs.generateConfig('modern')

  Promise.all(compilerPromise.create(compilerConfigs))
    .then(() => {
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
