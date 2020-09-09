var config = require('../../../config')
var log = require('../../debug/log')
var requireCached = require('../require-cached')

var gulpDebug = requireCached('gulp-debug')
var gulpPlumber = requireCached('gulp-plumber')
var gulpIf = requireCached('gulp-if')

function decorate(gulp) {
  if (!gulp || gulp.__isDecorated__) return gulp

  gulp.__isDecorated__ = true

  var options = {
    plumberConfig: {
      errorHandler: log.error,
    },
    debugConfig: {
      title: 'gulp-debug:',
      minimal: true, // By default only relative paths are shown. Turn off minimal mode to also show cwd, base, path.
    },
  }

  decorateSrc(gulp, options)

  return gulp
}

module.exports = decorate

/**
 * Decorates the gulp.src function with default tasks such as plumber
 * and debug for better error handling and debugging.
 *
 * @see: https://www.timroes.de/2015/01/06/proper-error-handling-in-gulp-js/
 * @see: https://www.npmjs.com/package/gulp-plumber
 * @see: https://www.npmjs.com/package/gulp-debug
 */
function decorateSrc(gulp, options) {
  // @type: {function}
  var gulpSrcFunction = gulp.src
  gulp.src = function() {
    return gulpSrcFunction
      .apply(gulp, arguments)
      .pipe(gulpPlumber(options.plumberConfig))
      .pipe(gulpIf(config.gulp.debug, gulpDebug(options.debugConfig)))
  }

  return gulp
}
