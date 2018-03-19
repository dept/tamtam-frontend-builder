var requireCached               = require('../src/gulp/require-cached');
var config                      = require('../config');
var log                         = require('../src/debug/log');
var path                        = require('path');
var fs                          = require('fs');
var error                       = require('../../utils/error');

var gulp                        = requireCached('gulp');
var sassLint                    = requireCached('gulp-sass-lint');

var hasLintfile                 = fs.existsSync(`${config.projectDirectory}/.sass-lint.yml`);

gulp.task('css-lint', function () {

    if ( !hasLintfile ) {
        error('You don\'t use CSS Linting yet. Please upgrade ASAP.', true);
        return;
    }

    return gulp.src( path.resolve(config.source.root.path, 'sass', '**/*.scss') )
        .pipe(sassLint({
            configFile: `${config.projectDirectory}/.sass-lint.yml`
        }))
        .pipe(sassLint.format())

} );
