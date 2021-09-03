const path = require('path')
const nunjucks = require('nunjucks')
const chalk = require('chalk')
const glob = require('glob')
const globParent = require('glob-parent')
const fileEntryCache = require('file-entry-cache')
const logging = require('../../../../utils/logging')
const SyncHook = require('tapable').SyncHook
const getGlobalContext = require('../utils/getGlobalContext')

const PLUGIN_NAME = 'NunjucksWebpackPlugin'

const hooks = {
  emitHook: new SyncHook(['templates']),
}

const emitHook = () => null

class NunjucksWebpackPlugin {
  constructor(options) {
    this.options = Object.assign(
      {},
      {
        configure: {
          options: {},
          path: '',
        },
        templates: [],
        paths: '',
      },
      options || {},
    )

    this.watchFiles = this.getFiles()
    this.cache = fileEntryCache.create('nunjucks')
    // Clear the cache after we create it to make sure previous created caches are removed
    this.cache.destroy()

    if (!Array.isArray(this.options.templates) || this.options.templates.length === 0) {
      throw new Error('Options `templates` must be an empty array')
    }
  }

  apply(compiler) {
    emitHook.bind(this, { compiler })

    let output = compiler.options.output.path

    if (output === '/' && compiler.options.devServer && compiler.options.devServer.outputPath) {
      output = compiler.options.devServer.outputPath
    }

    const emitCallback = compilation => {
      this.compileStart()

      const templates = this.cache.getUpdatedFiles(this.watchFiles)
      const configure =
        this.options.configure instanceof nunjucks.Environment
          ? this.options.configure
          : nunjucks.configure(this.options.configure.path, this.options.configure.options)

      configure.addGlobal('global', getGlobalContext())

      const promises = []

      if (templates.length) {
        this.options.templates.forEach(template => {
          if (!template.from)
            compilation.errors.push(new Error('Each template should have `from` option'))

          if (!template.to)
            compilation.errors.push(new Error('Each template should have `to` option'))

          configure.render(template.from, template.context, (err, res) => {
            if (err) {
              compilation.errors.push(err)
              return
            }

            let webpackTo = template.to

            if (path.isAbsolute(webpackTo)) {
              webpackTo = path.relative(output, webpackTo)
            }

            const source = {
              size: () => res.length,
              source: () => res,
            }

            promises.push({
              ...template,
              source,
            })
          })
        })

        compilation.hooks.processAssets.tapAsync(
          {
            name: PLUGIN_NAME,
            stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          async (_, callback) => {
            try {
              const data = await Promise.all(promises)
              data.forEach(template => {
                const asset = compilation.getAsset(template.to)
                compilation[asset ? 'updateAsset' : 'emitAsset'](
                  template.to,
                  new compiler.webpack.sources.RawSource(template.source.source()),
                )
              })
            } catch (error) {
              compilation.errors.push(error)
            } finally {
              this.cache.reconcile()
              hooks.emitHook.call(this.options.templates)
              this.compileEnd()
              callback()
            }
          },
        )
      } else {
        this.compileEnd()
      }
    }

    const afterEmitCallback = async (compilation, callback) => {
      this.watchFiles = this.getFiles()
      this.watchFiles.map(file => {
        const parentDir = globParent(file)
        if (parentDir) compilation.contextDependencies.add(parentDir)
        compilation.fileDependencies.add(file)
      })
      return callback()
    }

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, emitCallback)
    compiler.hooks.afterEmit.tapAsync(PLUGIN_NAME, afterEmitCallback)
  }

  getFiles() {
    return this.options.paths.map(p => glob.sync(p)).flat()
  }

  compileStart() {
    this.start = new Date()
    logging.success({
      time: this.start,
      message: `${chalk.bold('Starting')} '${PLUGIN_NAME}'`,
    })
  }

  compileEnd() {
    this.end = new Date()
    const time = this.end.getTime() - this.start.getTime()
    logging.success({
      time: this.end,
      message: `${chalk.bold('Finished')} '${PLUGIN_NAME}' after ${chalk.bold(`${time}ms`)}`,
    })
  }
}

module.exports = { hooks, NunjucksWebpackPlugin }
