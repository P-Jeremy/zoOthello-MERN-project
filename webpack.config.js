require('dotenv').config()
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const htmlPlugin = new HtmlWebPackPlugin({
  template: './react/src/index.html',
  filename: './index.html'
})
const assetsPlugin = new CopyWebpackPlugin({
  patterns: [
    { from: 'react/src/assets', to: 'assets' }
  ]
})

const dotEnv = new webpack.DefinePlugin({
  'process.env': {
    URI: JSON.stringify(process.env.URI)
  }
})
module.exports = {
  entry: './react/src/index.js',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'react/dist'),
    filename: '[name].js'
  },
  plugins: [htmlPlugin, assetsPlugin, dotEnv],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'postcss-loader' // translates CSS into CommonJS
        }, {
          loader: 'sass-loader' // compiles Sass to CSS
        }]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: { name: '/assets/img/[name].[ext]' }
      }
    ]
  }
}
