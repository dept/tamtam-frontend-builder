

let config                  = require('./config');
const runSequence           = require( 'run-sequence' );
const init                  = require('./src/gulp/init');
const assigndeep            = require('assign-deep');


config.applyProcessArgs();


// Define asset files here that need to be copied straight to the build folder.
// SVG and image files will be optimized and pushed to the build folder automatically, do not define those here.
config.copy = function () {

    const overrideCopy = require(`${config.projectDirectory}/build-config/override-copy.js`) || [];
    const copyConfig = [
        { source: config.source.getPath('assets', '*.*'), dest: config.dest.getPath('assets') },
        { source: config.source.getPath('assets', 'fonts/**'), dest: config.dest.getPath('fonts') }
    ];

    return overrideCopy.length ? overrideCopy : copyConfig;

};

// Libraries that will be concatenated into libs.js together on the global scope, used for commonJS incompatible libs & plugins
// You can user bower or npm getPath by default
// @example: config.source.getPath('npm', 'jquery/dist/jquery.js' )
// @note: You need to include /js/libs.js in order to use these libs in your project.
//
config.libs = function () {

    const overrideLibs = require(`${config.projectDirectory}/build-config/override-libs.js`) || [];

    return overrideLibs;

};



//--------------     M A I N   T A S K S    L I S T     --------------


function registerMainTasks( gulp ){


    // Specifies the default set of tasks to run when you run `gulp`.
    gulp.task( 'default', [ 'server' ] );


    /**
     *  @task server
     *  Build the project.
     *  Fires up a local server.
     *  Starts watching all the used files and rebuilds on file changes.
     *  - This will also automatically refresh your browser after something has been rebuild.
     */
    gulp.task( 'server', function ( callback ) {

        runSequence(
            'build',
            'browser-sync',
            'watch',
            callback
        );

    } );


     /**
     *  @task build
     *  Deletes the old files and builds the project from scratch.
     */
    gulp.task( 'build', function ( callback ) {

        runSequence(
            'clean',
            [ 'copy', 'images', 'svg', 'inject-component-css' ],
            [ 'css-lint', 'css' ],
            [ 'html', 'libs', 'js' ],
            'sw',
            callback
        );

    } );


    /**
     * @task build:dist
     * Builds the project in distribution mode pushes the files to the backend folder
     */
    gulp.task( 'dist', function ( callback ) {

        config.debug              = false;
        config.minify             = true;
        config.sourcemaps         = false;
        config.prettyHTML         = true;

        config.dest.root.path       = './build';
        config.dest.html.path     	= config.dest.root.path;
        config.source.sw.path       = config.dest.root.path + '/assets/';
        config.source.sw.strip      = config.dest.root.path;
        config.dest.manifest.path   = config.dest.root.path;
		config.dest.sw.path         = config.dest.root.path;

		// Overwrite config with project specific settings.
        assigndeep(config, config.projectConfig.dist || {});

        runSequence(
            'build',
            callback
        );

    } );


     /**
     * @task build:deploy
     * Builds the project for deployment.
     */
    gulp.task( 'deploy', function ( callback ) {

        config.debug                = false;
        config.sourcemaps           = false;
        config.throwError           = true;
        config.minify               = true;
        config.prettyHTML           = false;

        config.dest.root.path       = '../backend';
        config.dest.html.path     	= config.dest.root.path + '/html';
        config.source.sw.path       = config.dest.root.path + '/assets/';
        config.source.sw.strip      = config.dest.root.path;
        config.dest.manifest.path   = config.dest.root.path;
		config.dest.sw.path         = config.dest.root.path;

		// Overwrite config with project specific settings.
        assigndeep(config, config.projectConfig.deploy || {});

        runSequence(
            'clean',
            [ 'copy', 'images', 'svg', 'inject-component-css' ],
            [ 'css-lint', 'css' ],
            [ 'html', 'libs', 'js' ],
            'sw',
            callback
        );

    } );

    /**
     * @task build:bamboo
     * DEPRECATED TASK NAME
     */
    gulp.task('bamboo', function (callback) {

        runSequence(
            'deploy',
            callback
        );

    });



}


// Run initialisation
init( registerMainTasks );
