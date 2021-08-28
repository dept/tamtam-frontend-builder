const imagemin = require('imagemin')
const imageminSvgo = require('imagemin-svgo')

const svgoOptions = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: { active: false },
          cleanupIDs: { active: false },
          removeTitle: { active: false },
          removeComments: { active: true },
          removeUnknownsAndDefaults: { active: false },
        },
      },
    },
  ],
}

const options = {
  plugins: [imageminSvgo(svgoOptions)],
}

const svgs = async buffer => await imagemin.buffer(buffer, options)

module.exports = svgs
