const fs = require('fs')
const nodePath = require('path')
const error = require('../error')

const safeWriteFileSync = async (path, file) => {
  try {
    try {
      await fs.promises.access(nodePath.dirname(path))
    } catch {
      await fs.promises.mkdir(nodePath.dirname(path), { recursive: true })
    }
    await fs.promises.writeFile(path, file)
    return path
  } catch (e) {
    error(e)
  }
}

module.exports = safeWriteFileSync
