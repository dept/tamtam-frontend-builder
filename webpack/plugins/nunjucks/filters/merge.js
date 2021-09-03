var _ = require('lodash')

function filter() {
  return _.merge.apply(_, arguments)
}

module.exports = filter
