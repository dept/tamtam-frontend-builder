const path = require("path")
const resolveApp = require("../resolve-app")

const generateFileGlobs = (filePath, glob) => {
  let filePathsGlob

  if (Array.isArray(glob)) {
    filePathsGlob = []

    for (let i = 0, leni = glob.length; i < leni; i++) {
      filePathsGlob.push(resolveApp(path.resolve(filePath, glob[i])))
    }
  } else {
    filePathsGlob = resolveApp(path.resolve(filePath, glob))
  }

  return filePathsGlob
}

module.exports = generateFileGlobs
