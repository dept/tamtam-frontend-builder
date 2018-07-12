

const requireCached = require('../src/gulp/require-cached');
const config = require('../config');
const path = require('path');

const changed = requireCached('gulp-changed');
const gulp = requireCached('gulp');
const gulpIf = requireCached('gulp-if');
const webp = requireCached('gulp-webp');



/**
 * Task for optimizing images (size).
 * @see https://www.npmjs.com/package/gulp-webp
 */
gulp.task('webp', function () {

    return gulp.src(config.source.getFileGlobs('webp'))
        .pipe(changed(config.dest.getPath('webp')))     // Ignore unchanged files
        .pipe(gulpIf(config.convertWebp, webp()))           // Convert
        .pipe(gulp.dest(path.resolve(config.projectDirectory, config.dest.getPath('webp'))));  // Export

});
