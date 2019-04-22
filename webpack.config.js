// NEW: require webpack so we can use the "CommonsChunkPlugin"
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/App.jsx',
    vendor: ['react', 'react-dom', 'isomorphic-fetch', 'react-router'],
  },
  output: {
    filename: 'static/app.bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'static/vendor.bundle.js' })
  ],
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },]
  }
};