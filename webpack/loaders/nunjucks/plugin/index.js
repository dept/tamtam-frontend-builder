const path = require("path");
const nunjucks = require("nunjucks");

const pluginName = "NunjucksWebpackPlugin";

class NunjucksWebpackPlugin {
  constructor(options) {
    this.options = Object.assign(
      {},
      {
        configure: {
          options: {},
          path: ""
        },
        templates: []
      },
      options || {}
    );

    if (
      !Array.isArray(this.options.templates) ||
      this.options.templates.length === 0
    ) {
      throw new Error("Options `templates` must be an empty array");
    }
  }

  apply(compiler) {
    const fileDependencies = [];

    let output = compiler.options.output.path;

    if (
      output === "/" &&
      compiler.options.devServer &&
      compiler.options.devServer.outputPath
    ) {
      output = compiler.options.devServer.outputPath;
    }

    const emitCallback = (compilation) => {

      const configure =
        this.options.configure instanceof nunjucks.Environment
          ? this.options.configure
          : nunjucks.configure(
              this.options.configure.path,
              this.options.configure.options
            );

      const promises = [];

      const baseContext = {
        __webpack__: {
          hash: compilation.hash
        }
      };

      this.options.templates.forEach(template => {
        if (!template.from) {
          throw new Error("Each template should have `from` option");
        }

        if (!template.to) {
          throw new Error("Each template should have `to` option");
        }

        if (fileDependencies.indexOf(template.from) === -1) {
          fileDependencies.push(template.from);
        }


        const res = configure.render(
          template.from,
          Object.assign(baseContext, template.context),
        );


        let webpackTo = template.to;

        if (path.isAbsolute(webpackTo)) {
          webpackTo = path.relative(output, webpackTo);
        }

        const source = {
          size: () => res.length,
          source: () => res
        };

        promises.push({
          ...template,
          source
        })

        // if (template.writeToFileEmit) {
        //   const fileDest = path.join(output, webpackTo);
        //   promises.push(fs.outputFile(fileDest, source.source()));
        // }

      });

      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          additionalAssets: true
        },
        (assets, callback) => {
          Promise.all(promises)
            .then((data) => {
                data.forEach(template => {
                  const asset = compilation.getAsset(template.to)
                  compilation[asset ? 'updateAsset' : 'emitAsset'](
                    template.to,
                    new compiler.webpack.sources.RawSource(template.source.source())
                  );
                })
                callback()
            })
            .catch(error => {
              compilation.errors.push(error);
            })
        }
      )

    };

    const afterEmitCallback = (compilation, callback) => {
      let compilationFileDependencies = compilation.fileDependencies;
      let addFileDependency = file => compilation.fileDependencies.add(file);

      if (Array.isArray(compilation.fileDependencies)) {
        compilationFileDependencies = new Set(compilation.fileDependencies);
        addFileDependency = file => compilation.fileDependencies.push(file);
      }

      for (const file of fileDependencies) {
        if (!compilationFileDependencies.has(file)) {
          addFileDependency(file);
        }
      }

      return callback();
    };

    compiler.hooks.thisCompilation.tap(pluginName, emitCallback);
    compiler.hooks.afterEmit.tapAsync(pluginName, afterEmitCallback);
  }
}

module.exports = NunjucksWebpackPlugin;
