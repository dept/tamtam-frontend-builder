#!/usr/bin/env node
const yargs = require('yargs')

const error = require('../utils/error')
const { runGulpTask } = require('../utils/run-gulp-task')

yargs.command('build', 'build the project', undefined, () => {
  runGulpTask('build')
})

yargs.command('deploy', 'build for deploy', undefined, () => {
  runGulpTask('deploy')
})

yargs.command('dist', 'export to dist folder', undefined, () => {
  runGulpTask('dist')
})

yargs.command('start', 'start the project', undefined, () => {
  runGulpTask('default')
})

yargs.command('npm-install-recursive', 'install npm recursive', undefined, () => {
  require('../utils/npm-install-recursive')
})

yargs.command('create', 'create new component', undefined, () => {
  require('../utils/create')
})

yargs.command('task [task]', 'run gulp task', undefined, args => {
  if (!args.task) {
    error('No task specified.')
    return
  }

  try {
    runGulpTask(args.task)
  } catch (e) {
    error(`Task name '${args.task}' not recognized.`)
  }
})

yargs.argv
