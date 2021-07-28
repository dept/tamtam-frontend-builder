const path = require('path')
const { ImagePool } = require('@squoosh/lib')

const defaultOptions = {
  mozjpeg: {
    quality: 100,
  },
  webp: {
    lossless: 1,
  },
  avif: {
    cqLevel: 0,
  },
}

const targets = {
  '.png': 'oxipng',
  '.jpg': 'mozjpeg',
  '.jpeg': 'mozjpeg',
  '.jxl': 'jxl',
  '.webp': 'webp',
  '.avif': 'avif',
}

const images = async (buffer, filePath) => {
  const ext = path.extname(filePath).toLowerCase()
  const targetCodec = targets[ext]

  if (!targetCodec) return buffer

  const options = {
    [targetCodec]: {
      ...defaultOptions[targetCodec],
    },
  }

  const imagePool = new ImagePool()
  const image = imagePool.ingestImage(buffer)
  await image.encode(options)
  await imagePool.close()

  return Buffer.from((await image.encodedWith[targetCodec]).binary)
}

module.exports = images
