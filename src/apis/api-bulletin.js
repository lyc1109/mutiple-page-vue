/**
 * 公告管理API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import http from '@/assets/scripts/iotp-http';

export default {
  /**
   * 分页数据
   * @param params 参数
    {
      page_no: 0,
      page_size: 20,
      page_sort: "created_desc",
      q: "",
      type: ""
    }
   */
  page (params = {}) {
    return http.get("/api/v3/bulletin", params);
  },

  /**
   * 创建公告
   * @param bulletin 公告
   * @returns {*}
   */
  create (bulletin) {
    return http.postJson("/api/v3/bulletin", bulletin);
  },

  /**
   * 保存修改公告
   * @param bulletin 公告
   * @returns {*}
   */
  save (bulletin) {
    return http.postJson("/api/v3/bulletin/" + bulletin.id, bulletin);
  },

  /**
   * 获取公告详情
   * @param id 公告ID
   */
  detail (id) {
    return http.get("/api/v3/bulletin/" + id);
  },

  /**
   * 置顶公告/取消置顶公告
   * @param id 公告ID
   * @param top 公告置顶参数(1-设置置顶,0-取消置顶)
   */
  top (id,top) {
    return http.post(`/api/v3/bulletin/${id}/top`,{
      top: top
    });
  },

  /**
   * 删除公告
   * @param id 公告ID
   */
  del (id) {
    return http.del("/api/v3/bulletin/" + id);
  },

  /**
   * 公告有效化/公告失效化
   * @param id 公告ID
   * @param status 公告状态参数(0-正常(默认)，9-过期)
   */
  status (id,status) {
    return http.post(`/api/v3/bulletin/${id}/state`,{
      status: status
    });
  },

  /**
   * 获取公告显示页面数据
   */
  displayPage () {
    return http.get('/api/v3/bulletin/displayconf')
  },

  /**
   * 获取公告显示方式数据
   */
  displayType () {
    return http.get('/api/v3/bulletin/displaytype')
  }
};
