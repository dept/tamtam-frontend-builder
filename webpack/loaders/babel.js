module.exports = () => {
  return [
    {
      test: /\.(ts|js)x?$/,
      exclude: /(node_modules)/,
      use: {
        loader: require.resolve('babel-loader'),
        options: {
          rootMode: 'upward',
        },
      },
    },
  ]
}
