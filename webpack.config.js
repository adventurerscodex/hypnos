/* eslint-disable */
/**
 * Baseline build specification
 *
 * Defines common configurations necessary for all builds of the application.
 *
 * To specify a new configuration, create a new webpack configuration file that
 * imports this module and overrride any desired settings.
 *
 * Note that this file is written in vanilla JS so that karma is able to run it.
 */

 'use strict';
 var path = require('path');
 var webpack = require('webpack');
 var pathAppRoot = path.resolve(__dirname, 'src');
 var config = {
     resolve: {
       extensions: ['.js'],
       modules: [pathAppRoot, 'node_modules']
     },

   module: {
    rules: [
       {
         test: /\.(test|spec)\.js$/,
         loader: 'ignore-loader'
       },
       {
         test: /(\.js)$/,
         exclude: /(node_modules)/,
         loader: 'babel-loader',
         query: {
           presets: ['es2015', 'stage-0'],
           plugins: ['transform-class-properties'],
         },
       },
     ]
   },
   output: {
     library: 'Hypnos',
     libraryTarget: 'umd'
   },
   plugins: [
     new webpack.DefinePlugin({
       'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
     })
   ]
 };

 if (process.env.NODE_ENV === 'production') {
   config.plugins.push(
     new webpack.optimize.UglifyJsPlugin({
       compressor: {
         pure_getters: true,
         unsafe: true,
         unsafe_comps: true,
         warnings: false
       }
     })
   );
 }

 module.exports = config;
