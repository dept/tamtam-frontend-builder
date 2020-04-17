#!/usr/bin/env node
global.cliCwd = process.cwd()

const yargs = require('yargs')
const gulp = require('gulp')
const error = require('../utils/error')
require('../gulpfile.js')

yargs.command('build', 'build the project', undefined, () => {
  gulp.start('build')
})

yargs.command('deploy', 'build for deploy', undefined, () => {
  gulp.start('deploy')
})

yargs.command('dist', 'export to dist folder', undefined, () => {
  gulp.start('dist')
})

yargs.command('start', 'start the project', undefined, () => {
  gulp.start('default')
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
    gulp.start(args.task)
  } catch (e) {
    error(`Task name '${args.task}' not recognized.`)
  }
})

const argv = yargs.argv
