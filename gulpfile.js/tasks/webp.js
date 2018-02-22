// @formatter:off

var requireCached         = require('../src/gulp/require-cached');
var config                = require('../config');

var changed               = requireCached('gulp-changed');
var gulp                  = requireCached('gulp');
var gulpIf                = requireCached('gulp-if');
var webp                  = requireCached('gulp-webp');

// @formatter:on

/**
 * Task for optimizing images (size).
 * @see https://www.npmjs.com/package/gulp-webp
 */
gulp.task('webp', function () {

    return gulp.src( config.source.getFileGlobs( 'webp' ) )
        .pipe( changed( config.dest.getPath( 'webp' ) ) )     // Ignore unchanged files
        .pipe( gulpIf( config.convertWebp, webp()))           // Convert
        .pipe( gulp.dest( config.dest.getPath( 'webp' ) ) );  // Export

} );
