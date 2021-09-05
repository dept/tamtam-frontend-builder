const fs = require('fs')
const path = require('path')
const resolveApp = require('../../../../utils/resolve-app')
const config = require('../../../../utils/get-config')
const logging = require('../../../../utils/logging')
const packageJSON = require(resolveApp('./package.json'))
const getFileList = require('../../../../utils/file/get-list')
const mergeJSONData = require('../../../../utils/data/json/merge')
const generateFileGlobs = require('../../../../utils/file/generate-file-globs')
const getTemplatesList = require('./getTemplatesList')

const RESERVED_DATA_KEYWORDS = ['project', 'ext']

const hasCriticalCSS = fs.existsSync(resolveApp(`${config.css}/critical.css`))

const getGlobalContext = () => {
  const contextData = {}
  const jsonData = mergeJSONData(
    config.data,
    generateFileGlobs(config.data, ['*.json', '**/*.json']),
  )

  // merge retrieved data into the context object
  for (let key in jsonData) {
    if (RESERVED_DATA_KEYWORDS.indexOf(key) >= 0) {
      logging.error({
        message:
          'A data object has been given a reserved keyword as a name, please update the file name : ' +
          key +
          '.\nReserved keywords: ' +
          RESERVED_DATA_KEYWORDS,
      })
    } else {
      contextData[key] = jsonData[key]
    }
  }

  const pagesList = getTemplatesList().map(template => path.relative(config.html, template))
  const svgList = getFileList(
    generateFileGlobs(config.svg, ['*.svg', '**/*.svg']),
    config.svg,
    true,
  ).map(svg => svg.split(path.sep).join(path.posix.sep))

  return {
    ...contextData,
    env: process.env,
    project: {
      name: packageJSON.name,
      description: packageJSON.description,
      author: packageJSON.author,
      version: packageJSON.version,
      debug: config.debug,
      showGrid: config.showGrid,
      pages: pagesList,
      criticalCSS: hasCriticalCSS
        ? fs.readFileSync(resolveApp(`${config.css}/critical.css`), 'utf8')
        : false,
      svgs: svgList,
    },
  }
}

module.exports = getGlobalContext
