/**
 * 新风系统设备API
 *
 * @author  yangshubo
 * @created 2018-04-02
 */

import http from '@/assets/scripts/iotp-http';

export default {
  /**
   * 获取指定设备的详细数据
   * @param   deviceEntityId    设备实体ID(混淆后)
   */
  detail (deviceEntityId) {
    return http.get("/api/v3/freshairdevices/" + deviceEntityId);
  },

  /**
   * 设备是否在线
   * @param   deviceEntityId    设备实体ID(混淆后)
   */
  online (deviceEntityId) {
    return http.get("/api/v3/freshairdevices/" + deviceEntityId + "/online")
  },

  /**
   * 设备日志
   * @param   deviceEntityId    设备实体ID(混淆后)
   * @param   data              参数
   */
  deviceLogs(deviceEntityId, data) {
    return http.get("/api/v3/devices/" + deviceEntityId + "/devicelogs", data)
  }


}
