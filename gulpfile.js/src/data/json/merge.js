//@formatter:off

var path                    = require('path');
var fs                    	= require('fs');

var log                     = require('../../debug/log');
var config                  = require('../../../config');
var requireCached     		= require('../../gulp/require-cached');
var getFileList             = require('../../node/file/get-list');
var glob                    = requireCached('glob');
var pathUtil            = require('path');

var jsonFileRegExp          = /.json$/i;

// @formatter:on

/**
 * Loads and merges JSON data into one object
 * @param root {string} root path to be stripped of the filepath
 * @param source {string} glob string for JSON
 */
function mergeJSONData ( root, source ) {
	
	if( root.slice( -1 ) !== path.sep ) root += path.sep; // force path separator as last character
	
	var data = {};
	var files = getFileList( source );


	for ( var i = 0, leni = files.length; i < leni; i++ ) {

		var filePath = files[ i ];
	
		if( !jsonFileRegExp.test( filePath ) ) {
			log.warn( {
				sender: 'mergeJSONData',
				message: 'Can only merge JSON Data!'
			} );
			continue;
		}

		try {

			var fileData = fs.readFileSync( filePath, 'utf-8' );
			if( fileData ) fileData = JSON.parse( fileData );

		} catch ( error ) {

			log.error( {
				sender: 'mergeJSONData',
				message: 'Failed to load json data for file: ' + filePath
			} );

			log.error( error );

			continue;

		}
		
		if(path.sep === "\\"){
			root = root.replace('\\', '/');
		}
		
		var dataPath = filePath.replace( root, '' );
				
		dataPath = dataPath.replace( jsonFileRegExp, '' );
		dataPath = dataPath.split( '/' );
	

		var currentNode = data;
		for ( var j = 0, lenj = dataPath.length; j < lenj; j++ ) {

			var key = dataPath[ j ];

			if( !key.length ) continue;

			if( j === lenj - 1 ) {

				// assign the data on the last node
				currentNode[ key ] = fileData;

			} else {

				currentNode[ key ] = currentNode[ key ] || {};
				currentNode = currentNode[ key ];

			}
			
		}

	}

	return data;

}


module.exports = mergeJSONData;
