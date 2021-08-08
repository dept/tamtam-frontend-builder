const fs = require('fs')
const resolveApp = require('../../utils/resolve-app')

const extendFilePath = resolveApp('/babel.extend.js')
const hasExtendFile = fs.existsSync(extendFilePath)

module.exports = () => {
  let options = {
    plugins: [
      '@babel/syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-optional-chaining',
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

  return [
    {
      test: /\.(ts|js)x?$/,
      exclude: /(node_modules)/,
      use: {
        loader: require.resolve('babel-loader'),
        options,
      },
    },
  ]
}
