const fs = require('fs')
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
  config.pages = resolveApp('source/pages');
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
  config.assetPrefix = process.env.ASSET_PREFIX ? process.env.ASSET_PREFIX : '';

  // Assets dist folders
  config.imagesOutputPath = '/assets/images/';
  config.svgOutputPath = '/assets/svg/';
  config.fontsOutputPath = '/assets/fonts/';
  config.jsOutputPath = '/assets/js/';
  config.faviconsOutputPath = '/assets/favicons/';
  config.polyfillOutputPath = '/assets/js/polyfills/';
  config.htmlOutputPath = '';
  config.publicPath = config.assetPrefix;

  // Nunjucks config
  config.nunjucks = {
      envAppViews: [config.pages, config.components, config.public],
      project: {
          debug: process.env.NODE_ENV === 'development',
          assetPrefix: config.assetPrefix,
          ...require(`${config.data}/site.json`),
      },
  };

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
