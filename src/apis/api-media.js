/**
 * 素材管理API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import http from '@/assets/scripts/iotp-http';

export default {
  /**
   * 素材信息分页数据
   */
  page: function (params = {}) {
    let newParams = Object.assign({
      page_no: 1,
      page_size: 20
    }, params);
    return http.get("/api/v3/media/page", newParams);
  },

  /**
   * 获取当前店铺所有分组信息
   */
  groups: function () {
    return http.get("/api/v3/media/groups");
  },
};
