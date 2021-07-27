const fs = require('fs')
const path = require('path')
const resolveApp = require('../utils/resolve-app');
const fileCopyConfig = require('./copy');

const extendFilePath = resolveApp('config/index.js')
const hasExtendFile = fs.existsSync(extendFilePath)

const generateConfig = () => {

  const config = {};

  // Root folder
  config.root = resolveApp('');

  // Source folder
  config.source = resolveApp('source');
  config.html = resolveApp('source/html');

  config.components = resolveApp('source/components');
  config.nodeModules = resolveApp('node_modules');
  config.dotenv = resolveApp('.env');

  // Entries
  config.appEntry = 'index.ts';
  config.distEntries = ['main.js'];

  // Node.js App
  config.port = process.env.PORT || 3000;

  // Assets Folder
  config.assets = resolveApp('source/assets');
  config.images = resolveApp('source/assets/images');
  config.svg = resolveApp('source/assets/svg');
  config.favicons = resolveApp('source/assets/favicons');

  // Data folder
  config.data = resolveApp('source/data');

  // Styles Folder
  config.styles = resolveApp('source/sass');

  // Dist Folder
  config.dist = resolveApp('build');
  config.clientDist = config.dist;

  // Config asset prefix
  config.assetPrefix = process && process.env && process.env.ASSET_PREFIX ? process.env.ASSET_PREFIX : '/';

  // Assets dist folders
  config.imagesOutputPath = path.resolve(config.clientDist, '/assets/images/');
  config.svgOutputPath = path.resolve(config.clientDist, '/assets/svg/');
  config.fontsOutputPath = path.resolve(config.clientDist, '/assets/fonts/');
  config.jsOutputPath = path.resolve(config.clientDist, '/assets/js/');
  config.cssOutputPath = path.resolve(config.clientDist, '/assets/css/');
  config.faviconsOutputPath = path.resolve(config.clientDist, '/assets/favicons/');

  config.htmlOutputPath = config.clientDist;
  config.publicPath = config.assetPrefix;

  // Service worker options
  config.injectManifest = false;
  config.swsource = `${config.root}/sw-precache.js`;

  // Webpack copy config
  config.copy = fileCopyConfig(config)

  if (hasExtendFile) {
    return require(extendFilePath)(config)
  }

  return config

}

module.exports = generateConfig();
