const requireCached = require('../src/gulp/require-cached')
const log = require('../src/debug/log')
const config = require('../config')
const path = require('path')

const gulp = requireCached('gulp')
const del = requireCached('del')

/**
 *  Gulp task for cleaning up the destination folder.
 *  Deletes all files that match the patterns in the option.source
 *  @see: https://www.npmjs.com/package/del
 */
gulp.task('clean', function(callback) {
  if (!config.cleanBuild) {
    if (typeof callback === 'function') callback.call(this)

    return
  }

  const options = {
    // log deleted files
    verbose: config.gulp.verbose,

    force: true,
  }

  let deletedFiles

  try {
    deletedFiles = del.sync(
      path.resolve(config.projectDirectory, config.dest.getPath('root'), '**'),
      options,
    )
  } catch (error) {
    log.error(error)
  }

  if (options.verbose && deletedFiles) {
    let filesDeletedString = ''
    const currentWorkingDirectory = process.cwd()
    for (let i = 0, leni = deletedFiles.length; i < leni; i++)
      filesDeletedString += '\n\t\t' + deletedFiles[i]

    // remove CWD path of the file names.
    filesDeletedString = filesDeletedString.replace(new RegExp(currentWorkingDirectory, 'g'), '')

    log.info({
      sender: 'clean task',
      message: 'Files deleted during cleanup:',
      data: [log.colors.yellow(filesDeletedString)],
    })
  }

  if (callback) callback.call(this)
})
