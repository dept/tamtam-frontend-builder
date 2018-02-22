//@formatter:off

var fileSystem              = require( 'fs' );
var path                    = require( 'path' );
var config                  = require('../../../../gulpfile.js/config');
var SVG_CLASS_PREFIX        = 'svg-';
var log                     = require('../../debug/log');

//@formatter:on


/**
 * Function to retrieve SVG code
 * @name: svg
 * @param name {string} resembles the path to the svg
 * @param opt_altText {=string} alt text to inject into the svg
 * @returns {string} svg code
 */
module.exports = function ( name ) {

    if( !name ) return '';

    name = name.replace(/\.svg$/, '');

    var svg = '';
    var svgPath = config.dest.getPath( 'svg', '/' +  name + '.svg' );

    try {

        svg = fileSystem.readFileSync( svgPath );

    } catch ( error ) {

        log.error({
            sender: 'SVG',
            message: 'Failed to retrieve the svg: ' + svgPath
        });

    }

    svg = svg.toString();
    svg = '\n<!--  '  + name + '.svg  -->\n' + svg + '\n';

    return svg;
};
