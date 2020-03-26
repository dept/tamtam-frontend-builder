const path = require('path')
const assigndeep = require('assign-deep')
const projectDirectory = process.env.OLDPWD || path.normalize(process.env.INIT_CWD)
const PathConfig = require('./src/data/path-config')
const processArguments = require('./src/node/process-arguments')
const packageJSON = require(`${projectDirectory}/package.json`)
let projectConfig

try {
  projectConfig = require(`${projectDirectory}/build-config/index.js`)
} catch (e) {}

let config = {}
config.name = packageJSON.name
config.version = packageJSON.version
config.projectDirectory = projectDirectory
config.projectConfig = projectConfig || {}

config.cleanBuild = false
config.debug = true
config.notifyError = true
config.throwError = false // Actually throws an (native) error when one occurs, useful for bamboo.
config.buildStatic = false

config.minify = false
config.optimizeImages = true
config.sourcemaps = true
config.cleanCSS = false // removes unused CSS, requires 'gulp-uncss' installation.
config.groupCSSMediaQueries = false // Groups CSS media queries
config.prettyHTML = false
config.minifyHTML = false // requires 'gulp-htmlmin' installation.
config.showGrid = true // Shows the grid overlay

config.gulp = {
  debug: false, // if true, gulp will output a lot of extra information for debugging purposes.
  lazy: true, // will only load the tasks in the 'gulp/tasks' folder, just before they are used.
  verbose: false, // Output extra information during the process.
}

config.browsers = {}
config.browsers.legacy = ['> 1%', 'last 2 versions', 'Firefox ESR', 'ie >= 11']

// The last two versions of each browser, excluding versions
// that don't support <script type="module">.
config.browsers.modern = [
  'last 2 Chrome versions',
  'not Chrome < 60',
  'last 2 Safari versions',
  'not Safari < 10.1',
  'last 2 iOS versions',
  'not iOS < 10.3',
  'last 2 Firefox versions',
  'not Firefox < 54',
  'last 2 Edge versions',
  'not Edge < 15',
]

// Assign process arguments.
// To use process arguments add '--[key] [value]' to the command.
// If the value is omitted, the value true will be assigned to the key.
config.applyProcessArgs = function() {
  if (processArguments.has('clean')) config.cleanBuild = processArguments.get('clean')
  if (processArguments.has('verbose')) config.verbose = processArguments.get('verbose')
  if (processArguments.has('debug')) config.gulp.debug = processArguments.get('debug')
}

/**
 *  Defines source & destination folders layout and source files.
 *  Creates an object that parses lo-dash templates on itself.
 *  To retrieve a path use the 'getPath' method.
 *  To retrieve a file glob use the 'getFileGlob' method.
 *
 *  for example: The following script returns the path for the source location of the css (sass) files.
 *
 *  config.dest.getPath('css');
 */
var source = (config.source = new PathConfig())
var dest = (config.dest = new PathConfig())

source.root = { path: config.projectDirectory + '/source' }

source.assets = { path: '<%= root %>/assets' }
source.css = { path: '<%= root %>/sass', files: ['*.scss', '_dev/*.scss'] } // entry point files
source.data = { path: '<%= root %>/data', files: ['*.json', '**/*.json'] }
source.html = { path: '<%= root %>/html', files: ['*.html'] } // entry point files

source.nunjucks = { path: source.root.path.replace('./', '') + '/html', files: source.html.files }

source.images = {
  path: '<%= assets %>/images',
  files: ['*.{jpg,jpeg,png,gif,svg,json,xml,ico}', '**/*.{jpg,jpeg,png,gif,svg,json,xml,ico}'],
}
source.javascript = { path: '<%= root %>/javascript', files: '*.js' } // entry point files
source.npm = { path: './node_modules' }
source.svg = { path: '<%= assets %>/svg', files: ['*.svg', '**/*.svg'] }
source.manifest = { path: '<%= assets %>/favicons', files: ['manifest.json'] }
source.components = { path: '<%= root %>/components', files: ['**/*.html', '**/*.scss', '**/*.js'] } // entry point files
source.utilities = { path: '<%= root %>/utilities', files: ['**/*.js'] } // entry point files
source.sw = {
  globDirectory: path.resolve(projectDirectory, 'build', 'assets'),
  globPatterns: ['**/*.{js,css,eot,ttf,woff,json}'],
  globIgnores: ['**/dev*', '**/tmp*', '**/critical*', 'dev*.*', 'tmp*.*'],
  modifyURLPrefix: {
    '': '/assets/',
  },
  runtimeCaching: [{ urlPattern: /\/assets\/images\//, handler: 'StaleWhileRevalidate' }],
}

dest.root = { path: './build' }

dest.assets = { path: '<%= root %>/assets' }
dest.css = { path: '<%= assets %>/css' }
dest.fonts = { path: '<%= assets %>/fonts' }
dest.html = { path: '<%= root %>' }
dest.images = { path: '<%= assets %>/images' }
dest.javascript = { path: '<%= assets %>/js' }
dest.svg = { path: '<%= assets %>/svg' }
dest.manifest = { path: '<%= root %>' }
dest.sw = { path: '<%= root %>' }

// Overwrite config with project specific settings.
assigndeep(config, config.projectConfig.config || {})

module.exports = config
