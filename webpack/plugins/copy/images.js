const path = require('path')
const { ImagePool } = require('@squoosh/lib')
const logging = require('../../../utils/logging')
const chalk = require('chalk')

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

const imagePool = new ImagePool()
const images = async (buffer, filePath) => {
  const ext = path.extname(filePath).toLowerCase()
  const targetCodec = targets[ext]

  if (!targetCodec) return buffer

  const options = {
    [targetCodec]: {
      ...defaultOptions[targetCodec],
    },
  }
  const image = imagePool.ingestImage(buffer)
  await image.encode(options)
  const output = await image.encodedWith[targetCodec]
  const inputSize = Buffer.byteLength(buffer)
  const outputSize = output.size

  logging.success({
    message: `${chalk.bold('Finished optimizing:')} '${path.basename(filePath)}' saved ${chalk.bold(
      `${(100 - (outputSize / inputSize) * 100).toFixed(2)}%`,
    )}`,
    time: new Date(),
  })

  return Buffer.from(output.binary)
}

module.exports = images
