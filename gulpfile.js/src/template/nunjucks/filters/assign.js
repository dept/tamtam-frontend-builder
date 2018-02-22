// @formatter:off


var _ 				= require( 'lodash' );

var filterName      = 'assign';


// @formatter:on

/**
 * Assign filter
 *
 * Use this filter to overwrite properties of existing context objects since this is currently not possible natively in Nunjucks yet.
 * @see: https://github.com/mozilla/nunjucks/issues/313
 * @usage:
 *
 * Say we have a context object called author, but we want to force the name to be 'A very very long name'.
 * However to wish to keep all the other settings and data in this object.
 *
 * You can do:
 *
 * {% set author = author | assign( { name: 'A very very long name' } ) %}
 *
 */


/**
 * A function that assigns all properties this the given object.
 * @see: https://lodash.com/docs#assign
 * @param object {object}
 * @param var_args {...object}
 */
function filter ( object, var_args ) {

    return _.assign.apply( _, arguments );

}

module.exports = {
    name: filterName,
    func: filter
};