// @formatter:off


var _ 				= require( 'lodash' );

var filterName      = 'defaults';


// @formatter:on

function filter ( object, var_args ) {

    return _.defaultsDeep.apply( _, arguments );

}

module.exports = {
    name: filterName,
    func: filter
};