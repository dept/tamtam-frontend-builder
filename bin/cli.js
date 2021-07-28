#!/usr/bin/env node
const yargs = require('yargs')

const { runYarn } = require('../utils/scripts/run-yarn')
const { default: chalk } = require('chalk')

yargs.command('deploy', 'build for deploy', {}, () => {
  runYarn('run deploy')
})

yargs.command('dist', 'build for deploy', {}, () => {
  console.warn(chalk.yellow('This command is deprecated, using `yarn deploy` instead'))
  runYarn('run deploy')
})

yargs.command('start', 'start the project', {}, () => {
  runYarn('start')
})

yargs.command('favicons', 'generate favicons', {}, () => {
  runYarn('favicons')
})

yargs.command('yarn-install-recursive', 'install yarn recursive', {}, () => {
  require('../utils/scripts/yarn-install-recursive')
})

yargs.command('create', 'create new component', {}, () => {
  require('../utils/create')
})

yargs.argv
