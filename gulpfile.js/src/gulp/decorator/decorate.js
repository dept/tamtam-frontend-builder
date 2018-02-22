//@formatter:off

var config                  = require('../../../config');
var log                     = require('../../debug/log');
var requireCached     		= require('../require-cached');
var loadTask				= require('./load-task');
var wrapTask				= require('./wrap-task');

var gulpDebug               = requireCached('gulp-debug');
var gulpPlumber             = requireCached('gulp-plumber');
var gulpIf                  = requireCached('gulp-if');


//@formatter:on



function decorate ( gulp ) {

	if( !gulp || gulp.__isDecorated__ ) return gulp;

	gulp.__isDecorated__ = true;


	var options = {

		plumberConfig: {
			errorHandler: log.error
		},

		debugConfig: {
			title: 'gulp-debug:',
			minimal: true           // By default only relative paths are shown. Turn off minimal mode to also show cwd, base, path.
		}

	}


	decorateSrc( gulp, options );
	decorateTask( gulp );

	if( config.gulp.lazy === undefined || config.gulp.lazy ) {

		decorateStart( gulp );
		decorateHasTask( gulp );

	}

	return gulp;

}

module.exports = decorate;


/**
 * Decorates the gulp.src function with default tasks such as plumber
 * and debug for better error handling and debugging.
 *
 * @see: https://www.timroes.de/2015/01/06/proper-error-handling-in-gulp-js/
 * @see: https://www.npmjs.com/package/gulp-plumber
 * @see: https://www.npmjs.com/package/gulp-debug
 */
function decorateSrc ( gulp, options ) {

	// @type: {function}
	var gulpSrcFunction = gulp.src;
	gulp.src = function () {

		return gulpSrcFunction.apply( gulp, arguments )
			.pipe( gulpPlumber( options.plumberConfig ) )
			.pipe( gulpIf( config.gulp.debug, gulpDebug( options.debugConfig ) ) );

	}

	return gulp;
}

/**
 *  Decorates the gulp.task to catch errors and provides better error information such as stack traces.
 */
function decorateTask ( gulp ) {

	// @type: {function}
	var gulpTaskFunction = gulp.task;

	gulp.task = function () {

		if( config.gulp.debug ) log.debug( { sender: 'gulp/decorator', message: 'gulp.task()', data: [ arguments ] } );

		var taskIndex;
		var taskFunction;

		if( Array.isArray( arguments[ 1 ] ) ) {

			taskIndex = 2;
			taskFunction = arguments[ taskIndex ];

			// preload dependencies if needed
			if( config.gulp.lazy ) {

				var taskDependencies = arguments[ 1 ];
				if( config.gulp.debug ) {
					log.debug( {
						sender: 'gulp/decorator',
						message: 'gulp.task() - dependencies: ',
						data: [ taskDependencies ]
					} );
				}

				for ( var i = 0, leni = taskDependencies.length; i < leni; i++ ) loadTask( taskDependencies[ i ] );

			}

		} else {

			taskIndex = 1;
			taskFunction = arguments[ taskIndex ];

		}

		if( config.gulp.debug ) {
			log.debug( {
				sender: 'gulp/decorator',
				message: 'Modifying gulp task ( ' + log.colors.cyan( arguments[ 0 ] ) + ' ) for for better error handling...'
			} );
		}


		var wrappedTaskFunction;
		if( typeof taskFunction === 'function' ) {

			wrappedTaskFunction = wrapTask( gulp, taskFunction );
			if( wrappedTaskFunction ) arguments[ taskIndex ] = wrappedTaskFunction;

		} else {

			if( config.gulp.debug ) log.warn( {
				sender: 'gulp/decorator',
				message: 'Failed to find the task function for task: ',
				data: [ arguments[ 0 ] ]
			} );

		}


		gulpTaskFunction.apply( gulp, arguments );

	}
}


/**
 * Adds lazy loading capabilities
 * We need to decorate both the 'start' and 'hasTask' functions
 * because some plugins (runSequence) check if the task has been loaded before they run.
 */
function decorateStart ( gulp ) {

	if( config.gulp.debug ) log.debug( { sender: 'gulp/decorator', message: 'Modifying gulp for lazy loading...' } );

	var gulpStartFunction = gulp.start;


	gulp.start = function () {

		if( config.gulp.debug ) log.debug( { sender: 'gulp/decorator', message: 'gulp.start()', data: [ arguments ] } );

		for ( var i = 0, leni = arguments.length; i < leni; i++ ) {

			if( typeof arguments[ i ] !== 'string' ) {

				// this is probably not an error but just a given callback ('function')
				if( config.gulp.verbose ) log.warn( { sender: 'gulp/decorator', message: 'Can not load a function.' } );
				continue;
			}

			loadTask( arguments[ i ] );

		}


		gulpStartFunction.apply( gulp, arguments );
	}
}


function decorateHasTask ( gulp ) {

	var gulpHasTaskFunction = gulp.hasTask;

	/**
	 * Some modules (runSequence) check whether the plugin has been registered before trying to run it.
	 * Therefor we need to load the task before it gets checked.
	 * @see: https://github.com/orchestrator/orchestrator
	 * @param taskName {string}
	 */
	gulp.hasTask = function ( taskName ) {

		if( config.gulp.debug ) log.debug( {
			sender: 'gulp/decorator',
			message: 'hasTask( ' + log.colors.cyan( taskName ) + ' )'
		} );

		loadTask( taskName );

		return gulpHasTaskFunction.apply( gulp, [ taskName ] );

	}
}


