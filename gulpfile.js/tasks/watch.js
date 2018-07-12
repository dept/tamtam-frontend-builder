

const requireCached   = require('../src/gulp/require-cached');
const config          = require('../config');
const path            = require('path');

const gulp            = requireCached('gulp');
const watch           = requireCached('gulp-watch');
const browserSync     = requireCached('browser-sync');

let reloadTimeout;
const RELOAD_TIMEOUT_DELAY = 200; // in milliseconds




/**
 * Task for watching files and running related tasks when needed.
 * JavaScript is done via watchify instead for this task for optimized configuration.
 * @see https://www.npmjs.com/package/gulp-watch
 */
gulp.task('watch', ['js-watch'], function () {

    watch(config.source.getFileGlobs('images'),
        function () { gulp.start('images'); });

    watch(config.source.getFileGlobs('svg'),
        function () { gulp.start('svg'); });

    watch(config.source.getPath('components', '**/*.scss'),
        function () {
            gulp.start('css');
            gulp.start('css-lint');
            gulp.start('inject-component-css');
        });

    watch(config.source.getPath('css', '**/*.scss'),
        function () {
            gulp.start('css');
            gulp.start('css-lint');
        });

    watch(config.source.getPath('components', '**/*.html'),
        function () { gulp.start('html'); });

    watch(config.source.getPath('html', '**'),
        function () { gulp.start('html'); });

    watch(config.source.getFileGlobs('data'),
        function () { gulp.start('html'); });

    watch(path.resolve(config.projectDirectory, config.dest.getPath('html', '**/*.html')), onHTMLChange);

});



/**
 *  A separate function to refresh the browser. This is to bypass a known bug in chrome.
 *  see: https://github.com/BrowserSync/browser-sync/issues/155
 */
function onHTMLChange() {

    if (reloadTimeout) clearTimeout(reloadTimeout);
    reloadTimeout = setTimeout(browserSync.reload, RELOAD_TIMEOUT_DELAY);

}

