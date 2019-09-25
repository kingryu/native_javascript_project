const path = require('path');
const pkg = require('./package.json')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
let version = pkg.version

const extractSass = new ExtractTextPlugin({
  filename: "nativejssamples.css",
  disable: process.env.NODE_ENV === "production"
});

module.exports = {
  entry: './src/index.js',
  devServer: {
    host:"0.0.0.0",
    contentBase: './demos'
  },
  output: {
    filename: 'nativejssamples.js',
    path: path.resolve(__dirname, 'dist/'+version),
    library:'nativejssamples',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },{
        test: /\.art$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'art-template-loader',
        }
      }, {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }],
          // 在开发环境使用 style-loader
          fallback: "style-loader"
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: ('img/[name].[hash:7].[ext]')
              }
          }
        ]
      }
    ]
  },
  plugins: [
    extractSass
    // new webpack.SourceMapDevToolPlugin()
  ]
};