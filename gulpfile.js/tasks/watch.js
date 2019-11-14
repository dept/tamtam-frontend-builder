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
    gulp.watch(config.source.getFileGlobs('images'), gulp.series(gulp.task('images')))

    gulp.watch(config.source.getFileGlobs('svg'), gulp.series(gulp.task('svg')))

    gulp.watch(
      config.source.getPath('components', '**/*.scss'),
      gulp.series(gulp.task('inject-component-css'), gulp.task('css'), gulp.task('css-lint')),
    )

    gulp.watch(
      config.source.getPath('css', '**/*.scss'),
      gulp.series(gulp.task('css'), gulp.task('css-lint')),
    )

    gulp.watch(
      [
        config.source.getPath('components', '**/*.js'),
        config.source.getPath('utilities', '**/*.js'),
      ],
      gulp.series(() => {
        const currentAliases = config.webpackWatcher.compiler.options.resolve.alias
        const newAliases = webpackConfig.getAliasObject()
        if (!_.isEqual(newAliases, currentAliases)) {
          gulp.series(gulp.task('js-watch'))
        }
      }),
    )

    gulp.watch(config.source.getPath('components', '**/*.html'), gulp.series(gulp.task('html')))

    gulp.watch(config.source.getPath('html', '**'), gulp.series(gulp.task('html')))

    gulp.watch(config.source.getFileGlobs('data'), gulp.series(gulp.task('html')))

    gulp
      .watch(path.resolve(config.projectDirectory, config.dest.getPath('html', '**/*.html')))
      .on('change', onHTMLChange)
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
