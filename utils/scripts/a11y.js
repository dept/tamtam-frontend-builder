const path = require('path')
const fs = require('fs')
const express = require('express')
const serveStatic = require('serve-static')

const logging = require('../logging')
const config = require('../get-config')
const resolveApp = require('../resolve-app')
const getFileList = require('../file/get-list')
const generateFileGlobs = require('../file/generate-file-globs')
const pa11y = require('pa11y')
const reporter = require('pa11y/lib/reporters/cli')
const pa11yConfig = require(resolveApp('.pa11yconfig.js'))

const app = express()
const port = process.env.PORT || 8000
const serverUrl = `http://localhost:${port}`
const htmlBuildPath = resolveApp(path.join(config.dist, config.htmlOutputPath))

app.use(serveStatic(htmlBuildPath, { index: ['default.html'] }))
app.listen(port)

const accessibilityScanner = async () => {
  const screenshotPath = resolveApp('a11y-scan-screenshots')

  logging.warning({
    message: 'Scanning for files',
  })

  const files = getFileList(
    generateFileGlobs(htmlBuildPath, ['{*.html, !(_dev|generic|layouts)**/*.html}']),
  ).map(file => `${serverUrl}${file.replace(htmlBuildPath, '')}`)

  logging.success({
    message: `Found ${files.length} files`,
  })

  files.map(f =>
    logging.success({
      message: f.replace(resolveApp(''), ''),
    }),
  )

  try {
    try {
      await fs.promises.access(screenshotPath)
    } catch {
      await fs.promises.mkdir(screenshotPath, { recursive: true })
    }

    let results = await Promise.all(
      files.map(path =>
        pa11y(path, {
          ...pa11yConfig,
          screenCapture: `${screenshotPath}/${path
            .replace(`${serverUrl}/`, '')
            .replace(/(\/|\.)/g, '-')}.png`,
        }),
      ),
    )
    await Promise.all(
      results.map(async result => {
        const report = await reporter.results(result)
        console.log(report)
      }),
    )

    if (results.some(r => r.issues.find(issue => issue.type === 'error'))) {
      throw new Error('Found a11y errors')
    }
  } catch (error) {
    logging.error({ message: error })
    process.exit(1)
  }
}

Object.defineProperty(accessibilityScanner, 'name', {
  value: 'Accessibility scan',
})

module.exports = accessibilityScanner
