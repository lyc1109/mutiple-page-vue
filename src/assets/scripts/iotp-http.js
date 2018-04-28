/**
 * HTTP请求封装
 *
 * @author huchiwei
 * @create 2018-01-18
 */

import axios from 'axios';
import localStorage from '@scripts/iotp-localstorage';

export default (function () {
// 常量设置
  const TOKEN_KEY = "token";
  const REQUEST_TIME_OUT = 10000;
  let vm = new Vue()

// 设置ContentType
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// http request 拦截器
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.get(TOKEN_KEY);
      if (token !== null && token !== "") {
        config.headers['x-requested-from'] = "apiHttpRequest";
        config.headers['x-auth-token'] = token;
      }
      config.headers.apiRequest = true;
      return config;
    },
    (err) => Promise.reject(err));


// ========================================================
// http response 拦截器
  /**
   * 打印广播请求错误消息
   * @param errMsg
   */
  function fireErrMsg(errMsg){
    let msg = "Ops...未知请求异常";
    if(errMsg && errMsg !== null && errMsg !== "") {
      msg = "请求系统异常：" + errMsg;
    }
    // TODO: 发起广播
    console.log(msg);
    vm.$message({
      type: 'error',
      message: msg
    })
    // Vue.bus.emit("toast-error", msg);
  }

  /**
   * TODO: 广播重新登录错误
   */
  function fireOauthErr() {
    console.log("请重新登录");
    // Vue.bus.emit("oauth");
  }

  axios.interceptors.response.use(
    (response) => {
      const respData = response.data;

      // 状态码为0表示请求成功，否则失败
      if(respData.code === 0 || respData.returnCode === 0) {
        return respData.data !== null ? respData.data : respData;
      } else {
        // 未授权登录
        if(respData.httpStatusCode === 401 || respData.code === 1200) {
          fireOauthErr();
        } else {
          fireErrMsg((respData.returnMsg || respData.errMsg) + "(" + (respData.returnCode || respData.code) + ")");

          // TODO: 广播错误码
          /*if((respData.httpStatusCode === 404 || respData.httpStatusCode === 500) && store) {
            store.commit(types.common.setErrorCode, respData.httpStatusCode);
          }*/
        }
        return Promise.reject(respData);
      }
    },
    (error) => {
      const response = error.response;
      let errMsg = "";

      console.log(error);
      // setTimeout(() => {
      //   vm.$message({
      //     type: 'error',
      //     message: JSON.stringify(error)
      //   })
      // },3000)

      /*if(response && store) {
        let _code = response.data.returnCode || '';
        store.commit(types.common.setErrorCode, _code);
      }*/

      if(response && response.data) {
        // 未授权登录
        if(response.data.httpStatusCode === 401 || response.data.returnCode === 1200 || response.data.code === 1200) {
          fireOauthErr();
        } else {
          // 其它错误信息处理
          if(response.data.returnMsg) {
            errMsg = response.data.returnMsg + "(" + response.data.returnCode + ")";
          } else if(response.data.errMsg) {
            errMsg = response.data.errMsg + "(" + response.data.code + ")";
          }
        }
      }
      fireErrMsg(errMsg);
      return Promise.reject(errMsg)
    }
  );

  return {
    /**
     * POST 请求
     * @param url    请求地址
     * @param params 参数(会转为URL参数，若需传对象请使用postJson方法)
     * @param data 提交参数
     */
    post: function (url, params = {}, data = {}) {
      return axios({
        method: 'POST',
        url: url,
        params: params,
        data: data,
        timeout: REQUEST_TIME_OUT
      })
    },

    /**
     * POST 请求
     * @param url         请求地址
     * @param requestBody 对象参数
     */
    postJson: function (url = "", requestBody = {}) {
      return axios({
        method: 'POST',
        url: url,
        data: requestBody,
        timeout: REQUEST_TIME_OUT,
        headers: {'Content-Type': 'application/json'},
      })
    },

    /**
     * GET 请求
     * @param url    请求地址
     * @param params 参数
     */
    get: function (url, params = {}) {
      return axios({
        method: 'GET',
        url: url,
        params: params,
        timeout: REQUEST_TIME_OUT
      });
    },

    /**
     * DELETE请求
     * @param url    请求地址
     * @param params 参数
     */
    del: function (url, params = {}) {
      return axios({
        method: 'DELETE',
        url: url,
        params: params,
        timeout: REQUEST_TIME_OUT
      });
    },

    /**
     * AJAX请求，自行组装参数
     * @param options
     */
    ajax: function (options = {}) {
      return axios(options);
    }
  }
}());
