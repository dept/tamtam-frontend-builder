const requireCached = require('../src/gulp/require-cached')
const config = require('../config')
const merge = require('merge-stream')

const path = requireCached('path')
const gulp = requireCached('gulp')
const gulpif = requireCached('gulp-if')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')

gulp.task('create-hashes', function(callback) {
  const basePath = path.resolve(config.projectDirectory, config.dest.getPath('root'))

  if (!config.buildStatic) return callback.call(this)

  const renamer = gulp
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
    .pipe(
      rev.manifest({
        path: 'rev-manifest.json',
      }),
    )
    .pipe(gulp.dest(basePath))

  const updateHtml = gulp
    .src([
      path.resolve(config.projectDirectory, config.dest.getPath('root', 'rev-manifest.json')),
      path.resolve(config.projectDirectory, config.dest.getPath('html', '*.html')),
      path.resolve(config.projectDirectory, config.dest.getPath('sw', 'sw.js')),
    ])
    .pipe(gulpif(config.buildStatic, revCollector()))
    .pipe(gulp.dest(path.resolve(config.projectDirectory, config.dest.getPath('html'))))

  return merge(renamer, updateHtml)
})
