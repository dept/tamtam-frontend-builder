const config = require('../../config')
const error = require('../../../utils/error')

module.exports = createBabelLoaderConfig = (browserlist, plugins) => {
  if (!browserlist) {
    error('No valid browserlist specified for babel loader config.')
    return
  }

  const options = {
    plugins,
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          modules: false,
          corejs: 3,
          targets: {
            browsers: browserlist,
          },
        },
      ],
    ],
  }

  return [
    {
      test: /\.tsx?$/,
      exclude: /(node_modules)/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options,
        },
        {
          loader: require.resolve('ts-loader'),
        },
      ],
    },
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: require.resolve('babel-loader'),
        options,
      },
    },
  ]
}
