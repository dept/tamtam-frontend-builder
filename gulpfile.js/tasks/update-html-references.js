const requireCached = require('../src/gulp/require-cached')
const config = require('../config')

const path = requireCached('path')
const gulp = requireCached('gulp')
const through = requireCached('through2')
const del = requireCached('del')
const merge = require('merge2')
const revCollector = require('gulp-rev-collector')

const removeOriginalFiles = () =>
  through.obj(function(file, enc, cb) {
    const manifest = JSON.parse(file.contents.toString(enc))
    const filesToDelete = Object.keys(manifest).map(key =>
      path.resolve(config.projectDirectory, config.dest.getPath('root'), key),
    )
    filesToDelete.push(file.path)
    return del(filesToDelete, { force: true })
      .then(filesDeleted => cb(null, filesDeleted))
      .catch(err => cb(err))
  })

gulp.task('update-html-references', function(callback) {
  if (!config.buildStatic && !config.debug) return callback.call(this)

  const updateHtml = gulp
    .src([
      path.resolve(config.projectDirectory, config.dest.getPath('root', 'rev-manifest.json')),
      path.resolve(config.projectDirectory, config.dest.getPath('html', '*.html')),
      path.resolve(config.projectDirectory, config.dest.getPath('sw', 'sw.js')),
    ])
    .pipe(revCollector())
    .pipe(gulp.dest(path.resolve(config.projectDirectory, config.dest.getPath('html'))))

  const removeManifest = gulp
    .src(path.resolve(config.projectDirectory, config.dest.getPath('root', 'rev-manifest.json')))
    .pipe(removeOriginalFiles())

  return merge(updateHtml, removeManifest)
})
