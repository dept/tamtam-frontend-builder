// @formatter:off

var requireCached     		= require('../src/gulp/require-cached');
var config                  = require('../config');
var path                    = require('path');

var gulp                    = requireCached('gulp');
var gulpIf                  = requireCached('gulp-if');
var gulpConcat              = requireCached('gulp-concat');
var uglify                  = requireCached('gulp-uglify');
var sourcemaps              = requireCached('gulp-sourcemaps');

// @formatter:on

/**
 * Task for optimizing images (size).
 * @see https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task('libs', function () {

    var options = {

        uglifyOptions: {
            mangle: true,               // Pass false to skip mangling names.
            preserveComments: false     // 'all', 'some', {function}
        }

    };

    var libs = (typeof config.libs === 'function') ? config.libs() : null;

    if(!libs || !libs.length) return null;

    return gulp.src( libs )

        .pipe( gulpIf( config.sourcemaps, sourcemaps.init( ) ) )
        .pipe( gulpConcat('libs.js') )
        .pipe( gulpIf( config.minify, uglify( options.uglifyOptions ) ) )
        .pipe( gulpIf( config.sourcemaps, sourcemaps.write( '.' ) ) )
        .pipe( gulp.dest( config.dest.getPath( 'javascript' ) ) );                  // Export

} );
