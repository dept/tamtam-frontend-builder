const chalk = require('chalk')
const logging = require('../logging')

function run(fn, options) {
  const task = typeof fn.default === 'undefined' ? fn : fn.default
  const start = new Date()

  logging.success({
    message: `Starting '${task.name}${options ? ` (${options})` : ''}'`,
    time: start,
  })

  return task(options).then((resolution) => {
    const end = new Date()
    const time = end.getTime() - start.getTime()

    logging.success({
      message: `${chalk.bold('Finished')} '${task.name}${
        options ? ` (${options})` : ''
      }' after ${chalk.bold(`${time}ms`)}`,
      time: end,
    })

    return resolution
  })
}

if (require.main === module && process.argv.length > 2) {
  delete require.cache[__filename] // eslint-disable-line no-underscore-dangle

  const module = require(`./${process.argv[2]}.js`) // eslint-disable-line import/no-dynamic-require

  run(module).catch((err) => {
    logging.error({
      message: err.stack,
      time: new Date(),
    })
    process.exit(1)
  })
}

module.exports = run
