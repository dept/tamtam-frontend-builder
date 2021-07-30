class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('DonePlugin', (stats) => {
      if (stats.compilation.options.mode === 'production')
        setTimeout(() => {
          process.exit(0)
        })
    })
  }
}

module.exports = DonePlugin
