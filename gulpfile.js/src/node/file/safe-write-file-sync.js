const fs = require('fs')
const nodePath = require('path')
const mkdirp = require('mkdirp')

const log = require('../../debug/log')

module.exports = function safeWriteFileSync(path, file) {
  try {
    mkdirp.sync(nodePath.dirname(path)) // make sure directory exists

    fs.writeFileSync(path, file)
  } catch (error) {
    log.error({
      sender: 'safe-write-file-sync',
      message: 'error writing file to: ' + path,
      data: [error],
    })
  }
}
