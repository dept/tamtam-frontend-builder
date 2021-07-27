const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('../../utils/get-config');
const isDevelopment = process.env.NODE_ENV === 'development';

const configureCSSLoader = () => {
  console.log(config.cssOutputPath)
  const extractedCSSConfig = {
        test: /\.(s*)css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
              loader: require.resolve('css-loader'),
              options: {
                  sourceMap: isDevelopment,
              },
          },
          {
              loader: require.resolve('postcss-loader'),
              options: {
                  sourceMap: isDevelopment,
                  postcssOptions: {
                      config: path.resolve(__dirname, '../../postcss.config.js'),
                  },
              },
          },
          {
              loader: require.resolve('sass-loader'),
              options: {
                  sourceMap: isDevelopment,
              },
          },
        ],

    };

    return [
      extractedCSSConfig,
      // {
      //   test: /\.css$/i,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: MiniCssExtractPlugin.loader,
      //       options: {
      //         emit: true,
      //         options: {
      //           publicPath: config.cssOutputPath,
      //         }
      //       }
      //     },
      //     require.resolve("css-loader")
      //   ],

      // }
    ];
};

module.exports = configureCSSLoader;
