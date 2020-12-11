const config = require('../../config')
const error = require('../../../utils/error')
const fs = require('fs')

const extendFilePath = `${config.projectDirectory}/babel.extend.js`
const hasExtendFile = fs.existsSync(extendFilePath)

module.exports = (browserlist, plugins) => {
  if (!browserlist) {
    error('No valid browserlist specified for babel loader config.')
    return
  }

  let options = {
    plugins,
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          modules: false,
          corejs: 3,
          targets: {
            browsers: browserlist,
          },
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
