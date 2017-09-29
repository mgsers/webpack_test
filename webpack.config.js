var webpack = require('webpack')
var opn = require('opn')
var ora = require('ora')
var path = require('path')
// require('webpack-dev-server')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var TransferWebpackPlugin = require('transfer-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// opn('www.baidu.com')

var spinner = ora('the building is start')
spinner.start()


module.exports = {
  entry: {
    // 'webpack/hot/dev-server',
    // minChunks可自动识别node_modules中存在的项目以来库并将之合并到vendor文件中，而不用我们一个个的添加声明
    // vendor: ['vue'],
    index: './app.js'
  },
  output: {
    filename: '[name].[chunkhash].file.js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    path: __dirname + '/build'
  },
  externals: {
    jquery: "jQuery"
  },
  devtool: 'eval-source-map',
  plugins: [
    // new webpack.DllPlugin({
    //   context: __dirname,                // 必填项，用来标志manifest中的路径
    //   path: path.join(__dirname, "manifest.json"),    // 必填项，存放manifest的路径
    //   name: '[name]'                     // 必填项，manifest的name
    // }),
    new CleanWebpackPlugin('build'),
    // 此处用contenthash避免js，css hash值一直而失去缓存的功能
    new ExtractTextPlugin('index.[contenthash].css'),
    // new webpack.DefinePlugin({
    //   'process.env': 'hello'
    // }),
    new webpack.BannerPlugin('admin'),
    // （注意：不要在开发环境下使用 [chunkhash]，因为这会增加编译时间。将开发和生产模式的配置分开，并在开发模式中使用 [name].js 的文件名，在生产模式中使用 [name].[chunkhash].js 文件名，所以如果这个时候使用了热替换插HotModuleReplacementPlugin，将会导致编译不成功！）
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        // 压缩代码，不将没用的变量，代码删除，如需则启用之
        warnings: false
      }
    }),
    // 防止模塊內新引入模塊而導致chunkhash改變問題，實質是使每個chunk都有唯一id，而不是 01234
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name : 'vendor',
      // 解析祥见https://zhuanlan.zhihu.com/p/27710902
      // 筛选模块被引用的次数，如果小于设置数，则不会被合并到vendor中（2 <= minChunks <= chunks总数(Infinity)）
      minChunks: ({resource}) => {
        return  resource &&
                resource.indexOf('node_modules') >= 0 &&
                resource.match(/\.js$/)
      }
    }),
    // vendor 和 manifest必须分开进行执行
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      // 声明该manifest来源于vendor
      chunks: ['vendor']
    }),
    new HtmlWebpackPlugin({
      template: __dirname + '/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    // manifest只是一份映射清单，有时单独请求有点浪费，不如将其写进index.html中，减少后台请求数
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest'
    }),
    // webpack 分析
    // new BundleAnalyzerPlugin(),
    // webpack 2/3 已默认开启此配置，用于排列顺序
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