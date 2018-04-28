/**
 *
 * iotp通用变量
 * @author luoyc
 * @created 2018-04-12
 */

export default {
  // 环境变量
  isLocal: process.env.NODE_ENV === 'local',
  isDev: process.env.NODE_ENV === 'dev',
  isTest: process.env.NODE_ENV === 'test',
  isStage: process.env.NODE_ENV === 'stage',
  isProduction: process.env.NODE_ENV === 'production',

  // 基本API地址，如：http://api.xohaa.net
  baseApi: process.env.HOST_BASE,
  // 通用API地址，如：http://api.xohaa.net/api/v3
  api: process.env.API_HOST_BASE,
  // 产品API地址，如：http://api.xohaa.net/api/v3/product
  // productApi: process.env.PRODUCT_HOST
}
