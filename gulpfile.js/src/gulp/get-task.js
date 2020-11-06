const config = require('../../config')
const overrideTaskExists = require('./override-task-exists')
const overridePath = `${config.projectDirectory}/build-config/task-overrides`

const getTask = taskName =>
  overrideTaskExists(taskName)
    ? require(`${overridePath}/${taskName}`)
    : require(`../../tasks/${taskName}`)

module.exports = getTask
