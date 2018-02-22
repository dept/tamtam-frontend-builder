//@formatter:off

var log                     = require('../debug/log');
var config                  = require('../../config');
var requireCached     		= require('./require-cached');

var path                    = require('path');
var glob                    = requireCached('glob');

// @formatter:on

function loadTasks () {

    // pre-load all gulp tasks if we're not loading at runtime

    log.debug( { sender: 'loadTasks', message: '\tLoading tasks...' } );

    var relative = path.relative( __dirname, process.cwd() );
    var taskFiles = glob.sync( path.normalize('gulpfile.js/tasks/*.js') );

    for ( var i = 0, leni = taskFiles.length; i < leni; i++ ) {

        require( relative + path.sep + taskFiles[ i ] );

        if( config.gulp.debug ) log.info( { sender: 'loadTasks', message: 'task loaded: ' + taskFiles[ i ] } );

    }

    log.debug( { sender: 'loadTasks', message: '\tDone.' } );

}

module.exports = loadTasks;