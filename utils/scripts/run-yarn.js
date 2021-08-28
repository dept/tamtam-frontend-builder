const { execSync } = require('child_process')
const path = require('path')
const root = path.resolve(__dirname, '..')

const runYarn = task => {
  execSync(`yarn ${task}`, {
    stdio: 'inherit',
    cwd: root,
    env: {
      ...process.env,
      projectDirectory: process.cwd(),
    },
  })
}

module.exports = {
  runYarn,
}
