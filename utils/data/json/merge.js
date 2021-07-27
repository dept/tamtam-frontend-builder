const path = require('path')
const fs = require('fs')

const getFileList = require('../../file/get-list')
const error = require('../../error')

const jsonFileRegExp = /.json$/i

/**
 * Loads and merges JSON data into one object
 * @param root {string} root path to be stripped of the filepath
 * @param source {string} glob string for JSON
 */
function mergeJSONData(root, source) {
  if (root.slice(-1) !== path.sep) root += path.sep // force path separator as last character

  const data = {}
  const files = getFileList(source)

  for (let i = 0, leni = files.length; i < leni; i++) {
    const filePath = files[i]

    if (!jsonFileRegExp.test(filePath)) {
      console.warn('Can only merge JSON Data!')
      continue
    }

    let fileData;
    try {
      fileData = fs.readFileSync(filePath, 'utf-8')
      if (fileData) fileData = JSON.parse(fileData)
    } catch (err) {
      error(err)
      continue
    }

    if (path.sep === '\\') {
      root = root.replace('\\', '/')
    }

    let dataPath = filePath.replace(root, '')

    dataPath = dataPath.replace(jsonFileRegExp, '')
    dataPath = dataPath.split('/')

    let currentNode = data
    for (let j = 0, lenj = dataPath.length; j < lenj; j++) {
      const key = dataPath[j]

      if (!key.length) continue

      if (j === lenj - 1) {
        // assign the data on the last node
        currentNode[key] = fileData
      } else {
        currentNode[key] = currentNode[key] || {}
        currentNode = currentNode[key]
      }
    }
  }

  return data
}

module.exports = mergeJSONData
