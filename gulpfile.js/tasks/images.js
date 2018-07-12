// @formatter:off

const requireCached = require('../src/gulp/require-cached');
const config = require('../config');
const path = require('path');

const changed = requireCached('gulp-changed');
const gulp = requireCached('gulp');
const gulpIf = requireCached('gulp-if');
const imagemin = requireCached('gulp-imagemin');

// @formatter:on

/**
 * Task for optimizing images (size).
 * @see https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task('images', function () {

    const options = {

        config: {
            optimizationLevel: 3,  // default 3
            progressive: true,     // for JPG, default false
            interlaces: false,     // for GIF, default false
            multipass: false       // for SVG, default false
        }

    };

    return gulp.src(config.source.getFileGlobs('images'))

        .pipe(changed(path.resolve(config.projectDirectory, config.dest.getPath('images'))))                    // Ignore unchanged files
        .pipe(gulpIf(config.optimizeImages, imagemin(options.config)))   // Optimize
        .pipe(gulp.dest(path.resolve(config.projectDirectory, config.dest.getPath('images'))));                 // Export

});
