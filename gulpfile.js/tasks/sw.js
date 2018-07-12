const requireCached = require('../src/gulp/require-cached');
const config = require('../config');
const path = require('path');

const gulp = requireCached('gulp');
const swPrecache = requireCached('sw-precache');

/**
 *  Gulp task for compiling serviceworker
 */
gulp.task('sw', function (callback) {

    swPrecache.write(path.join(path.resolve(config.projectDirectory, config.dest.getPath('sw')), 'sw.js'), {
        directoryIndex: false,
        staticFileGlobs: [config.source.getFileGlobs('sw')],
        stripPrefix: config.source.sw.strip,
        navigateFallback: '/?utm_source=homescreen'
    }, callback);

});
