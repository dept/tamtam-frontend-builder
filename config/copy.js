const images = require('../webpack/plugins/copy/images')
const svgs = require('../webpack/plugins/copy/svgs')

const defaultOptions = {
  noErrorOnMissing: true,
}

function fileCopyConfig(config) {
  return [
    {
      ...defaultOptions,
      from: config.images,
      to: `${config.imagesOutputPath}`,
      transform: async (image, filePath) => {
        if (config.isDevelopment || filePath.includes('tmp')) return image
        return await images(image, filePath)
      },
    },
    {
      ...defaultOptions,
      from: config.svg,
      to: `${config.svgOutputPath}`,
      transform: {
        transformer: async svg => await svgs(svg),
        cache: true,
      },
    },
    {
      ...defaultOptions,
      from: config.favicons,
      to: `${config.faviconsOutputPath}`,
    },
    {
      ...defaultOptions,
      from: config.fonts,
      to: `${config.fontsOutputPath}`,
    },
  ]
}

module.exports = fileCopyConfig
