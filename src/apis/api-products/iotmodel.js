/**
 * 智能模板API
 *
 * @author  luoyc
 * @created 2018-04-12
 */

import http from '@/assets/scripts/iotp-http'

export default {
  /**
   * 智能模板配置
   */

  /**
   * 智能模板分页数据
   * @param params 请求参数
   */
  page (params = {}) {
    return http.get('/api/v3/idevice/models',params)
  },

  /**
   * 智能模板单条数据
   * @param id 智能模板id
   */
  detail (id = '') {
    return http.get(`/api/v3/idevice/models/${id}`)
  },

  /**
   * 保存智能模板(新增/编辑)
   * @param id 智能模板id
   * @param data 提交的数据
   * @returns {*}
   */
  save (id = '',data = {}) {
    return http.postJson(`/api/v3/idevice/models/${id}`,data)
  },

  /**
   * 删除智能模板
   * @param id 智能模板id
   */
  del (id = '') {
    return http.del(`/api/v3/idevice/models/${id}`)
  },

  /**
   * 获取智能模板的通讯协议选项
   */
  firmwares () {
    return http.get('/api/v3/idevice/models/firmwares')
  }
}
