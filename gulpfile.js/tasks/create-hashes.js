const requireCached = require('../src/gulp/require-cached')
const config = require('../config')
const merge = require('merge-stream')

const path = requireCached('path')
const gulp = requireCached('gulp')
const through = requireCached('through2')
const del = requireCached('del')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')

const removeOriginalFiles = through.obj(function(file, enc, cb) {
  const manifest = JSON.parse(file.contents.toString(enc))
  const filesToDelete = Object.keys(manifest).map(key =>
    path.resolve(config.projectDirectory, config.dest.getPath('root'), key),
  )
  filesToDelete.push(file.path)
  return del(filesToDelete, { force: true })
    .then(filesDeleted => cb(null, filesDeleted))
    .catch(err => cb(err))
})

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
    .pipe(removeOriginalFiles)

  const updateHtml = gulp
    .src([
      path.resolve(config.projectDirectory, config.dest.getPath('root', 'rev-manifest.json')),
      path.resolve(config.projectDirectory, config.dest.getPath('html', '*.html')),
      path.resolve(config.projectDirectory, config.dest.getPath('sw', 'sw.js')),
    ])
    .pipe(revCollector())
    .pipe(gulp.dest(path.resolve(config.projectDirectory, config.dest.getPath('html'))))

  return merge(renamer, updateHtml)
})
