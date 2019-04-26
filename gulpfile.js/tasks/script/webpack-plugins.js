const config            = require('../../config');
const requireCached     = require('../../src/gulp/require-cached');
const webpack           = requireCached('webpack');

const plugins = [];

if (config.minify) {

}

module.exports = plugins;
