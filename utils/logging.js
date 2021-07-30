const chalk = require('chalk')

const success = ({ message, time } = {}) => {
  const messageStyle = chalk.green
  const styledMessage = messageStyle(`${formatTime(time)} ${message}`)
  console.log(styledMessage)
}

const warning = ({ message, time } = {}) => {
  const messageStyle = chalk.yellow
  const styledMessage = messageStyle(`${formatTime(time)} ${message}`)
  console.log(styledMessage)
}

const error = ({ message, time } = {}) => {
  const messageStyle = chalk.white.bgRed
  const styledMessage = messageStyle(`${formatTime(time)} ${message}`)
  console.log(styledMessage)
}

const formatTime = (time = new Date()) =>
  chalk.bold(`[${time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')}]`)

const logging = {
  success,
  warning,
  error,
}

module.exports = logging
