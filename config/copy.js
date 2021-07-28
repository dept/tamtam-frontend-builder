const images = require('../webpack/plugins/copy/images')
const svgs = require('../webpack/plugins/copy/svgs')

function fileCopyConfig(config) {
  return [
    {
      from: config.images,
      to: `.${config.imagesOutputPath}`,
      transform: async (image, filePath) => await images(image, filePath),
    },
    {
      from: config.svg,
      to: `.${config.svgOutputPath}`,
      transform: async (svg) => await svgs(svg),
    },
    {
      from: config.favicons,
      to: `.${config.faviconsOutputPath}`,
    },
  ]
}

module.exports = fileCopyConfig
