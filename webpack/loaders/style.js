const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = require('../../utils/get-config')

const configureCSSLoader = ({ extract = true } = {}) => {
  const extractedCSSConfig = {
    test: /\.(s*)css$/,
    exclude: /node_modules/,
    use: [
      ...(extract
        ? [
            {
              loader: MiniCssExtractPlugin.loader,
            },
          ]
        : []),
      {
        loader: require.resolve('css-loader'),
        options: {
          sourceMap: config.isDevelopment,
          url: false,
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          sourceMap: config.isDevelopment,
          postcssOptions: {
            config: path.resolve(__dirname, '../../postcss.config.js'),
          },
        },
      },
      {
        loader: require.resolve('sass-loader'),
        options: {
          sourceMap: config.isDevelopment,
          implementation: require('node-sass'),
        },
      },
    ],
  }

  return [extractedCSSConfig]
}

module.exports = configureCSSLoader
