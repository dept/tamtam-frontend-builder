var _ = require('lodash')

function filter() {
  return _.clone.apply(_, arguments)
}

module.exports = filter
