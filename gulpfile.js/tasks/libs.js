const requireCached = require('../src/gulp/require-cached')
const config = require('../config')
const path = require('path')

const gulp = requireCached('gulp')
const gulpIf = requireCached('gulp-if')
const gulpConcat = requireCached('gulp-concat')
const uglify = requireCached('gulp-uglify')
const sourcemaps = requireCached('gulp-sourcemaps')

/**
 * Task for optimizing images (size).
 * @see https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task('libs', function(callback) {
  const options = {
    uglifyOptions: {
      mangle: true, // Pass false to skip mangling names.
      preserveComments: false, // 'all', 'some', {function}
    },
  }

  const libs = typeof config.libs === 'function' ? config.libs() : null

  if (!libs || !libs.length) {
    callback()
    return
  }

  return gulp
    .src(libs)
    .pipe(gulpIf(config.sourcemaps, sourcemaps.init()))
    .pipe(gulpConcat('libs.js'))
    .pipe(gulpIf(config.minify, uglify(options.uglifyOptions)))
    .pipe(gulpIf(config.sourcemaps, sourcemaps.write('.')))
    .pipe(gulp.dest(path.resolve(config.projectDirectory, config.dest.getPath('javascript')))) // Export
})
