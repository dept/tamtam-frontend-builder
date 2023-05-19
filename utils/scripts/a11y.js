const os = require('os')
const path = require('path')
const fs = require('fs')
const url = require('url')
const express = require('express')

const serveStatic = require('serve-static')

const logging = require('../logging')
const config = require('../get-config')
const resolveApp = require('../resolve-app')
const getFileList = require('../file/get-list')
const generateFileGlobs = require('../file/generate-file-globs')
const safeWriteFileSync = require('../file/safe-write-file-sync')
const { Cluster } = require('puppeteer-cluster')
const pa11y = require('pa11y')
const cliReporter = require('pa11y/lib/reporters/cli')
const htmlReporter = require('pa11y/lib/reporters/html')
const a11yConfig = require(resolveApp('.a11yconfig.js'))

const app = express()
const port = process.env.PORT || 8000
const serverUrl = `http://localhost:${port}`
const htmlBuildPath = resolveApp(path.join(config.dist, config.htmlOutputPath))

app.use(serveStatic(htmlBuildPath, { index: ['index.html'] }))
app.listen(port)

const accessibilityScanner = async () => {
  const resultsPath = resolveApp('a11y-scan-results')

  const { pa11yConfig } = a11yConfig

  let cluster
  let queueIndex = 0
  try {
    logging.warning({
      message: 'Scanning for files',
    })

    const files = getFileList(
      generateFileGlobs(htmlBuildPath, ['{*.html, !(_dev|generic|layouts)**/*.html}']),
      undefined,
      undefined,
      a11yConfig.fileIgnore || [],
    ).map(file => file.replace(`${htmlBuildPath}/`, ''))

    logging.success({
      message: `Found ${files.length} files`,
    })

    cluster = await Cluster.launch({
      timeout: a11yConfig.timeout || 60000,
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: a11yConfig.maxWorkers || os.cpus() || 4, // cluster with four workers
      puppeteerOptions: { headless: 'new', ignoreHTTPSErrors: true },
    })

    // Launch our own browser
    const browser = cluster.browser.browser

    try {
      await fs.promises.access(resultsPath)
    } catch {
      await fs.promises.mkdir(resultsPath, { recursive: true })
    }

    cluster.task(async ({ page, data: { path } }) => {
      queueIndex++
      logging.warning({
        message: `(${queueIndex}/${files.length}) Running a11y scan for: ${path}`,
      })
      const location = `${serverUrl}/${path}`
      await page.goto(location, {
        waitUntil: 'networkidle0',
      })

      const height = await page.evaluate(() => document.documentElement.offsetHeight)

      return pa11y(location, {
        timeout: 60000,
        ...pa11yConfig,
        viewport: {
          width: 1280,
          ...pa11yConfig.viewport,
          height: height || 1024,
        },
        screenCapture: `${resultsPath}/${path
          .replace(`${serverUrl}/`, '')
          .replace(/(\/|\.)/g, '-')}.jpg`,
        browser,
        page,
      })
    })

    const results = await Promise.all(files.map(path => cluster.execute({ path })))

    await cluster.idle()

    let reportHtmlFiles = await Promise.all(
      results.map(async result => {
        console.log(cliReporter.results(result))
        const reportHtmlPath = `${resultsPath}${result.pageUrl.replace(serverUrl, '')}`
        return safeWriteFileSync(reportHtmlPath, await htmlReporter.results(result))
      }),
    )

    logging.success({
      message: 'Report files can be found here:',
    })

    logging.success({
      message: `${console.table(
        reportHtmlFiles.map(file => ({
          path: url.pathToFileURL(file).toString(),
        })),
      )}`,
    })

    await cluster.close()

    if (results.some(r => r.issues.find(issue => issue.type === 'error'))) {
      throw new Error(`Found a11y errors`)
    }
  } catch (error) {
    await cluster.close()

    logging.error({ message: error })
    process.exit(1)
  }
}

Object.defineProperty(accessibilityScanner, 'name', {
  value: 'Accessibility scan',
})

module.exports = accessibilityScanner
