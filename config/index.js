const fs = require('fs')
const path = require('path')
const resolveApp = require('../utils/resolve-app')
const fileCopyConfig = require('./copy')

const extendFilePath = resolveApp('config/index.js')
const hasExtendFile = fs.existsSync(extendFilePath)

const generateConfig = () => {
  const config = {}

  config.isDevelopment = process.env.NODE_ENV === 'development'
  config.debug = config.isDevelopment
  config.buildStatic = true

  // Root folder
  config.root = resolveApp('')

  // Source folder
  config.source = resolveApp('source')
  config.html = resolveApp('source/html')

  config.components = resolveApp('source/components')
  config.utilities = resolveApp('source/utilities')
  config.nodeModules = resolveApp('node_modules')
  config.dotenv = resolveApp('.env')

  // Entries
  config.appEntry = 'index.ts'
  config.distEntries = ['main.js']

  // Node.js App
  config.port = process.env.PORT || 3000

  // Assets Folder
  config.assets = resolveApp('source/assets')
  config.images = resolveApp('source/assets/images')
  config.svg = resolveApp('source/assets/svg')
  config.fonts = resolveApp('source/assets/fonts')
  config.favicons = resolveApp('source/assets/favicons')

  // Data folder
  config.data = resolveApp('source/data')

  // Styles Folder
  config.styles = resolveApp('source/sass')

  // Dist Folder
  config.dist = resolveApp('build')

  // Config asset prefix
  config.assetPrefix =
    process && process.env && process.env.ASSET_PREFIX ? process.env.ASSET_PREFIX : '/'

  // Assets dist folders
  config.assetsOutputPath = path.resolve(config.dist, '/assets')
  config.imagesOutputPath = path.join(config.assetsOutputPath, '/images')
  config.svgOutputPath = path.join(config.assetsOutputPath, '/svg')
  config.fontsOutputPath = path.join(config.assetsOutputPath, '/fonts')
  config.jsOutputPath = path.join(config.assetsOutputPath, '/js')
  config.cssOutputPath = path.join(config.assetsOutputPath, '/css')
  config.faviconsOutputPath = path.join(config.assetsOutputPath, '/favicons')

  config.htmlOutputPath = config.dist
  config.publicPath = config.assetPrefix

  // Service worker options
  config.swOptions = {
    swDest: `sw.js`,
    include: [/\.(js|css|eot|ttf|woff|json)$/],
    exclude: [/(tmp|dev|favicons|critical)/],
    runtimeCaching: [{ urlPattern: /\/assets\/images\//, handler: 'StaleWhileRevalidate' }],
  }

  // Webpack copy config
  config.copy = fileCopyConfig(config)

  if (hasExtendFile) {
    return require(extendFilePath)(config)
  }

  return config
}

module.exports = generateConfig()
