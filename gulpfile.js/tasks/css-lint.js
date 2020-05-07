const requireCached = require('../src/gulp/require-cached')
const config = require('../config')
const log = require('../src/debug/log')
const path = require('path')
const fs = require('fs')
const error = require('../../utils/error')

const gulp = requireCached('gulp')
const sassLint = requireCached('gulp-sass-lint')

const hasLintfile = fs.existsSync(`${config.projectDirectory}/.sass-lint.yml`)
let shownMissingLintWarning = 0
const warningLimit = 2

function cssLint() {
  if (!hasLintfile) {
    if (shownMissingLintWarning < warningLimit)
      error("You don't use CSS Linting yet. Please upgrade ASAP.", true)
    shownMissingLintWarning++
    return
  }

  return gulp
    .src([
      path.resolve(config.source.getPath('root'), 'sass', '**/*.scss'),
      path.resolve(config.source.getPath('components'), '**/*.scss'),
    ])
    .pipe(
      sassLint({
        configFile: `${config.projectDirectory}/.sass-lint.yml`,
      }),
    )
    .pipe(sassLint.format())
}

module.exports = {
  cssLint,
}
