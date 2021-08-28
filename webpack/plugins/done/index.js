const fs = require('fs')
const config = require('../../../utils/get-config')
const chalk = require('chalk')
const logging = require('../../../utils/logging')
const { hooks } = require('../nunjucks/plugin')
const { getCompilerHooks } = require('webpack-manifest-plugin')

const PLUGIN_NAME = 'DonePlugin'

class DonePlugin {
  apply(compiler) {
    const { afterEmit } = getCompilerHooks(compiler)

    afterEmit.tap(PLUGIN_NAME, (manifest) => (this.manifest = manifest))
    hooks.emitHook.tap(PLUGIN_NAME, (templates) => (this.templates = templates))

    compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
      if (!config.isDevelopment && config.buildStatic) {
        logging.success({
          time: new Date(),
          message: `${chalk.bold('Starting')} 'DonePlugin' updating file hashes`,
        })
        this.templates.forEach((template) => {
          const filePath = `${config.dist}/${template.to}`
          let file = fs.readFileSync(filePath, {
            encoding: 'utf-8',
          })
          for (const [oldName, newName] of Object.entries(this.manifest)) {
            file = file.replace(new RegExp(oldName, 'g'), newName)
          }
          fs.writeFileSync(filePath, file)
        })
        logging.success({
          time: new Date(),
          message: `${chalk.bold('Finished')} 'DonePlugin' file hashes updated`,
        })
      }

      if (stats.compilation.options.mode === 'production')
        setTimeout(() => {
          process.exit(0)
        })
    })
  }
}

module.exports = DonePlugin
