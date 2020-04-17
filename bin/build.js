#!/usr/bin/env node
const gulp = require('gulp')
require('../gulpfile.js/index.js')

global.current = {
  cwd: process.cwd(),
}

gulp.start('build')
