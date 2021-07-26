const fs = require('fs')
const nodePath = require('path')
const mkdirp = require('mkdirp')
const error = require('../error')

module.exports = function safeWriteFileSync(path, file) {
  try {
    mkdirp.sync(nodePath.dirname(path)) // make sure directory exists

    fs.writeFileSync(path, file)
  } catch (e) {
    error(e)
  }
}
