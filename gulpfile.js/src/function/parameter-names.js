var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

/**
 * Retrieves the parameter names for a given function
 * @see: http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
 * @param functionReference {function]
 * @returns {Array}
 */
module.exports = function parameterNames ( functionReference ) {
    if( !functionReference ) return null;
    var fnStr = functionReference.toString().replace( STRIP_COMMENTS, '' );
    var result = fnStr.slice( fnStr.indexOf( '(' ) + 1, fnStr.indexOf( ')' ) ).match( ARGUMENT_NAMES );
    if( result === null ) result = [];
    return result;
};

