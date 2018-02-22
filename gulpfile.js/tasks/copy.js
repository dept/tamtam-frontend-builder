// @formatter:off

var requireCached     		= require('../src/gulp/require-cached');
var log                     = require('../src/debug/log');
var config                  = require('../config');

var gulp                    = requireCached('gulp');
var changed                 = requireCached('gulp-changed');
var mergeStream             = requireCached('merge-stream');

// @formatter:on

/**
 *  Gulp task for copying Bower assets to the destination folder.
 *  @see: https://www.npmjs.com/package/del
 */
gulp.task('copy', function () {


    var files = config.copy && typeof config.copy === 'function' ? config.copy() : null;
    var streams = [];

    if(!files || !files.length) return null;


    for (var i = 0, leni = files.length; i < leni; i++)
    {
        var source = files[i].source;
        var dest = files[i].dest;

        if(!source)
        {
            log.error({
                message: 'assets config needs to have a \'source\' property!',
                sender: 'copyAssets'
            });
            continue;
        }

        if(!dest)
        {
            log.error({
                message: 'assets config needs to have a \'dest\' property!',
                sender: 'copyAssets'
            });
            continue;
        }

        streams.push(
            gulp.src(source)

                .pipe(changed(dest))            // Ignore unchanged files
                .pipe(gulp.dest(dest))          // Push the files straight to their destination
                );

    }


    return mergeStream(streams);

});
