/**
 * 环境变量定义: 本地测试环境
 * @type {{NODE_ENV: string}}
 */

let path = require('path');
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  // 打包后静态资源输出目录
  assetsRoot: path.resolve(__dirname, '../../dist'),

  NODE_ENV: '"test"',
  REQUEST_TIME_OUT: '5000',

  HOST_BASE: '"http://192.168.0.26:8600"',
  API_HOST_BASE: '"http://192.168.0.26:8600/api/v3"',
  // PRODUCT_HOST: '"http://192.168.0.26:8600/api/v3/product"',

  // 阿里云OSS访问域名
  OSS_HOST: '"http://assets.xohaa.net"',
})
