//@formatter:off

var nodeFs                  = require('fs');
var nodePath                = require('path');

var log                     = require('../../debug/log');

// @formatter:on


module.exports = function safeWriteFileSync ( path, opt_encoding ) {

	try {

		path = nodePath.resolve( path );

		return nodeFs.readFileSync( path, 'utf-8' || opt_encoding );

	} catch ( error ) {

		log.error( {
				sender: 'safe-read-file-sync',
				message: 'error writing file to: ' + path,
				data: [ error ]
			}
		)

		return null;

	}

}