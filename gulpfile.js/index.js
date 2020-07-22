let config = require('./config')
const assigndeep = require('assign-deep')
const gulp = require('gulp')

const { clean } = require('./tasks/clean')
const { copy } = require('./tasks/copy')
const { images } = require('./tasks/images')
const { svg } = require('./tasks/svg')
const { injectComponentCss } = require('./tasks/inject-component-css')
const { css } = require('./tasks/css')
const { cssLint } = require('./tasks/css-lint')
const { html } = require('./tasks/html')
const { libs } = require('./tasks/libs')
const { js } = require('./tasks/js')
const { sw } = require('./tasks/sw')
const { createHashes } = require('./tasks/create-hashes')
const { updateHtmlReferences } = require('./tasks/update-html-references')
const { browserSync } = require('./tasks/browser-sync')
const { watch } = require('./tasks/watch')
const decorate = require('./src/gulp/decorator/decorate')

decorate(gulp)

config.applyProcessArgs()

// Define asset files here that need to be copied straight to the build folder.
// SVG and image files will be optimized and pushed to the build folder automatically, do not define those here.
config.copy = function() {
  const overrideCopy = require(`${config.projectDirectory}/build-config/override-copy.js`) || []
  const copyConfig = [
    { source: config.source.getPath('assets', '*.*'), dest: config.dest.getPath('assets') },
    { source: config.source.getPath('assets', 'fonts/**'), dest: config.dest.getPath('fonts') },
  ]

  return overrideCopy.length ? overrideCopy : copyConfig
}

// Libraries that will be concatenated into libs.js together on the global scope, used for commonJS incompatible libs & plugins
// You can user bower or npm getPath by default
// @example: config.source.getPath('npm', 'jquery/dist/jquery.js' )
// @note: You need to include /js/libs.js in order to use these libs in your project.
//
config.libs = function() {
  const overrideLibs = require(`${config.projectDirectory}/build-config/override-libs.js`) || []

  return overrideLibs
}

function build(callback) {
  config.cleanBuild = true

  return gulp.series(
    clean,
    gulp.parallel(copy, images, svg, injectComponentCss),
    gulp.parallel(cssLint, css),
    gulp.parallel(html, libs, js),
    sw,
    createHashes,
    updateHtmlReferences,
  )(callback)
}

function dist(callback) {
  config.debug = false
  config.minify = true
  config.sourcemaps = false
  config.prettyHTML = true

  config.dest.root.path = './build'
  config.dest.html.path = config.dest.root.path
  config.source.sw.path = config.dest.root.path + '/assets/'
  config.source.sw.strip = config.dest.root.path
  config.dest.manifest.path = config.dest.root.path
  config.dest.sw.path = config.dest.root.path

  // Overwrite config with project specific settings.
  mergeConfigs(config.projectConfig.dist)

  return build(callback)
}

function deploy(callback) {
  config.debug = false
  config.sourcemaps = false
  config.throwError = true
  config.minify = true
  config.prettyHTML = false

  config.dest.root.path = '../backend'
  config.dest.html.path = config.dest.root.path + '/html'
  config.source.sw.path = config.dest.root.path + '/assets/'
  config.source.sw.strip = config.dest.root.path
  config.dest.manifest.path = config.dest.root.path
  config.dest.sw.path = config.dest.root.path

  // Overwrite config with project specific settings.
  mergeConfigs(config.projectConfig.deploy)

  return gulp.series(
    clean,
    gulp.parallel(copy, images, svg, injectComponentCss),
    gulp.parallel(cssLint, css),
    gulp.parallel(html, libs, js),
    sw,
    createHashes,
    updateHtmlReferences,
  )(callback)
}

function server(callback) {
  return gulp.series(build, browserSync, watch)(callback)
}

function mergeConfigs(extendedConfig = {}) {
  assigndeep(config, extendedConfig)
  config.source.updateContext()
  config.dest.updateContext()
}

exports.build = build
exports.dist = dist
exports.deploy = deploy
exports.default = server
