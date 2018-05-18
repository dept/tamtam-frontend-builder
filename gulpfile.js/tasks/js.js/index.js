const requireCached             = require('../../src/gulp/require-cached');
const config                    = require('../../config');
const log                       = require('../../src/debug/log');
const fs                        = require('fs');
const gulp                      = requireCached('gulp');
const webpack                   = requireCached('webpack');

const webpackConfigs            = require('./webpack-config');
const hasESFile                 = fs.existsSync(`${config.source.javascript}/main-es.js`);
const shownMissingLintWarning   = 0;
const warningLimit              = 4;

const compilerConfigs = {};

compilerConfigs.legacyConfig = webpackConfigs.legacyConfig;
if ( hasESFile ) compilerConfigs.modernConfig = webpackConfigs.modernConfig;

gulp.task('js', function (callback) {

    Promise.all(createCompilerPromise(compilerConfigs))
        .then(() => callback())
        .catch(e => console.warn('Error whilst compiling JS', e));


});

module.exports = {
    compilerConfigs
}
