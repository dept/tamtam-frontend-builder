const path = require('path')

// Builder 2.x gave every SVG a class made from its path inside the svg folder, e.g.
// brand/logo.svg -> `svg--brand-logo`. Projects inline these files server-side and style them
// through that class, so keep adding it. SVGs that already have a class are left alone.
const addSvgClass = (content, svgFolder, absoluteFrom) => {
  const name = path
    .relative(svgFolder, absoluteFrom)
    .replace(/\\|\//g, '-')
    .replace(/\.svg$/, '')
  const svg = content.toString()
  if (/<svg[^>]*\sclass="/.test(svg)) return content
  return Buffer.from(svg.replace('<svg', `<svg class="svg--${name}"`))
}

module.exports = addSvgClass
