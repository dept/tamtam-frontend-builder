const svg = require('../utils/svg')
const nunjucks = require('nunjucks')

function SVGExtension() {

  this.tags = ['svg']

  this.parse = function(parser, nodes) {
    // get the tag token
    const tok = parser.nextToken()

    // parse the args and move after the block end. passing true
    // as the second arg is required if there are no parentheses
    const args = parser.parseSignature(null, true)
    parser.advanceAfterBlockEnd(tok.value)

    // See above for notes about CallExtension
    return new nodes.CallExtension(this, 'run', args)
  }

  this.run = function(context, name) {
    const svgString = svg(name)
    return new nunjucks.runtime.SafeString(svgString)
  }
}

module.exports = SVGExtension
