/**
 * webpack 构建基本配置
 */
let path = require('path');
let webpack = require('webpack');
let merge = require('webpack-merge');

let CopyWebpackPlugin = require('copy-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');


let utils = require('./utils');
let baseWebpackConfig = require('./webpack.base.conf');

let outConfig = require('../config/output');

/**
 * 获取目录绝对路径
 *
 * @param dir 目录
 * @returns 目录绝对路径
 */
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = merge(baseWebpackConfig, {
  // 构建输出配置
  output: {
    // 编译后输出目录
    path: outConfig.assetsRoot,
    // 编译后页面文件名格式
    filename: utils.assetsPath('scripts/[name]/[name].[chunkhash].js'),
    // 编译chunk文件名格式
    chunkFilename: utils.assetsPath('scripts/[name]/[id].[chunkhash].js'),
    // 静态资源相对引用路径
    publicPath: outConfig.assetsPublicPath
  },

  // 控制如何生存source map文件：cheap-module-source-map
  devtool: '#cheap-module-source-map',

  // 模块配置
  module: {
    // 规则配置
    rules: utils.styleLoaders({
      sourceMap: true,
      extract: true
    })
  },

  // 相关插件
  plugins: [
    // 压缩JS，参考：https://github.com/webpack-contrib/uglifyjs-webpack-plugin
    /*new UglifyJsPlugin({
      // 缓存文件
      cache: true,
      // 禁用source map
      sourceMap: false,
      // 多线程构建
      parallel: true,
      uglifyOptions: {
        compress: {
          warnings: false,
          // 删除所有的 `console` 语句
          // 还可以兼容ie浏览器
          drop_console: false,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: false,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: false,
          // 删除定义未使用变量
          unused: false
        },
        output: {
          comments: false
        },
      }
    }),*/

    // 提起css到独立文件
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),

    // 对css文件进行压缩
    /*new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),*/

    // 抽取公共模块到独立文件
    // see http://www.css88.com/doc/webpack2/plugins/commons-chunk-plugin/
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),

    // 对vendor公共模块进行缓存，避免app的文件更新时重新打包
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),

    // 复制独立的静态资源
    new CopyWebpackPlugin([
      {
        from: resolve("static"),
        to: outConfig.assetsRoot,
        ignore: ['.*']
      }
    ]),

    // 打印分析报告
    // new BundleAnalyzerPlugin(),
    // 开启gzip压缩
    /*new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.stage.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    }),*/
  ]
});

let htmlPlugins = utils.getHtmlPlugins(webpackConfig.entry, "production");
webpackConfig.plugins = webpackConfig.plugins.concat(htmlPlugins);

/**
 * 导出webpack配置
 */
//module.exports = webpackConfig;
module.exports = webpackConfig;
