const log = require('../src/debug/log')
const config = require('../config')
const path = require('path')
const del = require('del')

/**
 *  Gulp task for cleaning up the destination folder.
 *  Deletes all files that match the patterns in the option.source
 *  @see: https://www.npmjs.com/package/del
 */
function clean(callback) {
  if (!config.cleanBuild) {
    callback()
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

  callback()
}

module.exports = {
  clean,
}
