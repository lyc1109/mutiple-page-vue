/**
 * 用于生存环境的构建脚本
 */
let ora = require('ora');
let rm = require('rimraf');
let webpack = require('webpack');

// 环境信息配置
let envConfig = require('../config/dev.env');
let outConfig = require('../config/output');

// 引入 webpack 生成环境配置文件
let webpackConfig = require('./webpack.base4dev.conf');

// 处理过程可使用环境变量
// http://vuejs.github.io/vue-loader/en/workflow/production.html
webpackConfig.plugins.push(
  new webpack.DefinePlugin({
    'process.env': envConfig
  })
);

// 启动监听服务
Object.assign(webpackConfig, {
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
});

console.log("\n启动本地开发环境\n");
let spinner = ora('');
spinner.start();

// 先清除/dist/static目录
rm(outConfig.assetsRoot, err => {
  if (err) throw err;

  // webpack 执行构建任务
  webpack(webpackConfig, function (err, stats) {
    spinner.stop();
    if (err) throw err;
  })
});
