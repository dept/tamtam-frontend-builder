const config = require('../../../../utils/get-config')

const getFileList = require('../../../../utils/file/get-list')
const generateFileGlobs = require('../../../../utils/file/generate-file-globs')

const getTemplatesList = () =>
  getFileList(generateFileGlobs(config.html, ['{*.html, !(_dev|generic|layouts)**/*.html}']))

module.exports = getTemplatesList
