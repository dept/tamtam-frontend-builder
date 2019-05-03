const requireCached = require('../src/gulp/require-cached');
const config = require('../config');
const path = require('path');

const gulp = requireCached('gulp');
const workboxBuild = requireCached('workbox-build');

/**
 *  Gulp task for compiling serviceworker
 */
gulp.task('sw', function(callback) {
    const swDest = path.join(
        path.resolve(config.projectDirectory, config.dest.getPath('sw')),
        'sw.js'
    );

    const swConfig = config.source.sw;

    // Added for backwards compatibility
    if (swConfig.files) delete swConfig.files;
    if (swConfig.strip) delete swConfig.strip;
    if (swConfig.path) {
        if (!swConfig.globDirectory) swConfig.globDirectory = swConfig.path;
        delete swConfig.path;
    }

    workboxBuild
        .generateSW({
            swDest,
            navigateFallback: '/?utm_source=homescreen',
            importScripts: ['/assets/sw-extend.js'],
            ...swConfig
        })
        .then(({ count, size }) => {
            const sizeInMB = (size / Math.pow(1024, 2)).toFixed(2);
            console.log(
                `Generated ${swDest}, which will precache ${count} files, totaling ${sizeInMB} MB.`
            );
            callback();
        });
});
