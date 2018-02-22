// @formatter:off

var requireCached       = require('../src/gulp/require-cached');
var config              = require('../config');
var fileEmptyCheck      = require('../src/function/file-empty-check');

var changed             = requireCached('gulp-changed');
var gulp                = requireCached('gulp');
var svgmin              = requireCached('gulp-svgmin');
var through             = requireCached('through2');
var path                = requireCached('path');

var SVG_CLASS_PREFIX    = 'svg-';

// @formatter:on


/**
 * Task for optimizing svg images and making them available in the markup.
 * @see https://www.npmjs.com/package/gulp-svgmin
 */
gulp.task('svg', function () {

    var options = {

        svgmin: {
            js2svg: {
                pretty: false // pretty printed svg
            },
            plugins: [
                { cleanupIDs: false },               //Set to false for WCAG reasons
                { removeTitle: false },              //Set to false for WCAG reasons
                { removeComments: true },
                { removeUnknownsAndDefaults: false } //Useful for when adding aria-labels / roles to svg tags.
            ]
        }

    };


    return gulp.src(config.source.getFileGlobs('svg'))

        .pipe(changed(config.dest.getPath('svg')))        // Ignore unchanged files
        .pipe(fileEmptyCheck())
        .pipe(addSvgClass())
        .pipe(svgmin(options.svgmin))                       // Optimize
        .pipe(gulp.dest(config.dest.getPath('svg')))      // Export

});

function addSvgClass(cb) {
    return through.obj(function (file, enc, cb) {

        var name = file.path.replace(file.base, '').replace(/\\|\//g, '-').replace(/\.svg$/, '');
        var className = SVG_CLASS_PREFIX + name;

        var newSvg = file.clone();

        var contents = file.contents.toString();

        // Look for existing classes
        if (contents.match(/class="(.*?)"/)) {
            contents = contents.replace(/class="(.*?)"/, (m, $1) => { `class="${$1} ${className}"` });
        }
        else {
            contents = contents.replace('<svg', `<svg class="${className}"`);
        }

        // Apply the modified contents
        file.contents = new Buffer(contents, 'utf8');

        // Push the modified SVG to the buffer
        this.push(file);

        // returning the file stream
        return cb();

    });
}
