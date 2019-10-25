var config = require('../../config')
var fs = require('fs')

function overrideTaskExists(taskName) {
  return fs.existsSync(`${config.projectDirectory}/build-config/task-overrides/${taskName}.js`)
}

module.exports = overrideTaskExists
