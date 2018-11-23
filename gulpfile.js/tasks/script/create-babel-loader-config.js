const config = require('../../config');
const error = require('../../../utils/error');

module.exports = createBabelLoaderConfig = (browserlist, plugins) => {

    if (!browserlist) {
        error('No valid browserlist specified for babel loader config.');
        return;
    }

    return {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
            loader: require.resolve('babel-loader'),
            options: {
                plugins,
                presets: [
                    [
                        '@babel/preset-env', {
                            useBuiltIns: 'usage',
                            modules: false,
                            // debug: true,
                            targets: {
                                browsers: browserlist
                            },
                        }
                    ],
                ],
            },
        },
    };
};
