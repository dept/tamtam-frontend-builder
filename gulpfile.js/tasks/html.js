const requireCached = require('../src/gulp/require-cached');
const config = require('../config');
const log = require('../src/debug/log');
const mergeJSONData = require('../src/data/json/merge');
const getFileList = require('../src/node/file/get-list');
const walkFileListSync = require('../src/node/file/walk-file-list-sync');
const packageJSON = require('../../package.json');
const SvgExtension = require('../src/template/nunjucks/tags/svg');
const DebugExtension = require('../src/template/nunjucks/tags/debug');

const assignFilter = require('../src/template/nunjucks/filters/assign');
const mergeFilter = require('../src/template/nunjucks/filters/merge');
const defaultsFilter = require('../src/template/nunjucks/filters/defaults');


const path = requireCached('path');
const fs = requireCached('fs');
const mkdirp = requireCached('mkdirp');
const gulp = requireCached('gulp');
const gulpData = requireCached('gulp-data');
const gulpNunjucks = requireCached('gulp-nunjucks-render');
const htmlmin = requireCached('gulp-htmlmin');
const gulpif = requireCached('gulp-if');
const prettify = requireCached('gulp-jsbeautifier');
const glob = requireCached('glob');


const RESERVED_DATA_KEYWORDS = ['project', 'ext'];


/**
 *  Gulp task responsible for compiling the templates into normal HTML using Mozilla nunjucks templates
 *  @see: http://mozilla.github.io/nunjucks/api.html
 *  @see: https://www.npmjs.com/package/gulp-nunjucks-render
 */
gulp.task('html', function () {

    const options = {};

    options.minify = config.minifyHTML;

    // @formatter:off
    options.htmlmin = {

        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        keepClosingSlash: true // can break SVG if not set to true!

    };
    // @formatter:on


    // @see: https://www.npmjs.com/package/gulp-jsbeautifier
    options.pretty = config.prettyHTML;
    options.prettyConfig = {

        html: {
            unformatted: ["sub", "sup", "b", "i", "u", "svg", "pre"],
            wrapAttributes: 'auto'
        }

    };

    options.nunjuck = {
        watch: false
    };


    const contextData = {};
    const jsonData = mergeJSONData(config.source.getPath('data'), config.source.getFileGlobs('data'));

    // merge retrieved data into the context object
    for (let key in jsonData) {

        if (RESERVED_DATA_KEYWORDS.indexOf(key) >= 0) {

            log.error({
                sender: 'html',
                message: 'A data object has been given a reserved keyword as a name, please update the file name : ' + key + '.\nReserved keywords: ' + RESERVED_DATA_KEYWORDS
            });

        } else {

            contextData[key] = jsonData[key];

        }

    }

    const pagesList = getFileList(config.source.getFileGlobs('html'), config.source.getPath('html'));
    const svgList = getFileList(config.source.getFileGlobs('svg'), config.source.getPath('svg'), true);

    contextData.project = {
        name: packageJSON.name,
        description: packageJSON.description,
        author: packageJSON.author,
        version: packageJSON.version,
        debug: config.debug,
        showGrid: config.showGrid,
        pages: pagesList,
        svgs: svgList
    }


    const getDataForFile = file => contextData;

    const environment = environment => {

        // add custom tags
        environment.addExtension('SVGExtension', new SvgExtension(gulpNunjucks.nunjucks));
        environment.addExtension('DebugExtension', new DebugExtension(gulpNunjucks.nunjucks));

        // add custom filters
        environment.addFilter(assignFilter.name, assignFilter.func);
        environment.addFilter(mergeFilter.name, mergeFilter.func);
        environment.addFilter(defaultsFilter.name, defaultsFilter.func);

    }

    return gulp.src(config.source.getFileGlobs('html'))

        .pipe(gulpData(getDataForFile))
        .pipe(gulpNunjucks({
            envOptions: options.nunjuck,
            manageEnv: environment,
            path: [
                // Add HTML root
                config.source.getPath('nunjucks'),
                // Add root to include components
                config.source.getPath('root')
            ]
                .concat(
                    // Make aliases for all available components
                    walkFileListSync(config.source.getPath('components'), 'template')
                )
        }))

        .pipe(gulpif(options.pretty, prettify(options.prettyConfig)))
        .pipe(gulpif(options.minify, htmlmin(options.htmlmin)))

        .pipe(gulp.dest(config.dest.getPath('html')));

    // Browser Sync is reloaded from the watch task for HTML files to bypass a chrome bug.
    // See the watch task for more info.

});
