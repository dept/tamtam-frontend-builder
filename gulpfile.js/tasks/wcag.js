//@formatter:off

const requireCached = require('../src/gulp/require-cached');
const config = require('../config');
const path = require('path');

const gulp = requireCached('gulp');
const gulpAccessibility = requireCached('gulp-accessibility');
// @formatter:on

/**
 * Task for checking WCAG2 requirements
 * @see: https://github.com/yargalot/gulp-accessibility
 */

gulp.task('wcag', function () {

    var options = {
        accessibilityLevel: 'WCAG2A',
        force: true,
        reportLevels: {
            notice: false,
            warning: false,
            error: true
        }
    };

    return gulp.src([
        path.resolve(config.projectDirectory, config.dest.getPath('root')) + "/*.html",
        '!' + path.resolve(config.projectDirectory, config.dest.getPath('root')) + "/README.html",
        '!' + path.resolve(config.projectDirectory, config.dest.getPath('root')) + "/styleguide.html"
    ])
        .pipe(gulpAccessibility(options));

});
