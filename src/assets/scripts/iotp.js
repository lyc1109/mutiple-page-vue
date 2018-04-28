/**
 * IOTP工具库入口
 *
 * @author huchiwei
 * @create 2018-01-18
 */

import http from "./iotp-http";
import localStorage from "./iotp-localstorage";
import sessionStorage from "./iotp-sessionstorage";
import variable from './iotp-variable'


export default {
  constant: {
    // 是否开发环境
    isDev: process.env.NODE_ENV === "dev",
    // 阿里云oss访问地址
    ossHost: process.env.OSS_HOST,
  },
  // http请求
  http,
  // 存储管理
  localStorage,
  sessionStorage,
  // 通用变量
  variable
};
