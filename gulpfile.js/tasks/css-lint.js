var requireCached               = require('../src/gulp/require-cached');
var config                      = require('../config');
var log                         = require('../src/debug/log');
var path                        = require('path');

var gulp                        = requireCached('gulp');
var sassLint                    = requireCached('gulp-sass-lint');

gulp.task('css-lint', function () {

    return gulp.src( path.resolve(config.source.root.path, 'sass', '**/*.scss') )
        .pipe(sassLint({
            configFile: `${config.projectDirectory}/.sass-lint.yml`
        }))
        .pipe(sassLint.format())

} );
