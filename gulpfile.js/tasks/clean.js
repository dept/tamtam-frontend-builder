// @formatter:off

const requireCached = require('../src/gulp/require-cached');
const log = require('../src/debug/log');
const config = require('../config');
const path = require('path');

const gulp = requireCached('gulp');
const gulpUtil = requireCached('gulp-util');
const del = requireCached('del');

// @formatter:on

/**
 *  Gulp task for cleaning up the destination folder.
 *  Deletes all files that match the patterns in the option.source
 *  @see: https://www.npmjs.com/package/del
 */
gulp.task('clean', function (callback) {

    if (!config.cleanBuild) {

        if (typeof callback === 'function') callback.call(this);

        return;

    }


    const options = {

        // define file patterns to delete here
        source: path.resolve(config.projectDirectory, config.dest.getPath('javascript'), '**'),

        // log deleted files
        verbose: config.gulp.verbose

    };


    let deletedFiles;

    try {

        deletedFiles = del.sync(options.source);

    } catch (error) {

        log.error(error);

    }


    if (options.verbose && deletedFiles) {

        let filesDeletedString = '';
        const currentWorkingDirectory = process.cwd();
        for (let i = 0, leni = deletedFiles.length; i < leni; i++) filesDeletedString += '\n\t\t' + deletedFiles[i];

        // remove CWD path of the file names.
        filesDeletedString = filesDeletedString.replace(new RegExp(currentWorkingDirectory, 'g'), '');

        log.info({
            sender: 'clean task',
            message: 'Files deleted during cleanup:',
            data: [gulpUtil.colors.yellow(filesDeletedString)]
        });

    }

    if (callback) callback.call(this);


});
