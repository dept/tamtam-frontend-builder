const fs = require('fs')
const path = require('path')
const config = require('../../../../utils/get-config')
const logging = require('../../../../utils/logging')

/**
 * Function to retrieve SVG code
 * @name: svg
 * @param name {string} resembles the path to the svg
 * @param opt_altText {=string} alt text to inject into the svg
 * @returns {string} svg code
 */
module.exports = function (name) {
  if (!name) return ''

  name = name.replace(/\.svg$/, '')

  let svg = ''
  const svgPath = path.join(config.svg, `${name}.svg`)

  try {
    svg = fs.readFileSync(svgPath)
  } catch (err) {
    logging.error({ message: 'Failed to retrieve the svg: ' + svgPath })
  }

  svg = svg.toString()
  svg = '\n<!--  ' + name + '.svg  -->\n' + svg + '\n'

  return svg
}
