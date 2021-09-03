var _ = require('lodash')

function filter() {
  return _.defaultsDeep.apply(_, arguments)
}

module.exports = filter
