var requireCached = require('../src/gulp/require-cached');
var config = require('../config');
var log = require('../src/debug/log');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var errorMsg = require('../../utils/error');

var gulp = requireCached('gulp');
var webpack = requireCached('webpack');
var BabelMinifyWebpackPlugin = requireCached('babel-minify-webpack-plugin');

var hasLintfile                 = fs.existsSync(`${config.projectDirectory}/.eslintrc`) || fs.existsSync(`${config.projectDirectory}/.eslintrc.json`);
var hasESFile                   = fs.existsSync(`${config.source.javascript}/main-es.js`);
var shownMissingLintWarning     = 0;
var warningLimit                = 4;

const compilerConfigs = {};

const configurePlugins = () => {

    const plugins = [];

    if (config.minify) {

        plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
        plugins.push(new webpack.NoEmitOnErrorsPlugin());
        plugins.push(new BabelMinifyWebpackPlugin());

    }

    return plugins;
};

const configureBabelLoader = (browserlist) => {
    return {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
            loader: require.resolve('babel-loader'),
            options: {
                presets: [
                    ['env', {
                        modules: false,
                        useBuiltIns: true,
                        targets: {
                            browsers: browserlist,
                        },
                    }],
                ],
            },
        },
    };
};

const esLintConfig = {
    enforce: 'pre',
    test: /\.js?$/,
    loader: require.resolve('eslint-loader'),
    exclude: /node_modules/
}

const baseConfig = {
    context: config.projectDirectory,
    bail: config.throwError,
    output: {
        path: config.dest.getPath('javascript'),
        filename: '[name].js',
    },
    cache: {},
    devtool: config.sourcemaps ? 'source-map' : undefined,
    resolveLoader: {
        modules: [
            `${__dirname}/../../node_modules`
        ]
    }
};

if ( hasESFile ) {
    compilerConfigs.modernConfig = Object.assign({}, baseConfig, {
        entry: {
            'main-es': './source/javascript/main-es.js'
        },
        plugins: configurePlugins(),
        module: {
            rules: [
                configureBabelLoader(config.browsers.modern),
                hasLintfile ? esLintConfig : {}
            ]
        },
    });
}

compilerConfigs.legacyConfig = Object.assign({}, baseConfig, {
    entry: {
        'main': ['babel-polyfill', './source/javascript/main.js']
    },
    plugins: configurePlugins(),
    module: {
        rules: [
            configureBabelLoader(config.browsers.legacy),
            hasLintfile ? esLintConfig : {}
        ],
    },
});

const createCompiler = (config) => {
    const compiler = webpack(config);
    return () => {
        return new Promise((resolve, reject) => {
            compiler.run((error, stats) => {

                onWebpackCallback(error, stats);
                resolve();

            });
        });
    };
};

const onWebpackCallback = (error, stats, opt_prevStats) => {

    if (stats.stats) {
        stats.stats.forEach(stat => {
            logStats(stat);
        });
    } else {

        logStats(stats);
    }

    if (error) log.error({
        sender: 'js',
        data: [error]
    });

    if (config.verbose) log.info({
        sender: 'js',
        message: 'compiling...'
    });

    if ( !hasLintfile ) {
        if ( shownMissingLintWarning < warningLimit ) errorMsg('You don\'t use Javascript Linting yet. Please upgrade ASAP.', true);
        shownMissingLintWarning++;
    }

}

function logStats(stats) {

    console.log(`\n ${stats.toString({ colors: true })} \n`);

}

const createCompilerPromise = () => {

    const promises = [];

    Object.keys(compilerConfigs).forEach(configName => {
        promises.push(createCompiler(compilerConfigs[configName])());
    });

    return promises;

}

gulp.task('js', function (callback) {

    Promise.all(createCompilerPromise())
        .then(() => callback())
        .catch(e => console.warn('Error whilst compiling JS', e));


});

module.exports = {
    compilerConfigs,
    onWebpackCallback
}
