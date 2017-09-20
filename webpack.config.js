var webpack = require('webpack')
var opn = require('opn')
var ora = require('ora')
var path = require('path')
// require('webpack-dev-server')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var TransferWebpackPlugin = require('transfer-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// opn('www.baidu.com')

var spinner = ora('the building is start')
spinner.start()


module.exports = {
  entry: {
    // 'webpack/hot/dev-server',
    vendor: ['vue'],
    index: './app.js'
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: __dirname + '/build'
  },
  devtool: 'eval-source-map',
  plugins: [
    new CleanWebpackPlugin('build'),
    new ExtractTextPlugin('index.css'),
    // new webpack.DefinePlugin({
    //   'process.env': 'hello'
    // }),
    new webpack.BannerPlugin('admin'),
    new HtmlWebpackPlugin({
      template: __dirname + '/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    // （注意：不要在开发环境下使用 [chunkhash]，因为这会增加编译时间。将开发和生产模式的配置分开，并在开发模式中使用 [name].js 的文件名，在生产模式中使用 [name].[chunkhash].js 文件名，所以如果这个时候使用了热替换插HotModuleReplacementPlugin，将会导致编译不成功！）
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    // 防止模塊內新引入模塊而導致chunkhash改變問題，實質是使每個chunk都有唯一id，而不是 01234
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    // webpack 分析
    // new BundleAnalyzerPlugin()
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: [
        //   {loader: 'style-loader'},
        //   {loader: 'css-loader',
        //     options: {
        //       modules: true
        //     }}
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        // ]
      }
    ]
  }
  // devServer: {
  //   contentBase: '/',
  //   historyApiFallback: true,
  //   inline: true,
  //   hot: true
  // }
}

spinner.stop()

// http://www.jb51.net/article/120195.htm