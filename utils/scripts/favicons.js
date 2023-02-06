const { favicons } = require('favicons')
const fs = require('fs')
const config = require('../get-config')
const resolveApp = require('../resolve-app')

async function generateFavicons() {
  const favicon = require(resolveApp('config/favicons.js'))(config)

  try {
    const response = await favicons(favicon.source, favicon.faviconsPlugin)

    const metaTags = response.html.join('\n')

    response.images.forEach(image => {
      fs.writeFileSync(`${favicon.folder}/${image.name}`, image.contents)
    })

    response.files.forEach(file => {
      fs.writeFileSync(`${favicon.folder}/${file.name}`, file.contents)
    })

    await fs.writeFileSync(favicon.output, metaTags)
  } catch (error) {
    if (error) throw new Error(error.message)
  }
}

module.exports = generateFavicons
