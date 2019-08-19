const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const glob = require('glob')
const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = []
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index]
    const match = entryFile.match(/src\/(.*)\/index\.js/)
    const pageName = match && match[1]
    entry[pageName] = entryFile
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify: {
          html5: true,
          minifyCSS: true,
          minifyJS: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          removeComments: true
        }
      }))
  })
  return {
    entry,
    htmlWebpackPlugins
  }
}
const {
  entry,
  htmlWebpackPlugins
} = setMPA()
module.exports = {
  entry,
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')()
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75
            }
          }
        ]
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: '[name]_[hash:8].[ext]'
          }
        }
      }
    ]
  },
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    })
  ].concat(htmlWebpackPlugins),
  devServer: {
    contentBase: './dist',
    hot: true
  },
  devtool: 'source-map'
}