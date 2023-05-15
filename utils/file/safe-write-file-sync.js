const fs = require('fs')
const nodePath = require('path')
const error = require('../error')

const safeWriteFileSync = async (path, file) => {
  try {
    await fs.promises.mkdir(nodePath.dirname(path)) // make sure directory exists
    await fs.promises.writeFile(path, file)
  } catch (e) {
    error(e)
  }
}

module.exports = safeWriteFileSync
