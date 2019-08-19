const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
module.exports = {
  entry: {
    app: './src/index.js',
    search: './src/search.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash:8].[ext]'
          }
        }
      }
    ]
  },
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['search'],
      inject: true,
      minify: {
        html5: true,
        minifyJS: true,
        minifyCSS: true,
        preserveLineBreaks: false,
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    })
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
}