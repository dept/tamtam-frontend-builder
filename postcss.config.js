const config = require('./utils/get-config')

module.exports = () => {

  const plugins = [
      require('autoprefixer')({
        grid: true,
        remove: true,
      }),
  ];

  // Add minifier when production
  if (!config.isDevelopment) {
      plugins.push(
        require('postcss-sort-media-queries')(),
      )

      plugins.push(require('cssnano')({
          preset: [
              'default', {
                  discardComments: {
                      removeAll: true
                  }
              }
          ]
      }));
  }

  return { plugins }

}
