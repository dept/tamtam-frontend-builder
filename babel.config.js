const resolveApp = require('./utils/resolve-app')
const fs = require('fs')

const extendFilePath = resolveApp('babel.extend.js')
const hasExtendFile = fs.existsSync(extendFilePath)

module.exports = (api) => {
  api.cache(true)

  let options = {
    plugins: [
      '@babel/syntax-dynamic-import',
      '@babel/plugin-class-properties',
      '@babel/plugin-object-rest-spread',
      '@babel/plugin-optional-chaining',
      '@babel/plugin-nullish-coalescing-operator',
      '@babel/plugin-numeric-separator',
      '@babel/plugin-private-methods',
      '@babel/plugin-private-property-in-object'
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
