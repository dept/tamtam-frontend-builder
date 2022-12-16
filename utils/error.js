var chalk = require('chalk')

function error(msg, warn = false) {
  const msgStyle = chalk[warn ? 'black' : 'white'][warn ? 'bgYellow' : 'bgRed'].bold
  const styledMsg = msgStyle(`

    ------------------------------------
     ${warn ? ' (╯°□°）╯︵ ┻━┻' : null}
     ${msg}
    ------------------------------------
`)

  if (!warn) throw new Error(styledMsg)
  else console.log(styledMsg)
}

module.exports = error
