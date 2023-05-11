const { execSync } = require('child_process')
const path = require('path')
const root = path.resolve(__dirname, '..')
const logging = require('../logging')

const runYarn = task => {
  try {
    execSync(`yarn ${task}`, {
      stdio: 'inherit',
      cwd: root,
      env: {
        ...process.env,
        projectDirectory: process.cwd(),
      },
    })
  } catch (error) {
    logging.error({
      time: new Date(),
      message: `yarn ${task} failed with errors`,
    })
  }
}

module.exports = {
  runYarn,
}
