const resolveApp = require('./utils/resolve-app')
const fs = require('fs')

const extendFilePath = resolveApp('babel.extend.js')
const hasExtendFile = fs.existsSync(extendFilePath)

module.exports = api => {
  api.cache(true)

  let options = {
    plugins: [
      '@babel/syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-private-methods',
      '@babel/plugin-proposal-private-property-in-object',
      '@babel/helper-skip-transparent-expression-wrappers',
    ],
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          modules: false,
          corejs: 3,
          configPath: resolveApp(),
        },
      ],
    ],
  }

  if (hasExtendFile) {
    options = require(extendFilePath)(options)
  }

  return options
}
