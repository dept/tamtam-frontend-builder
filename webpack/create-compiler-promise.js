const fs = require('fs')
const webpack = require('webpack')
const logging = require('../utils/logging')
const resolveApp = require('../utils/resolve-app')

const hasLintFile =
  fs.existsSync(resolveApp('/.eslintrc')) ||
  fs.existsSync(resolveApp('/.eslintrc.js')) ||
  fs.existsSync(resolveApp('/.eslintrc.json'))

let shownMissingLintWarning = 0
const warningLimit = 2

const logStats = (stats) => console.log(`\n ${stats.toString({ colors: true })} \n`)

const createCompiler = (config) => {
  const compiler = webpack(config)
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      onWebpackCallback(error, stats)
      if (error || (stats && stats.hasErrors())) {
        const info = stats.toJson()
        reject(info.errors)
        return
      }
      resolve()
    })
  })
}

const createCompilerPromise = (compilerConfigs) => {
  const promises = []
  const configArray = []

  Object.keys(compilerConfigs).forEach((configName) => {
    configArray.push(compilerConfigs[configName])
  })

  promises.push(createCompiler(configArray))

  return promises
}

const onWebpackCallback = (err, stats) => {
  if (stats)
    if (stats.stats) {
      stats.stats.forEach((stat) => {
        logStats(stat)
      })
    } else {
      logStats(stats)
    }

  if (err)
    logging.error({
      message: err,
    })

  if (!hasLintFile) {
    if (shownMissingLintWarning < warningLimit)
      logging.error({
        message: "You don't use Javascript Linting yet. Please upgrade ASAP.",
      })
    shownMissingLintWarning++
  }
}

module.exports = {
  create: createCompilerPromise,
  onWebpackCallback: onWebpackCallback,
}
