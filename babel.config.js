const resolveApp = require('./utils/resolve-app')
const fs = require('fs')

const extendFilePath = resolveApp('babel.extend.js')
const hasExtendFile = fs.existsSync(extendFilePath)

module.exports = api => {
  api.cache(true)

  let options = {
    plugins: [
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-object-rest-spread',
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-nullish-coalescing-operator',
      '@babel/plugin-transform-numeric-separator',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-private-property-in-object'
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
