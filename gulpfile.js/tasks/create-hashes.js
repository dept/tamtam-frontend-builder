const requireCached = require('../src/gulp/require-cached')
const config = require('../config')

const path = requireCached('path')
const gulp = requireCached('gulp')
const rev = require('gulp-rev')

function createHashes(callback) {
  const basePath = path.resolve(config.projectDirectory, config.dest.getPath('root'))

  if (config.debug || !config.buildStatic) {
    callback()
  }

  return gulp
    .src(
      [
        path.resolve(config.projectDirectory, config.dest.getPath('javascript', '*.js')),
        path.resolve(config.projectDirectory, config.dest.getPath('css', '*.css')),
      ],
      {
        base: basePath,
      },
    )
    .pipe(rev())
    .pipe(gulp.dest(basePath))
    .pipe(rev.manifest())
    .pipe(gulp.dest(basePath))
}

module.exports = {
  createHashes,
}
