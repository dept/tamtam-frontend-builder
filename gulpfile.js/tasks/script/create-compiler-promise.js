const webpack = require('webpack')
const fs = require('fs')
const config = require('../../config')
const hasLintfile =
  fs.existsSync(`${config.projectDirectory}/.eslintrc`) ||
  fs.existsSync(`${config.projectDirectory}/.eslintrc.js`) ||
  fs.existsSync(`${config.projectDirectory}/.eslintrc.json`)
let shownMissingLintWarning = 0
const warningLimit = 2

const logStats = stats => console.log(`\n ${stats.toString({ colors: true })} \n`)

const createCompiler = config => {
  const compiler = webpack(config)
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      onWebpackCallback(error, stats)
      resolve()
    })
  })
}

const createCompilerPromise = compilerConfigs => {
  const promises = []
  const configArray = []

  Object.keys(compilerConfigs).forEach(configName => {
    configArray.push(compilerConfigs[configName])
  })

  promises.push(createCompiler(configArray))

  return promises
}

const onWebpackCallback = (error, stats, opt_prevStats) => {
  if (stats.stats) {
    stats.stats.forEach(stat => {
      logStats(stat)
    })
  } else {
    logStats(stats)
  }

  if (error)
    log.error({
      sender: 'js',
      data: [error],
    })

  if (!hasLintfile) {
    if (shownMissingLintWarning < warningLimit)
      log.error({
        sender: 'js',
        message: "You don't use Javascript Linting yet. Please upgrade ASAP.",
      })
    shownMissingLintWarning++
  }
}

module.exports = {
  create: createCompilerPromise,
  onWebpackCallback: onWebpackCallback,
}
