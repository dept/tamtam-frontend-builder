// @formatter:off


var _ 				= require( 'lodash' );

var filterName      = 'merge';


// @formatter:on

/**
 * Default filter
 *
 *
 */


/**
 * A function that merges all properties this the given object.
 * @see: https://lodash.com/docs#assign
 * @param object {object}
 * @param var_args {...object}
 */
function filter ( object, var_args ) {

    return _.merge.apply( _, arguments );

}

module.exports = {
    name: filterName,
    func: filter
};