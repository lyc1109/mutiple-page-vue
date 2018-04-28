/**
 * 文件目录输出配置
 *
 * @author  hucw
 * @created 2018-01-17
 */

let path = require('path');

/**
 * 获取目录绝对路径
 *
 * @param dir 目录
 * @returns 目录绝对路径
 */
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  htmlRoot: resolve("../src/main/webapp/WEB-INF/views/v3"),
  assetsRoot: resolve("../src/main/webapp/distv3"),
  assetsPublicPath: "/distv3/"
};
