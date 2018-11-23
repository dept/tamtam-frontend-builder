const config = require('../../config');
const createAliasObject = require('./create-alias-object');
const webpackPlugins = require('./webpack-plugins');
const createBabelLoaderConfig = require('./create-babel-loader-config');
const esLintConfig = require('./eslint-config');

const fs = require('fs');
const path = require('path');

const hasLintfile = fs.existsSync(`${config.projectDirectory}/.eslintrc`) || fs.existsSync(`${config.projectDirectory}/.eslintrc.js`) || fs.existsSync(`${config.projectDirectory}/.eslintrc.json`);

const baseConfig = {
    context: config.projectDirectory,
    bail: config.throwError,
    output: {
        path: path.resolve(config.projectDirectory, config.dest.getPath('javascript')),
        filename: '[name].js',
        publicPath: `${config.dest.getPath('javascript').replace(config.dest.getPath('root'), '')}/`
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

const modernConfig = {
    ...baseConfig,
    ...{
        entry: {
            'main-es': './source/javascript/main-es.js'
        },
        output: {
            ...baseConfig.output,
            ...{
                chunkFilename: '[name].chunk-es.js',
            },
        },
        plugins: webpackPlugins,
        module: {
            rules: [
                createBabelLoaderConfig(config.browsers.modern, ['syntax-dynamic-import', 'transform-object-rest-spread']),
                hasLintfile ? esLintConfig : {},
            ],
        },
    },
};

const legacyConfig = {
    ...baseConfig,
    ...{
        entry: {
            'main': ['babel-polyfill', './source/javascript/main.js']
        },
        output: {
            ...baseConfig.output,
            ...{
                chunkFilename: '[name].chunk.js',
            },
        },
        plugins: webpackPlugins,
        module: {
            rules: [
                createBabelLoaderConfig(config.browsers.legacy, ['syntax-dynamic-import', 'transform-object-rest-spread', 'transform-es2015-arrow-functions']),
                hasLintfile ? esLintConfig : {},
            ],
        },
    },
};


module.exports = {
    modernConfig,
    legacyConfig
};
