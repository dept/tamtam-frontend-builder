const fs = require('fs')
const nodePath = require('path')

const error = require('../error')

module.exports = function safeReadFileSync(path, opt_encoding) {
  try {
    path = nodePath.resolve(path)

    return fs.readFileSync(path, 'utf-8' || opt_encoding)
  } catch (e) {
    error(e, true)

    return null
  }
}
