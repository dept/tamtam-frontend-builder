const imagemin = require('imagemin')
const imageminSvgo = require('imagemin-svgo')
const { extendDefaultPlugins } = require('svgo')

const svgoOptions = {
  plugins: extendDefaultPlugins([
    { name: 'removeViewBox', active: false },
    { name: 'cleanupIDs', active: false },
    { name: 'removeTitle', active: false },
    { name: 'removeComments', active: true },
    { name: 'removeUnknownsAndDefaults', active: false },
  ]),
}

const options = {
  plugins: [imageminSvgo(svgoOptions)],
}

const svgs = async (buffer) => await imagemin.buffer(buffer, options)

module.exports = svgs
