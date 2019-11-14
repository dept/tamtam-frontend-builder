var log = require('../debug/log')
var config = require('../../config')
var requireCached = require('./require-cached')

var path = require('path')
var glob = requireCached('glob')

const overrideTaskExists = require('./override-task-exists')

function loadTasks() {
  // pre-load all gulp tasks if we're not loading at runtime
  log.debug({ sender: 'loadTasks', message: '\tLoading tasks...' })

  var relative = path.relative(__dirname, process.cwd())
  var taskFiles = glob.sync(path.normalize('gulpfile.js/tasks/*.js'))

  for (var i = 0, leni = taskFiles.length; i < leni; i++) {
    const taskNameArray = taskFiles[i].split('/tasks/')
    const taskName = taskNameArray[taskNameArray.length - 1].replace('.js', '')
    const taskPath = overrideTaskExists(taskName)
      ? path.normalize(`${config.projectDirectory}/build-config/task-overrides/${taskName}`)
      : path.resolve(
          process.env.OLDPWD || process.env.INIT_CWD,
          `node_modules/tamtam-frontend-builder/gulpfile.js/tasks/${taskName}`,
        )

    require(taskPath)

    if (config.gulp.debug)
      log.info({
        sender: 'loadTasks',
        message: 'task loaded: ' + taskFiles[i],
      })
  }

  log.debug({ sender: 'loadTasks', message: '\tDone.' })
}

module.exports = loadTasks()
