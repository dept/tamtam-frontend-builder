var requireCached     		= require('../src/gulp/require-cached');
var log                     = require('../src/debug/log');
var config                  = require('../config');
var path                    = require('path');

var gulp                    = requireCached('gulp');
var changed                 = requireCached('gulp-changed');
var swPrecache              = requireCached('sw-precache');

/**
 *  Gulp task for compiling serviceworker
 */
gulp.task('sw', function (callback) {

    swPrecache.write(path.join(config.dest.getPath('sw'), 'sw.js'), {
        directoryIndex: false,
        staticFileGlobs: [config.source.getFileGlobs('sw')],
        stripPrefix: config.source.sw.strip,
        navigateFallback: '/?utm_source=homescreen'
    }, callback);

});
