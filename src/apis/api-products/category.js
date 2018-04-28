/**
 * 商品分类管理API
 *
 * @author  luoyc
 * @created 2018-04-12
 */

import http from '@/assets/scripts/iotp-http'

const category = '/web/product/category'

export default {
  /**
   * 分页数据
   * @param params 请求参数
   */
  page (params = {}) {
    return http.get(category,params)
  },

  /**
   * 获取分类单条数据
   * @param id 分类id
   */
  detail (id = '') {
    return http.get(`${category}/${id}`)
  },

  /**
   * 保存分类(新增/新增子类/编辑)
   * @param id 分类id
   * @param data 提交的参数
   * @returns {*}
   */
  save (id = '', data = {}) {
    return http.postJson(`${category}/${id}`,data)
  },

  /**
   * 删除分类
   * @param id 分类id
   */
  del (id = '') {
    return http.del(`${category}/${id}`)
  },

  /**
   * 判断分类是否已存在
   * @param params 请求参数
   */
  isExist (params = {}) {
    return http.get(`${category}/existence`,params)
  }
}
