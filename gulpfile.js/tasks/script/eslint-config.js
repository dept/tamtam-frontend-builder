module.exports = esLintConfig = {
    enforce: 'pre',
    test: /\.js?$/,
    loader: require.resolve('eslint-loader'),
    exclude: /node_modules/
}
