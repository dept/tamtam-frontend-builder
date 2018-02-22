/**
 * Compares the value of the object against another object
 * and returns a new object containing the values that are different.
 * @param object {object}
 * @param compareTo {object}
 * @returns {object}
 */
module.exports = function diff ( object, compareTo ) {

	var diff = {};

	for ( var key in object ) {

		if( !object.hasOwnProperty( key ) ) continue;

		var value = object[ key ];

		if( !compareTo[ key ] || compareTo[ key ] !== value ) {
			diff[ key ] = value;
		}
	}

	return diff;
}