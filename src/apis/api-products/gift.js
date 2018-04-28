/**
 * 商品赠品管理API
 *
 * @author  luoyc
 * @created 2018-04-12
 */

import http from '@/assets/scripts/iotp-http'

const gift = '/web/productgift'

export default {
  /**
   * 列表数据
   * @param id 商品id
   */
  page (id = '') {
    return http.get(`${gift}/${id}`)
  },

  /**
   * 关联商品赠品
   * @param id 商品id
   * @param data 提交的数据
   * @returns {*}
   */
  relate (id = '', data = {}) {
    return http.postJson(`${gift}/${id}`, data)
  },

  /**
   * 删除商品赠品
   * @param id 商品id
   */
  del (id = '') {
    return http.del(`${gift}/${id}`)
  }
}
