/**
 * 商品品牌管理API
 *
 * @author  luoyc
 * @created 2018-04-12
 */

import http from '@/assets/scripts/iotp-http'

const brand = '/web/product/brand'

export default {
  /**
   * 分页数据
   * @param params 请求参数
   */
  page (params = {}) {
    return http.get(brand, params)
  },

  /**
   * 单条数据
   * @param id 品牌id
   */
  detail (id = '') {
    return http.get(`${brand}/${id}`)
  },

  /**
   * 保存(新建/编辑)
   * @param id 品牌id
   * @param data 提交的数据
   * @returns {*}
   */
  save (id = '', data = {}) {
    return http.postJson(`${brand}/${id}`, data)
  },

  /**
   * 禁用
   * @param id 品牌id
   */
  disable (id = '') {
    return http.post(`${brand}/${id}/disable`)
  },

  /**
   * 启用
   * @param id 品牌id
   */
  enable (id = '') {
    return http.post(`${brand}/${id}/enable`)
  },

  /**
   * 删除
   * @param id 品牌id
   */
  del (id = '') {
    return http.del(`${brand}/${id}`)
  },

  /**
   * 判断是否有重复的品牌
   * @param name
   */
  isExist (name = '') {
    return http.get(`${brand}/existence`,{
      name: name
    })
  }
}
