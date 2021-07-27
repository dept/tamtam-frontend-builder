const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = (api) => {

  const plugins = [
      require('autoprefixer')({
        grid: true,
        remove: true,
      }),
  ];

  // Add minifier when production
  if (!isDevelopment) {
      plugins.push(require('css-mqpacker')({
          sort: true
      }));

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
