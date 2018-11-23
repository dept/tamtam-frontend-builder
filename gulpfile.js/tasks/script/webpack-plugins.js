const config            = require('../../config');
const requireCached     = require('../../src/gulp/require-cached');
const webpack           = requireCached('webpack');
const UglifyJsPlugin    = requireCached('uglifyjs-webpack-plugin');

const plugins = [];

plugins.push( new webpack.optimize.CommonsChunkPlugin({
    names: ['main', 'main-es'], // Names have to be equal to entry files of Webpack
    minChunks: 2,
    children: true,
    deepChildren: true
}) );

if (config.minify) {

    plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
    // plugins.push(new webpack.NoEmitOnErrorsPlugin());
    // plugins.push(new UglifyJsPlugin({
    //     cache: true,
    //     parallel: true,
    //     uglifyOptions: {
    //         keep_classnames: true,
    //         keep_fnames: true,
    //         mangle: {
    //             safari10: true
    //         }
    //     }
    // }));

}

module.exports = plugins;
