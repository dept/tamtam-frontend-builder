// @formatter:off

var requireCached   = require('../src/gulp/require-cached');
var config          = require('../config');

var gulp            = requireCached('gulp');
var watch           = requireCached('gulp-watch');
var browserSync     = requireCached('browser-sync');

var reloadTimeout;
var RELOAD_TIMEOUT_DELAY = 200; // in milliseconds

// @formatter:on


/**
 * Task for watching files and running related tasks when needed.
 * JavaScript is done via watchify instead for this task for optimized configuration.
 * @see https://www.npmjs.com/package/gulp-watch
 */
gulp.task('watch', ['js-watch'], function (callback) {

    watch(config.source.getFileGlobs('images'),
        function (events, done) { gulp.start('images'); });

    watch(config.source.getFileGlobs('svg'),
        function (events, done) { gulp.start('svg'); });

    watch(config.source.getPath('components', '**/*.scss'),
        function (events, done) {
            gulp.start('css');
            gulp.start('css-lint');
            gulp.start('inject-component-css');
        });

    watch(config.source.getPath('css', '**/*.scss'),
        function (events, done) {
            gulp.start('css');
            gulp.start('css-lint');
        });

    watch(config.source.getPath('components', '**/*.html'),
        function (events, done) { gulp.start('html'); });

    watch(config.source.getPath('html', '**'),
        function (events, done) { gulp.start('html'); });

    watch(config.source.getFileGlobs('data'),
        function (events, done) { gulp.start('html'); });

    watch(config.dest.getPath('html', '**/*.html'), onHTMLChange);

});

// @formatter:on

/**
 *  A separate function to refresh the browser. This is to bypass a known bug in chrome.
 *  see: https://github.com/BrowserSync/browser-sync/issues/155
 */
function onHTMLChange(events, done) {

    if (reloadTimeout) clearTimeout(reloadTimeout);
    reloadTimeout = setTimeout(browserSync.reload, RELOAD_TIMEOUT_DELAY);

}

