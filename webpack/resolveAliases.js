const config = require('../utils/get-config')
const resolveApp = require('../utils/resolve-app')

const striptSlashStar = string => string.replace('/*', '')

let aliases = {}

try {
  // Get alliases from tsconfig
  const tsconfig = require(`${config.root}/tsconfig.json`)
  aliases = tsconfig.compilerOptions.paths
} catch (e) {}

const resolveAliases = () => {
  const aliasKeys = Object.keys(aliases)
  const webpackAliases = aliasKeys.reduce((obj, key) => {
    const aliasPath = striptSlashStar(aliases[key][0]).replace('./', '')

    obj[striptSlashStar(key)] = resolveApp(aliasPath)

    return obj
  }, {})

  return webpackAliases
}

module.exports = resolveAliases
