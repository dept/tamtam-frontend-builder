const config            = require('../config');
const log               = require('../src/debug/log');
const requireCached     = require('../src/gulp/require-cached');

const compilerPromise   = require('./script/create-compiler-promise');
const browserSync       = requireCached('browser-sync');
const gulp              = requireCached('gulp');
const webpack           = requireCached('webpack');

gulp.task('js-watch', function jsWatch(callback) {

    let initialCompile = true;

    webpack(js.compilerConfigs.legacyConfig).watch(200, (error, stats) => {

        compilerPromise.onWebpackCallback(error, stats);

        if (initialCompile) {
            initialCompile = false;
            callback();
        }

        browserSync.reload();

    });

});
