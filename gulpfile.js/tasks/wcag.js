//@formatter:off

var requireCached     			= require('../src/gulp/require-cached');
var config                      = require('../config');

var gulp                        = requireCached('gulp');
var gulpAccessibility           = requireCached('gulp-accessibility');
var rename                      = requireCached('gulp-rename');

// @formatter:on

/**
 * Task for checking WCAG2 requirements
 * @see: https://github.com/yargalot/gulp-accessibility
 */

gulp.task('wcag', function() {

    var options = {
        accessibilityLevel: 'WCAG2A',
        force: true,
        reportLevels: {
            notice: false,
            warning: false,
            error: true
        }
    };

    return gulp.src( [
        config.dest.getPath('root')+"/*.html",
        '!'+config.dest.getPath('root')+"/README.html",
        '!'+config.dest.getPath('root')+"/styleguide.html"
    ] )
    .pipe( gulpAccessibility(options) );

});
