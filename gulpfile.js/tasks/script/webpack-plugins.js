const fs = require('fs')


const ESLintPlugin = require('eslint-webpack-plugin')

const config = require('../../config')

const hasLintFile =
  fs.existsSync(`${config.projectDirectory}/.eslintrc`) ||
  fs.existsSync(`${config.projectDirectory}/.eslintrc.js`) ||
  fs.existsSync(`${config.projectDirectory}/.eslintrc.json`)

const plugins = []

if (hasLintFile) {
  plugins.push(
    new ESLintPlugin({
      emitWarning: true,
      failOnError: true,
    }),
  )
}
if (config.minify) {
}

module.exports = plugins
