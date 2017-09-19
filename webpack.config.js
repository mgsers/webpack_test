var webpack = require('webpack')
var opn = require('opn')
var ora = require('ora')
var path = require('path')
// require('webpack-dev-server')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var TransferWebpackPlugin = require('transfer-webpack-plugin')

// opn('www.baidu.com')

var spinner = ora('the building is start')
spinner.start()


module.exports = {
  entry: {
    // 'webpack/hot/dev-server',
    index: './app.js',
    vendor: ['vue']
  },
  output: {
    filename: '[name].[chunkHash].js',
    // chunkFilename: '[id].[chunkhash].js',
    path: __dirname + '/build'
  },
  devtool: 'eval-source-map',
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env': 'hello'
    // }),
    new webpack.BannerPlugin('admin'),
    new HtmlWebpackPlugin({
      template: __dirname + '/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest'
    // })
    // new webpack.optimize.OccurrenceOrderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader',
            options: {
              modules: true
            }}
        ]
      }
    ]
  },
  devServer: {
    contentBase: '/',
    historyApiFallback: true,
    inline: true,
    hot: true
  }
}

spinner.stop()