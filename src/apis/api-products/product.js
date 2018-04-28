/**
 * 商品管理API
 *
 * @author  luoyc
 * @created 2018-03-14
 */

import http from '@/assets/scripts/iotp-http'

const product = '/pms/product'
const products = '/web/product'

export default {
  /**
   * 商品分页数据
   * @param params 请求参数
   */
  page (params = {}) {
    return http.get(product,params)
  },

  /**
   * 获取商品单条数据
   * @param id 商品id
   */
  detail (id = '') {
    return http.get(`${product}/${id}`)
  },

  /**
   * 新增商品
   * @param data 提交的数据
   * @returns {*}
   */

  create (data = {}) {
    return http.postJson(products,data)
  },

  /**
   * 编辑商品详情
   * @param id 商品id
   * @param data 提交商品详情数据
   * @returns {*}
   */
  editDescription (id = '',data = '') {
    return http.postJson(`${products}/${id}/description`,data)
  },

  /**
   * 修改商品价格
   * @param id 商品id
   * @param params 提交商品价格
   * @returns {*}
   */
  editPrice (id = '', params = {}) {
    return http.post(`${products}/${id}/price`,params)
  },

  /**
   * 开启/编辑商品试用
   * @param id 商品id
   * @param data 提交商品试用数据
   * @returns {*}
   */
  openTrial (id = '',data = {}) {
    return http.postJson(`${products}/${id}/trial`,data)
  },

  /**
   * 关闭商品试用
   * @param id 商品id
   */
  closeTrial (id = '') {
    return http.del(`${products}/${id}/trial`)
  },

  /**
   * 开放销售
   * @param id 商品id
   */
  openSale (id = '') {
    return http.post(`${products}/${id}/sale`)
  },

  /**
   * 关闭销售
   * @param id 商品id
   */
  closeSale (id = '') {
    return http.del(`${products}/${id}/sale`)
  },

  /**
   * 商品上架
   * @param id 商品id
   */
  listing (id = '') {
    return http.post(`${products}/${id}/listing`)
  },

  /**
   * 商品下架
   * @param id 商品id
   */
  delisting (id = '') {
    return http.del(`${products}/${id}/delisting`)
  },

  /**
   * 商品定时上架
   * @param id 商品id
   * @param data 提交数据
   */
  timingListing (id = '',data = {}) {
    return http.postJson(`${products}/${id}/listing/times`,data)
  },

  /**
   * 商品定时下架
   * @param id 商品id
   * @param data 提交数据
   */
  timingDelisting (id = '',data = {}) {
    return http.postJson(`${products}/${id}/delisting/times`,data)
  },

  /**
   * 删除商品
   * @param id 商品id
   */
  del (id = '') {
    return http.del(`${products}/${id}`)
  },

  /**
   * 获取商品标签列表数据
   */
  getTags () {
    return http.get(`${products}/tags`)
  },

  /**
   * 获取定时上下架时间
   * @param id 商品id
   */
  getListingTimes (id = '') {
    return http.get(`${products}/${id}/listing/times`)
  },

  /**
   * 获取包装售后数据
   * @param params 产品类型product_type
   */
  getAfterSale (params = {}) {
    return http.get(`${products}/aftersale`,params)
  },
  /**
   * 更新包装售后数据
   * @param id 商品id
   * @param data 提交数据
   * @returns {*}
   */
  updateAfterSale (id = '',data = {}) {
    return http.postJson(`${products}/${id}/aftersale`,data)
  },

  /**
   * 修改商品图片
   * @param id 商品id
   * @param params 商品图片参数
   */
  editProImg (id = '',params = {}) {
    return http.post(`${products}/${id}/images`,params)
  }

}
