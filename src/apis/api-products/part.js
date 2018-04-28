/**
 * 商品配件管理API
 *
 * @author  luoyc
 * @created 2018-04-12
 */

import http from '@/assets/scripts/iotp-http'

const part = '/web/productpart'

export default {
  /**
   * 列表数据
   * @param id 商品id
   */
  page (id) {
    return http.get(`${part}/${id}`)
  },

  /**
   * 添加配件
   * @param id 商品id
   * @param params 商品配件ID
   */
  create (id = '', params = {}) {
    return http.post(`${part}/${id}`, params)
  },

  /**
   * 删除配件
   * @param id 商品id
   * @param partId 配件id
   * @param params 商品配件ID
   */
  del (id = '',partId = '') {
    return http.del(`${part}/${id}/${partId}`)
  }
}
