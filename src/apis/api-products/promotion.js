/**
 * 商品管理API
 *
 * @author  luoyc
 * @created 2018-04-12
 */

import http from '@/assets/scripts/iotp-http'

const promotion = '/web/promotion'

export default {
  /**
   *  商品促销历史
   * @param id 商品id
   * @param params 请求参数
   */
  page (id = '', params = {}) {
    return http.get(`${promotion}/${id}`, params)
  },

  /**
   * 保存商品促销(新增,编辑)
   * @param id
   * @param promoId
   * @param params
   * @returns {*}
   */
  save (id = '', promoId = '', params = {}) {
    return http.postJson(`${promotion}/${id}/${promoId}`, params)
  }
}
