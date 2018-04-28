/**
 * 环境变量定义: 仿真测试环境
 * @type {{NODE_ENV: string}}
 */

let path = require('path');
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  // 打包后静态资源输出目录
  assetsRoot: path.resolve(__dirname, '../../dist'),

  NODE_ENV: '"stage"',
  REQUEST_TIME_OUT: '5000',

  HOST_BASE: '"http://tapiweb.xohaa.net"',
  API_HOST_BASE: '"http://tapiweb.xohaa.net/api/v3"',
  // PRODUCT_HOST: '"http://tapiweb.xohaa.net/api/v3/product"',

  // 阿里云OSS访问域名
  OSS_HOST: '"http://assets.xohaa.net"',
})
