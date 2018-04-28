/**
 * 商品规格管理API
 *
 * @author  luoyc
 * @created 2018-04-12
 */

import http from '@/assets/scripts/iotp-http'

const proSpec = '/web/product/spec'
const proStandSpec = '/web/standard/spec'

export default {
  /**
   * 根据商品类型获取标准商品规格与选项内容
   * @param params 适用商品类型
   */
  page (params = {}) {
    return http.get(`${proStandSpec}/select`, params)
  },
  /**
   * 检查商品规格是否存在
   * @param params 产品基本信息货号、规格集合列表
   */
  isExist (params = {}) {
    return http.get(`${proSpec}/existence`, params)
  },

  /**
   * 批量修改商品规格
   * @param params 商品id
   * @param data 提交商品规格参数
   * @returns {*}
   */
  save (params = {}, data = {}) {
    return http.post(`${proSpec}/update`, params, data)
  }
}
