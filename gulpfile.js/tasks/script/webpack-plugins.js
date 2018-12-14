const config            = require('../../config');
const requireCached     = require('../../src/gulp/require-cached');
const webpack           = requireCached('webpack');
const UglifyJsPlugin    = requireCached('uglifyjs-webpack-plugin');

const plugins = [];

if (config.minify) {

}

module.exports = plugins;
