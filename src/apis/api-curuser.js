/**
 * 当前用户API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import http from '@/assets/scripts/iotp-http';

export default {
  /**
   * 获取当前用户信息
   */
  curuser: function () {
    return http.get("/api/v3/user");
  },
};
