const path = require('path')
const sharp = require('sharp')
const logging = require('../../../utils/logging')
const chalk = require('chalk')

const defaultOptions = {
  jpeg: {
    // https://sharp.pixelplumbing.com/api-output#jpeg
    quality: 100,
  },
  webp: {
    // https://sharp.pixelplumbing.com/api-output#webp
    lossless: true,
  },
  avif: {
    // https://sharp.pixelplumbing.com/api-output#avif
    lossless: true,
  },
  // png by default sets the quality to 100%, which is same as lossless
  // https://sharp.pixelplumbing.com/api-output#png
  png: {},
  // gif does not support lossless compression at all
  // https://sharp.pixelplumbing.com/api-output#gif
  gif: {},
}

const targets = {
  png: 'png',
  jpg: 'jpeg',
  jpeg: 'jpeg',
  jxl: 'jxl',
  webp: 'webp',
  avif: 'avif',
  gif: 'gif',
}

const images = async (buffer, filePath) => {
  const image = sharp(filePath)

  const meta = await image.metadata().catch((error) => {
    logging.error({
      message: `Error reading metadata from image: ${filePath}`,
      error,
    })

    return buffer;
  })

  const { format } = meta

  const targetCodec = targets[format]
  if (!targetCodec) return buffer

  const { data, info: outputInfo } = await image[format](defaultOptions[targetCodec]).toBuffer({
    resolveWithObject: true,
  })

  const inputSize = Buffer.byteLength(buffer)
  const outputSize = outputInfo.size

  if(outputSize > inputSize) {
    logging.warning({
      message: `${chalk.bold('Not saving:')} '${path.basename(filePath)}' optimization was ${chalk.bold(
        ` ${Math.round((outputSize - inputSize) / 1000 )} kb bigger`,
      )}`,
      time: new Date(),
    })

    return buffer
  }

  logging.success({
    message: `${chalk.bold('Finished optimizing:')} '${path.basename(filePath)}' saved ${chalk.bold(
      `${(100 - (outputSize / inputSize) * 100).toFixed(2)}%`,
    )}`,
    time: new Date(),
  })

  return data
}

module.exports = images
