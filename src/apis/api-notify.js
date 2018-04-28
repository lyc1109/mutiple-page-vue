/**
 * 消息通知API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import http from '@/assets/scripts/iotp-http';

export default {
  /**
   * 消息通知分页数据
   */
  page: function (page_no = 0, page_size = 20, page_sort = "") {
    return http.get("/api/v3/notify/unread/count", {
      page_no: page_no,
      page_size: page_size,
      page_sort: page_sort
    });
  },

  /**
   * 未读消息数量
   */
  unreadCount: function (includeShop = false) {
    return http.get("/api/v3/notify/unread/count", {
      include_shop: includeShop
    });
  },
};
