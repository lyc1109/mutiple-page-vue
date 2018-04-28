/**
 * 本地缓存服务封装处理
 *
 * @author huchiwei
 * @create 2018-01-18
 */
export default (function () {
  const namespace = "iotp";
  const sessionStorage = window.sessionStorage;

  let getStorage = function () {
    if(sessionStorage.getItem(namespace) === null) {
      sessionStorage.setItem(namespace,'{}');
    }
    return JSON.parse(sessionStorage.getItem(namespace));
  };

  return {
    set: function (key, val) {
      const storage = getStorage();
      storage[key] = val;
      sessionStorage.setItem(namespace, JSON.stringify(storage));
    },

    get: function (key) {
      const storage = getStorage();
      return storage[key] !== undefined ? storage[key] : null;
    },

    remove: function (key) {
      const storage = getStorage();
      delete storage[key];
      sessionStorage.setItem(namespace, JSON.stringify(storage));
    },

    hasKey: function (key) {
      const item = this.get(key);
      return item !== null && typeof item !== "undefined";
    }
  }
}())
