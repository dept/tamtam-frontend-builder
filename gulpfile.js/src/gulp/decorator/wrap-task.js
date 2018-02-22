//@formatter:off

var config                  = require('../../../config');
var log                     = require('../../debug/log');

var parameterNames			= require('../../function/parameter-names');

//@formatter:on


module.exports =  function wrapTask( gulp, taskFunction ) {

    var parameters = parameterNames( taskFunction );
    var wrappedTaskFunction;

    /**
     *  Gulp (or maybe orchestra) checks the task parameters for a callback param.
     *  So we need to properly give the wrapper function a 'callback' param as well.
     *  If we don't some function might break down (runSequence for example).
     */
    if( !parameters || !parameters.length ) {

        wrappedTaskFunction = function () {
            try {

                return taskFunction.apply( gulp, arguments );

			}
            catch ( error ) {

                log.error( error, true, true );

            }
        }

    } else if( parameters.length && parameters[ 0 ] === 'callback' ) {

        // wrapper needs a 'callback' param!
        wrappedTaskFunction = function ( callback ) {
            try {
                return taskFunction.apply( gulp, arguments );
            }
            catch ( error ) {
                log.error( error, true, true );
            }
        }

    } else {

        log.warn( {
            sender: 'gulpDecorator',
            message: 'Ran into unknown parameters when trying to wrap the task function: ',
            data: [ parameters ]
        } )

    }

    return wrappedTaskFunction;

}

