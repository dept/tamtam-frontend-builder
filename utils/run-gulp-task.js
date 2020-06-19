const { execSync } = require('child_process')
const path = require('path')
const root = path.resolve(__dirname, '..')

function runGulpTask(task) {
  execSync(`npm run gulp ${task}`, {
    stdio: 'inherit',
    cwd: root,
    env: {
      ...process.env,
      projectDirectory: process.cwd(),
    },
  })
}

module.exports = {
  runGulpTask,
}
