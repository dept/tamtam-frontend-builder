const requireCached = require('../src/gulp/require-cached')
const config = require('../config')
const runSequence = require('run-sequence')
const path = require('path')
const walkFileListSync = require('../src/node/file/walk-file-list-sync')

const gulp = requireCached('gulp')
const inject = requireCached('gulp-inject')

const createComponentsArray = folder => {
  const components = walkFileListSync(config.source.getPath(folder), 'stylesheet')
  return [].reduce.call(
    components,
    (data, component) => {
      data.push(path.join(component, '*.scss'))
      return data
    },
    [],
  )
}

/**
 * Task for injecting scss
 */
gulp.task('inject-component-css', function() {
  const components = createComponentsArray('components')

  var injectComponentsFiles = gulp.src(components, { read: false })

  var injectComponentsOptions = {
    transform: filePath => `@import '${filePath.replace('.scss', '')}';`,
    starttag: '/* components:scss */',
    endtag: '/* endinject */',
    addRootSlash: false,
  }

  return gulp
    .src(config.source.getFileGlobs('css'))
    .pipe(inject(injectComponentsFiles, injectComponentsOptions))
    .pipe(gulp.dest(file => file.base))
})
