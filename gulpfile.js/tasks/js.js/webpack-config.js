const config                    = require('../../config');
const createAliasObject         = require('./create-alias-object');
const webpackPlugins            = require('./webpack-plugins');
const createBabelLoaderConfig   = require('./create-babel-loader-config');
const esLintConfig              = require('./eslint-config');

const fs                        = require('fs');

const hasLintfile = fs.existsSync(`${config.projectDirectory}/.eslintrc`) || fs.existsSync(`${config.projectDirectory}/.eslintrc.js`) || fs.existsSync(`${config.projectDirectory}/.eslintrc.json`);

const baseConfig = {
    context: config.projectDirectory,
    bail: config.throwError,
    output: {
        path: config.dest.getPath('javascript'),
        filename: '[name].js',
    },
    cache: {},
    devtool: config.sourcemaps ? 'source-map' : undefined,
    resolve: {
        alias: createAliasObject()
    },
    resolveLoader: {
        modules: [
            `${__dirname}/../../node_modules`
        ]
    }
};

const modernConfig = Object.assign({}, baseConfig, {
	entry: {
		'main-es': './source/javascript/main-es.js'
	},
	plugins: webpackPlugins,
	module: {
		rules: [
			createBabelLoaderConfig(config.browsers.modern),
			hasLintfile ? esLintConfig : {}
		]
	},
});

const legacyConfig = Object.assign({}, baseConfig, {
    entry: {
        'main': ['babel-polyfill', './source/javascript/main.js']
    },
    plugins: webpackPlugins,
    module: {
        rules: [
            createBabelLoaderConfig(config.browsers.legacy),
            hasLintfile ? esLintConfig : {}
        ],
    },
});


module.exports = {
	modernConfig,
	legacyConfig
};
