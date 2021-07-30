const chalk = require('chalk')

const success = ({ message, time } = {}) => {
  const messageStyle = chalk.green
  const styledMessage = messageStyle(time ? formatTime(time) : null, message)
  console.log(styledMessage)
}

const warning = ({ message, time } = {}) => {
  const messageStyle = chalk.yellow
  const styledMessage = messageStyle(time ? formatTime(time) : null, message)
  console.log(styledMessage)
}

const error = ({ message, time } = {}) => {
  const messageStyle = chalk.white.bgRed
  const styledMessage = messageStyle(time ? formatTime(time) : null, message)
  console.log(styledMessage)
}

const formatTime = (time) =>
  chalk.bold(`[${time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')}]`)

const logging = {
  success,
  warning,
  error,
}

module.exports = logging
