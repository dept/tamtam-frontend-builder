const requireCached = require('../src/gulp/require-cached')
const config = require('../config')
const path = require('path')
const webpackConfig = require('./script/webpack-config')

const _ = requireCached('lodash')
const gulp = requireCached('gulp')
const browserSync = requireCached('browser-sync')
let reloadTimeout
const RELOAD_TIMEOUT_DELAY = 200 // in milliseconds

/**
 * Task for watching files and running related tasks when needed.
 * JavaScript is done via watchify instead for this task for optimized configuration.
 * @see https://www.npmjs.com/package/gulp-watch
 */
gulp.task(
  'watch',
  gulp.parallel(() => {
    gulp.watch(config.source.getFileGlobs('images'), function() {
      gulp.start('images')
    })

    gulp.watch(config.source.getFileGlobs('svg'), function() {
      gulp.start('svg')
    })

    gulp.watch(config.source.getPath('components', '**/*.scss'), function() {
      gulp.start('css')
      gulp.start('css-lint')
      gulp.start('inject-component-css')
    })

    gulp.watch(config.source.getPath('css', '**/*.scss'), function() {
      gulp.start('css')
      gulp.start('css-lint')
    })

    gulp.watch(
      [
        config.source.getPath('components', '**/*.js'),
        config.source.getPath('utilities', '**/*.js'),
      ],
      function() {
        const currentAliases = config.webpackWatcher.compiler.options.resolve.alias
        const newAliases = webpackConfig.getAliasObject()
        if (!_.isEqual(newAliases, currentAliases)) {
          gulp.start('js-watch')
        }
      },
    )

    gulp.watch(config.source.getPath('components', '**/*.html'), function() {
      gulp.start('html')
    })

    gulp.watch(config.source.getPath('html', '**'), function() {
      gulp.start('html')
    })

    gulp.watch(config.source.getFileGlobs('data'), function() {
      gulp.start('html')
    })

    gulp.watch(
      path.resolve(config.projectDirectory, config.dest.getPath('html', '**/*.html')),
      onHTMLChange,
    )
  }, gulp.task('js-watch')),
)

/**
 *  A separate function to refresh the browser. This is to bypass a known bug in chrome.
 *  see: https://github.com/BrowserSync/browser-sync/issues/155
 */
function onHTMLChange() {
  if (reloadTimeout) clearTimeout(reloadTimeout)
  reloadTimeout = setTimeout(browserSync.reload, RELOAD_TIMEOUT_DELAY)
}
