const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminnMozjpeg = require('imagemin-mozjpeg');
const imageminSvgo = require('imagemin-svgo');
const { extendDefaultPlugins } = require('svgo')

const mozjpegOptions = {
    progressive: true,
    quality: 85,
};

const svgoOptions = {
    plugins: extendDefaultPlugins([
      { name: 'removeViewBox', active: false },
      { name: 'cleanupIDs', active: false },
      { name: 'removeTitle', active: false },
      { name: 'removeComments', active: true },
      { name: 'removeUnknownsAndDefaults', active: false },
    ]),
};

const options = {
    optimizationLevel: 3,
    progressive: false,
    interlaces: false,
    plugins: [
      imageminJpegtran(),
      imageminPngquant({ quality: [0.65, 0.8] }),
      imageminnMozjpeg(mozjpegOptions),
      imageminSvgo(svgoOptions),
    ],
};

function images(buffer) {
    return imagemin.buffer(buffer, options);
}

module.exports = images;
