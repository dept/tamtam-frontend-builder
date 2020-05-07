#!/usr/bin/env node
const yargs = require('yargs')
const gulp = require('gulp')
const path = require('path')
const error = require('../utils/error')
const { execSync } = require('child_process')

const root = path.resolve(__dirname, '..')

function runTask(task) {
  execSync(`npm run gulp ${task}`, {
    stdio: 'inherit',
    cwd: root,
    env: {
      ...process.env,
      projectDirectory: process.cwd(),
    },
  })
}

yargs.command('build', 'build the project', undefined, () => {
  runTask('build')
})

yargs.command('deploy', 'build for deploy', undefined, () => {
  runTask('deploy')
})

yargs.command('dist', 'export to dist folder', undefined, () => {
  runTask('dist')
})

yargs.command('start', 'start the project', undefined, () => {
  runTask('default')
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
    runTask(args.task)
  } catch (e) {
    error(`Task name '${args.task}' not recognized.`)
  }
})

const argv = yargs.argv
