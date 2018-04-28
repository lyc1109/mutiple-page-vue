/**
 * 环境变量定义: 生产环境
 * @type {{NODE_ENV: string}}
 */
let path = require('path');

module.exports = {
  // 打包后静态资源输出目录
  assetsRoot: path.resolve(__dirname, '../../dist'),

  NODE_ENV: '"production"',
  REQUEST_TIME_OUT: '5000',

  HOST_BASE: '"http://apiweb.xohaa.net"',
  API_HOST_BASE: '"http://apiweb.xohaa.net/api/v3"',
  // PRODUCT_HOST: '"http://apiweb.xohaa.net/api/v3/product"',

  // 阿里云OSS访问域名
  OSS_HOST: '"http://assets.xohaa.net"',
};
