/**
 * 商品参数管理API
 *
 * @author  luoyc
 * @created 2018-04-12
 */

import http from '@/assets/scripts/iotp-http'

const stdproperty = '/web/product/stdproperty'
const property = '/web/product/property'

export default {
  /**
   * 获取标准参数列表
   * @param params 请求参数
   */
  page (params = {}) {
    return http.get(`${stdproperty}`, params)
  },

  /**
   * 修改标准参数
   * @param id 商品id
   * @param data 提交的参数
   * @returns {*}
   */
  save (id = '', data = {}) {
    return http.postJson(`${property}/${id}/std`,data)
  },

  /**
   * 修改销售属性
   * @param id 商品id
   * @param data 提交的参数
   * @returns {*}
   */
  editSale (id = '', data = {}) {
    return http.postJson(`${property}/${id}/sale`,data)
  },

  /**
   * 保存商品自定义参数
   * @param id 商品id
   * @param properId 参数id
   * @param data 提交的参数
   * @returns {*}
   */
  saveCustom (id = '', properId = '', data = {}) {
    return http.postJson(`${property}/${id}/custom/${properId}`, data)
  },

  /**
   * 删除商品参数
   * @param id 参数id
   */
  del (id = '') {
    return http.del(`${property}/${id}`)
  },

  /**
   * 修改商品基础信息
   * @param id 商品id
   * @param data 提交的数据
   * @returns {*}
   */
  editBasic (id = '',data = {}) {
    return http.postJson(`${property}/${id}/brief`,data)
  }
}
