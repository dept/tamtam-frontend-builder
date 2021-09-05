const imagemin = require('imagemin')
const imageminSvgo = require('imagemin-svgo')

const svgoOptions = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          cleanupIDs: false,
          removeTitle: false,
          removeComments: true,
          removeUnknownsAndDefaults: false,
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
