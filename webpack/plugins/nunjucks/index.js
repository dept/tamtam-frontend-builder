const fs = require('fs')
const logging = require('../../../utils/logging')
const resolveApp = require('../../../utils/resolve-app')
const packageJSON = require(resolveApp('./package.json'))
const config = require('../../../utils/get-config')
const NunjucksWebpackPlugin = require('./plugin/index')
const nunjucks = require('nunjucks')

const walkFileListSync = require('../../../utils/file/walk-file-list-sync')
const getFileList = require('../../../utils/file/get-list')
const mergeJSONData = require('../../../utils/data/json/merge')

const assignFilter = require('./filters/assign')
const mergeFilter = require('./filters/merge')
const defaultsFilter = require('./filters/defaults')

const SvgExtension = require('./extensions/svg')
const DebugExtension = require('./extensions/debug')

const generateFileGlobs = require('../../../utils/file/generate-file-globs')

const RESERVED_DATA_KEYWORDS = ['project', 'ext']

const configureNunjucksPlugin = () => {
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

  const templatesList = getFileList(
    generateFileGlobs(config.html, ['{*.html, !(_dev|generic|layouts)**/*.html}']),
  )

  const pagesList = templatesList.map((template) => template.replace(`${config.html}/`, ''))
  const svgList = getFileList(
    generateFileGlobs(config.svg, ['*.svg', '**/*.svg']),
    config.svg,
    true,
  )
  const hasCriticalCSS = fs.existsSync(resolveApp(`${config.css}/critical.css`))

  contextData.project = {
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
  }

  const templates = templatesList.map((filePath) => ({
    from: filePath,
    to: filePath.replace(`${config.html}/`, ''),
    context: contextData,
    writeToFileEmit: false,
  }))

  const environment = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(
      [config.source, config.html, `${config.html}/**/*.html`].concat(
        walkFileListSync(config.components, 'template'),
      ),
      {
        noCache: true,
      },
    ),
    {
      dev: true,
    },
  )

  environment.addExtension('SVGExtension', new SvgExtension())
  environment.addExtension('DebugExtension', new DebugExtension())

  environment.addFilter('assign', assignFilter)
  environment.addFilter('merge', mergeFilter)
  environment.addFilter('defaults', defaultsFilter)

  return new NunjucksWebpackPlugin({
    path: `${config.source}/**/*.html`,
    configure: environment,
    templates: templates,
  })
}

module.exports = configureNunjucksPlugin
