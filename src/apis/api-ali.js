/**
 * 阿里云相关API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import http from '@/assets/scripts/iotp-http';

export default {
  /**
   * 获取OSS上传STS临时签名凭证
   */
  getOssStsSign: function () {
    return http.get("/api/v3/ali/stssign");
  }
};
