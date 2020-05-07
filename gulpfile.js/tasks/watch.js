const requireCached = require('../src/gulp/require-cached')
const config = require('../config')
const path = require('path')
const webpackConfig = require('./script/webpack-config')

const _ = requireCached('lodash')
const gulp = requireCached('gulp')
const watch = requireCached('gulp-watch')
const browserSync = requireCached('browser-sync')
let reloadTimeout
const RELOAD_TIMEOUT_DELAY = 200 // in milliseconds

const { jsWatch } = require('./js-watch')
const { images } = require('./images')
const { svg } = require('./svg')
const { injectComponentCss } = require('./inject-component-css')
const { css } = require('./css')
const { cssLint } = require('./css-lint')
const { html } = require('./html')

/**
 * Task for watching files and running related tasks when needed.
 * JavaScript is done via watchify instead for this task for optimized configuration.
 * @see https://www.npmjs.com/package/gulp-watch
 */
exports.watch = gulp.series(jsWatch, function() {
  watch(config.source.getFileGlobs('images'), images)

  watch(config.source.getFileGlobs('svg'), svg)

  watch(
    config.source.getPath('components', '**/*.scss'),
    gulp.series(css, cssLint, injectComponentCss),
  )

  watch(config.source.getPath('css', '**/*.scss'), gulp.series(css, cssLint))

  watch(
    [config.source.getPath('components', '**/*.js'), config.source.getPath('utilities', '**/*.js')],
    function(cb) {
      const currentAliases = config.webpackWatcher.compiler.options.resolve.alias
      const newAliases = webpackConfig.getAliasObject()
      if (!_.isEqual(newAliases, currentAliases)) {
        return gulp.series(jsWatch)
      }
      cb
    },
  )

  watch(config.source.getPath('components', '**/*.html'), html)

  watch(config.source.getPath('html', '**'), html)

  watch(config.source.getFileGlobs('data'), html)

  watch(
    path.resolve(config.projectDirectory, config.dest.getPath('html', '**/*.html')),
    onHTMLChange,
  )
})

/**
 *  A separate function to refresh the browser. This is to bypass a known bug in chrome.
 *  see: https://github.com/BrowserSync/browser-sync/issues/155
 */
function onHTMLChange(cb) {
  if (reloadTimeout) clearTimeout(reloadTimeout)
  reloadTimeout = setTimeout(browserSync.reload, RELOAD_TIMEOUT_DELAY)
  cb()
}
