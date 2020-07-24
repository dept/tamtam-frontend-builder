const requireCached = require('../src/gulp/require-cached')
const config = require('../config')
const path = require('path')
const fs = require('fs')
const walkFileListSync = require('../src/node/file/walk-file-list-sync')

const gulp = requireCached('gulp')
const inject = requireCached('gulp-inject')

const createComponentsArray = folder => {
  const components = walkFileListSync(config.source.getPath(folder), 'stylesheet')
  return components.reduce((data, component) => {
    const files = fs.readdirSync(component)
    const filteredFiles = files.filter(file => !file.startsWith('__') && file.endsWith('.scss'))

    filteredFiles.forEach(file => data.push(path.join(component, file)))

    return data
  }, [])
}

/**
 * Task for injecting scss
 */
function injectComponentCss() {
  const components = createComponentsArray('components')

  const sassFolder = config.source.getPath('css')

  var injectComponentsFiles = gulp.src(components, {
    read: false,
    cwd: sassFolder,
  })

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
}

module.exports = {
  injectComponentCss,
}
