/**
 * 租赁场景相关API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import http from '@/assets/scripts/iotp-http';
import localStorage from "@/assets/scripts/iotp-localstorage";
import sessionStorage from "@/assets/scripts/iotp-sessionstorage";

export default {
  /**
   * 获取租赁场景菜单
   */
  getScenariosForMenu: function () {
    return new Promise((resolve) => {
      const scenarioKey = "scenarios";
      const curShopKey = "curShop";

      let existScenarios = localStorage.get(scenarioKey);
      let curShop = sessionStorage.get(curShopKey);
      const now = new Date().getTime();
      if(existScenarios !== null && curShop !== null && curShop.id === existScenarios.shopId) {
        // 有效时间为1小时
        if((now-existScenarios.time)/(1000*60*60) <= 2) {
          resolve(existScenarios.data);
        } else {
          this._fetchScenariosFromServer(resolve, scenarioKey, curShop);
        }
      } else {
        this._fetchScenariosFromServer(resolve, scenarioKey, curShop);
      }
    });
  },

  _fetchScenariosFromServer: function (resolve, scenarioKey, curShop) {
    http.get(this._baseUrl() + "/menus")
      .then((resp) => {
        localStorage.set(scenarioKey, {
          time: new Date().getTime(),
          shopId: curShop.id,
          data: resp
        });
        resolve(resp);
      });
  },

  _baseUrl: function () {
    return "/api/v3/lease/scenarios";
  }
};
