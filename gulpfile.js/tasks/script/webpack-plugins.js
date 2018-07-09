const config            = require('../../config');
const requireCached     = require('../../src/gulp/require-cached');
const webpack           = requireCached('webpack');
const UglifyJsPlugin    = requireCached('uglifyjs-webpack-plugin');

const plugins = [];

if (config.minify) {

    plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
    plugins.push(new webpack.NoEmitOnErrorsPlugin());
    plugins.push(new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
            keep_classnames: true,
            keep_fnames: true
        }
    }));

}

module.exports = plugins;
