const fs = require('fs')
const nodePath = require('path')
const logging = require('../logging')

module.exports = function safeReadFileSync(path, opt_encoding) {
  try {
    path = nodePath.resolve(path)

    return fs.readFileSync(path, 'utf-8' || opt_encoding)
  } catch (e) {
    logging.error({
      message: e,
    })
    return null
  }
}
