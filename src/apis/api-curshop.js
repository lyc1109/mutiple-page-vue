/**
 * 当前店铺API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import http from '@/assets/scripts/iotp-http';

export default {
  /**
   * 获取当前店铺信息
   */
  curshops: function () {
    return http.get("/api/v3/curshops");
  },
};
