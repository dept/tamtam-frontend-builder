// @formatter:off

var loadPlugins 				= require( './load-plugins' );
var log 						= require( '../debug/log' );
var config 						= require('../../config');

var startTime 					= process.hrtime();
var gulp						= require('gulp');;
var gulpDecorate				= require('./decorator/decorate');


// @formatter:on


function init ( callback ) {

	// Load / Index all the plugins for faster task loading.
	loadPlugins( function () {

		gulpInit( callback );

	}, true, global );

}


function gulpInit ( callback ) {

	// initialization code, no need to touch this.
	

	if( config.gulp.lazy ) {

		log.info( { sender: 'gulp/init', message: '\tRunning in lazy mode, tasks will be loaded at runtime.' } );

	} else {

		require( './load-tasks' )(); // loads all tasks ( if lazy loading is turned off ).

	}


	gulpDecorate( gulp ); // Decorate gulp with extra functionality for better debugging and error handling.

	log.time( { sender: 'gulp/init', message: 'init - ', time: process.hrtime( startTime ) } );

	callback( gulp );


}


module.exports = init;