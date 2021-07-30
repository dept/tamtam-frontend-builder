const path = require('path')
const fs = require('fs')
const getList = require('../../../utils/file/get-list')
const config = require('../../../utils/get-config')
const replace = require('replace-in-files')
const replaceTags = require('../../../utils/replace-tags')
const walkFileListSync = require('../../../utils/file/walk-file-list-sync')

const PLUGIN_NAME = 'InjectComponentsCSSPlugin'

const createComponentsArray = (folder) => {
  const components = walkFileListSync(folder, 'stylesheet')
  return components.reduce((data, component) => {
    const files = fs.readdirSync(component)
    const filteredFiles = files.filter((file) => !file.startsWith('__') && file.endsWith('.scss'))

    filteredFiles.forEach((file) =>
      data.push(path.join(component, file).replace(config.source, '')),
    )

    return data
  }, [])
}

class InjectComponentsCSSPlugin {
  constructor(options) {
    this.options = options || {}

    if (!this.options.componentsPath || !this.options.start || !this.options.end) {
      throw new Error('Options `sourcePath`, `componentsPath`, `start` and `end` must be defined')
    }
  }

  apply(compiler) {
    let output = compiler.options.output.path

    if (output === '/' && compiler.options.devServer && compiler.options.devServer.outputPath) {
      output = compiler.options.devServer.outputPath
    }

    const compilationHandler = (compilation, callback) => {
      const componentsCssList = createComponentsArray(this.options.componentsPath).map(
        (c) => `@import '@${c.replace('.scss', '')}';`,
      )
      const sourceFileList = getList(this.options.sourcePath)

      const existingComponentsPromises = sourceFileList.map(
        (path) =>
          new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
              if (err) {
                reject(err)
              } else {
                const regex = new RegExp(
                  `${replaceTags(this.options.start)}(.*?)${replaceTags(this.options.end)}`,
                  'gsm',
                )
                const match = data.toString().match(regex)
                if (!match)
                  return resolve({
                    path,
                    data: null,
                  })
                const existingData = match
                  .toString()
                  .replace(this.options.start, '')
                  .replace(this.options.end, '')
                  .split('\n')
                  .filter((d) => d.length)
                resolve({ path, data: existingData })
              }
            })
          }),
      )

      Promise.all(existingComponentsPromises)
        .then((data) => {
          const insertPromises = []

          data
            .filter((d) => Boolean(d.data))
            .map((entry) => {
              const componentsToBeInserted = componentsCssList.filter(
                (component) => !entry.data.some((c) => c.includes(component)),
              )

              const insert = [...entry.data, ...componentsToBeInserted].join('\n')
              if (componentsToBeInserted.length) {
                insertPromises.push(
                  replace({
                    files: entry.path,
                    from: new RegExp(
                      `${replaceTags(this.options.start)}(.*?)${replaceTags(this.options.end)}`,
                      'gsm',
                    ),
                    to: `${this.options.start}\n${insert}\n${this.options.end}`,
                  }),
                )
              }
            })

          Promise.all(insertPromises).then(() => {
            callback()
          })
        })
        .catch((e) => {
          callback(e)
        })
    }

    compiler.hooks.beforeCompile.tapAsync(PLUGIN_NAME, compilationHandler)
  }
}

module.exports = InjectComponentsCSSPlugin
