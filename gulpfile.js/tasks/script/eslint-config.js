module.exports = esLintConfig = {
  enforce: 'pre',
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('eslint-loader'),
      options: {
        formatter: require('eslint/lib/cli-engine/formatters/stylish'),
        emitWarning: true,
        failOnWarning: false,
      },
    },
  ],
}
