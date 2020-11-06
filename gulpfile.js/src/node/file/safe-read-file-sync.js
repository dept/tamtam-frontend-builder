const fs = require('fs')
const nodePath = require('path')

const log = require('../../debug/log')

module.exports = function safeReadFileSync(path, opt_encoding) {
  try {
    path = nodePath.resolve(path)

    return fs.readFileSync(path, 'utf-8' || opt_encoding)
  } catch (error) {
    log.error({
      sender: 'safe-read-file-sync',
      message: 'error reading file to: ' + path,
      data: [error],
    })

    return null
  }
}
