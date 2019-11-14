const requireCached = require('../src/gulp/require-cached')
const log = require('../src/debug/log')
const config = require('../config')
const path = require('path')

const gulp = requireCached('gulp')
const changed = requireCached('gulp-changed')
const mergeStream = requireCached('merge-stream')

/**
 *  Gulp task for copying Bower assets to the destination folder.
 *  @see: https://www.npmjs.com/package/del
 */
gulp.task('copy', function() {
  const files = config.copy && typeof config.copy === 'function' ? config.copy() : null
  const streams = []

  if (!files || !files.length) return null

  for (let i = 0, leni = files.length; i < leni; i++) {
    const source = files[i].source
    const dest = files[i].dest

    if (!source) {
      log.error({
        message: "assets config needs to have a 'source' property!",
        sender: 'copyAssets',
      })
      continue
    }

    if (!dest) {
      log.error({
        message: "assets config needs to have a 'dest' property!",
        sender: 'copyAssets',
      })
      continue
    }

    streams.push(
      gulp
        .src(source)

        .pipe(changed(path.resolve(config.projectDirectory, dest))) // Ignore unchanged files
        .pipe(gulp.dest(path.resolve(config.projectDirectory, dest))), // Push the files straight to their destination
    )
  }

  return mergeStream(streams)
})
