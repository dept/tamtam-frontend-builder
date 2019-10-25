module.exports = esLintConfig = {
  enforce: 'pre',
  test: /\.js?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('eslint-loader'),
      options: {
        formatter: require('eslint/lib/cli-engine/formatters/stylish')
      }
    }
  ]
};
