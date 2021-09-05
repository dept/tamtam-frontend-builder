const config = require('../../../utils/get-config')
const path = require('path')
const { NunjucksWebpackPlugin } = require('./plugin/index')
const nunjucks = require('nunjucks')

const walkFileListSync = require('../../../utils/file/walk-file-list-sync')

const assignFilter = require('./filters/assign')
const mergeFilter = require('./filters/merge')
const defaultsFilter = require('./filters/defaults')

const SvgExtension = require('./extensions/svg')
const DebugExtension = require('./extensions/debug')

const getTemplatesList = require('./utils/getTemplatesList')

const configureNunjucksPlugin = () => {
  const templates = getTemplatesList().map(filePath => ({
    from: filePath,
    to: path.join(config.htmlOutputPath, path.relative(config.html, filePath)),
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

  environment.addExtension('SVGExtension', SvgExtension)
  environment.addExtension('DebugExtension', DebugExtension)

  environment.addFilter('assign', assignFilter)
  environment.addFilter('merge', mergeFilter)
  environment.addFilter('defaults', defaultsFilter)

  return new NunjucksWebpackPlugin({
    paths: [`${config.source}/**/*.html`, `${config.data}/**/*.json`],
    configure: environment,
    templates: templates,
  })
}

module.exports = configureNunjucksPlugin
