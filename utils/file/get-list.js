var glob = require('glob')
var path = require('path')
var _ = require('lodash')

module.exports = function getList(sourceGlob, opt_stripRoot, opt_stripExtension, opt_ignore) {
  var fileList = []
  if (typeof sourceGlob === 'string') {
    fileList = glob.sync(sourceGlob, { ignore: opt_ignore })
  } else if (Array.isArray(sourceGlob)) {
    for (var i = 0, leni = sourceGlob.length; i < leni; i++) {
      var source = sourceGlob[i]
      var list = glob.sync(source, { ignore: opt_ignore })
      fileList = fileList.concat(list)
    }
  }

  if (opt_stripRoot !== undefined) {
    for (var i = 0, leni = fileList.length; i < leni; i++) {
      // convert path to a relative path from the root
      fileList[i] = path.relative(opt_stripRoot, fileList[i])
    }
  }

  if (opt_stripExtension) {
    for (var i = 0, leni = fileList.length; i < leni; i++) {
      // strip extension
      fileList[i] = fileList[i].replace(/\.\w+$/, '')
    }
  }

  return _.uniq(fileList)
}
