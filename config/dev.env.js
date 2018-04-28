/**
 * 环境变量定义: 开发
 * @type {{NODE_ENV: string}}
 */
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

// 本地IP地址
let localHost = "http://localhost";
try{
  const localConf = require("../local.conf");
  if(localConf) {
    localHost = localConf;
  }
} catch(e) {
  // do nothing
}

module.exports = Object.assign(prodEnv, {
  NODE_ENV: '"dev"',
  LOCAL_HOST: localHost,

  HOST_BASE: '"/baseApi"',
  API_HOST_BASE: '"/api"',
  // PRODUCT_HOST: '"/api/product"',

  // 阿里云OSS访问域名
  OSS_HOST: '"https://assets.xohaa.net"',

  // 跨域代理
  proxyTable: {
    '/baseApi': {
      target: 'http://192.168.0.26:8600',
      changeOrigin: true,
      pathRewrite: {
        '^/baseApi': ''
      }
    },
    '/api': {
      target: 'http://192.168.0.26:8600/api/v3',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
    // '/api/product': {
    //   target: 'http://192.168.0.26:8600/api/v3/product',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/api/product': ''
    //   }
    // }
  }
});
