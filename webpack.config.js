var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'client/public');
var APP_DIR = path.resolve(__dirname, 'client/app');

var config = {
  watch: true,
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: {
   extensions: ['.js', '.jsx']
 },
   module : {
    rules : [
      {
        test : /\.jsx?$/,
        include : APP_DIR,
        loader : 'babel-loader',
        exclude: ['node_modules'],
        options: {'presets' : ['es2015', 'react']}
      }
    ]
  }
};


module.exports = config;
