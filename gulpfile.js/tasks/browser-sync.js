const requireCached = require('../src/gulp/require-cached')
const config = require('../config')
const path = require('path')

const browserSync = requireCached('browser-sync')
const gulp = requireCached('gulp')
const compression = requireCached('compression')

/**
 * Task to run BrowserSync.
 * BrowserSync makes your tweaking and testing faster by synchronising
 * file changes and interactions across multiple devices
 * @see http://www.browsersync.io/
 */
gulp.task('browser-sync', function() {
  var options = {
    // ghostMode: false,

    // port: 3000,

    server: {
      // Serve up our build folder
      baseDir: path.resolve(config.projectDirectory, config.dest.getPath('root')),

      // Enables CORS to solve cross domain issues
      // @see https://hondo.wtf/2015/02/15/enable-cors-in-browsersync
      middleware: [
        compression(),
        function(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*')
          next()
        },
      ],
    },
  }

  browserSync(options)
})
