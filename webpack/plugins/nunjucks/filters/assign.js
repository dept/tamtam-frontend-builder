var _ = require('lodash')

function filter() {
  return _.assign.apply(_, arguments)
}

module.exports = filter
