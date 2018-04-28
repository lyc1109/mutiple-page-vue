/**
 * iotp常用工具函数
 *
 * @author huchiwei
 * @create 2018-03-09
 */
export default {

  /**
   * 从浏览器URL上获取指定参数值
   * @param key 参数名
   */
  getParamsFromUrl: function (key) {
    const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i")
    let result = null
    // vue hash模式
    let hashParams = window.location.hash.split("?")[1]
    if(hashParams) {
      result = hashParams.match(reg)
    } else {
      result =window.location.search.substr(1).match(reg)
    }
    return result !== null ? result[2] : null
  },

  /**
   * 添加参数到浏览器URL
   * @param params 参数
   */
  addParamsToUrl: function(params = {}){
    if(JSON.stringify(params) === "{}") {
      return
    }

    let href = window.location.href
    for(let key of Object.keys(params)) {
      if(href.lastIndexOf(key + "=") > -1){
        href = this.replaceParamsFromUrl(key, params[key])
      } else {
        if(href.lastIndexOf("?") > -1) {
          href += "&"
        } else {
          href += "?"
        }
        href += key + "=" + params[key]
      }
    }
    window.location.href = href
  },

  /**
   * 替换浏览器URL上指定的参数值
   * @param key   参数
   * @param value 参数值
   */
  replaceParamsFromUrl: function (key, value) {
    let href = window.location.href
    // return href.replace(new RegExp('('+ key +'=)([^&]*)', "gi"), key +"="+ value)
    window.location.href = href.replace(new RegExp('('+ key +'=)([^&]*)', "gi"), key +"="+ value)
  },

  /**
   * 删除浏览器URL上指定的参数
   * @param name 参数名
   */
  delUrlParam: function (name) {
    let loca = window.location;
    let baseUrl = loca.origin + loca.pathname + "?";
    let query = loca.search.substr(1);
    console.log(baseUrl)
    if (query.indexOf(name) > -1) {
      let obj = {}
      let arr = query.split("&");
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split("=");
        obj[arr[i][0]] = arr[i][1];
      }
      console.log(obj)
      delete obj[name]
      let url = null
      url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
      if (url.indexOf('=') <= -1) {
        url = url.replace('?', '')
      }
      // window.location.href = url
      history.replaceState({}, null, url)
    }
  }
}
