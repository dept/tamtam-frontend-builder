//@formatter:off

var nodeFs                  = require('fs');
var nodePath                = require('path');
var mkdirp                  = require('mkdirp');
var _                    	= require('lodash');

var log                     = require('../../debug/log');

// @formatter:on


module.exports = function safeWriteFileSync ( path, file ) {

	try {

		mkdirp.sync( nodePath.dirname( path ) ); 	// make sure directory exists

		nodeFs.writeFileSync( path, file );


	} catch ( error ) {

		log.error( {
				sender: 'safe-write-file-sync',
				message: 'error writing file to: ' + path,
				data: [ error ]
			}
		)

	}

}