#!/usr/bin/env node
const yargs = require('yargs')

const { runYarn } = require('../utils/scripts/run-yarn')
const logging = require('../utils/logging')

yargs.command('deploy', 'build for deploy', {}, () => {
  runYarn('deploy')
})

yargs.command('dist', 'build for deploy', {}, () => {
  logging.warning({
    message: 'This command is deprecated, using `yarn deploy` instead',
    time: new Date(),
  })
  runYarn('deploy')
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

yargs.command('generate', 'generate new component/utility', {}, () => {
  runYarn('generate')
})

yargs.argv
