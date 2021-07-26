#!/usr/bin/env node
const yargs = require('yargs')
const { execSync } = require('child_process')

const error = require('../utils/error')
const path = require('path')
const root = path.resolve(__dirname, '..')

// yargs.command('build', 'build the project', {}, () => {
//   runGulpTask('build')
// })

// yargs.command('deploy', 'build for deploy', {}, () => {
//   runGulpTask('deploy')
// })

// yargs.command('dist', 'export to dist folder', {}, () => {
//   runGulpTask('dist')
// })

yargs.command('start', 'start the project', {}, () => {
  execSync(`yarn run start`, {
    stdio: 'inherit',
    cwd: root,
    env: {
      ...process.env,
      projectDirectory: process.cwd(),
    },
  })
})

yargs.command('yarn-install-recursive', 'install yarn recursive', {}, () => {
  require('../utils/yarn-install-recursive')
})

// yargs.command('create', 'create new component', {}, () => {
//   require('../utils/create')
// })

// yargs.command('task [task]', 'run gulp task', {}, args => {
//   if (!args.task) {
//     error('No task specified.')
//     return
//   }

//   try {
//     runGulpTask(args.task)
//   } catch (e) {
//     error(`Task name '${args.task}' not recognized.`)
//   }
// })

yargs.argv
