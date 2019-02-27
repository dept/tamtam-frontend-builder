const config = require('../../config');
const createAliasObject = require('./create-alias-object');
const webpackPlugins = require('./webpack-plugins');
const createBabelLoaderConfig = require('./create-babel-loader-config');
const esLintConfig = require('./eslint-config');
const TerserPlugin = require('terser-webpack-plugin');

const fs = require('fs');
const path = require('path');

const hasLintfile = fs.existsSync(`${config.projectDirectory}/.eslintrc`) || fs.existsSync(`${config.projectDirectory}/.eslintrc.js`) || fs.existsSync(`${config.projectDirectory}/.eslintrc.json`);

const baseConfig = {
    context: config.projectDirectory,
    mode: config.minify ? 'production' : 'development',
    optimization: {
        splitChunks: {
            chunks: 'async',
            automaticNameDelimiter: '.'
        },
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true,
                    mangle: true,
                    safari10: true
                }
            })
        ],
        noEmitOnErrors: config.minify ? true : false
    },
    output: {
        path: path.resolve(config.projectDirectory, config.dest.getPath('javascript')),
        filename: '[name].js',
        publicPath: `${config.dest.getPath('javascript').replace(config.dest.getPath('root'), '')}/`
    },
    devtool: config.sourcemaps ? 'source-map' : undefined,
    resolve: {
        alias: createAliasObject(),
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    resolveLoader: {
        modules: [
            `${__dirname}/../../node_modules`
        ]
    }
};

const modernConfig = {
    ...baseConfig,
    name: 'modern',
    entry: {
        'main-es': './source/javascript/main-es'
    },
    output: {
        ...baseConfig.output,
        chunkFilename: 'chunks-es/[name].js'
    },
    plugins: webpackPlugins,
    module: {
        rules: [
            ...createBabelLoaderConfig(config.browsers.modern, [
                '@babel/syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread'
            ]),
            hasLintfile ? esLintConfig : {},
        ],
    },
};

const legacyConfig = {
    ...baseConfig,
    name: 'legacy',
    entry: {
        'main': ['@babel/polyfill', './source/javascript/main']
    },
    output: {
        ...baseConfig.output,
        chunkFilename: 'chunks/[name].js'
    },
    plugins: webpackPlugins,
    module: {
        rules: [
            ...createBabelLoaderConfig(config.browsers.legacy, [
                '@babel/syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread'
            ]),
            hasLintfile ? esLintConfig : {},
        ],
    },
};


module.exports = {
    modernConfig,
    legacyConfig
};
