//@formatter:off

var config                  = require('../../../config');
var log                     = require('../../debug/log');
var path           			= require('path');
//@formatter:on


var _loadedTasks = {};

/**
 * Check if the task has been loaded, if not try to load it.
 * @param taskName
 */
function loadTask ( taskName ) {

    if( !config.gulp.lazy ) return log.error( {
        message: 'Trying to lazy load a task, but gulp is not set in lazy mode?!',
        sender: 'gulpDecorator'
    } );

    if( _loadedTasks[ taskName ] === undefined ) {

		var taskPath = path.normalize( '../../../tasks/' + taskName );

        try {

            if( config.gulp.debug )log.debug( {
                sender: 'gulpDecorator',
                message: 'lazy loading:\t\'' + log.colors.cyan( taskName ) + '\' ( ' + taskPath + ' )'
            } );

            _loadedTasks[ taskName ] = require( taskPath );


        } catch ( error ) {

            _loadedTasks[ taskName ] = false;
            
            // Some tasks won't be able to load if they are not in a separate file.
            // So if it fails it is not necessarily an error.
            if( config.gulp.debug )
            log.warn( {
                sender: 'gulpDecorator',
                message: 'warning: Failed to lazy load task: ' + taskPath + '.js',
                data: error
            } );

        }

    }
}

module.exports = loadTask;

