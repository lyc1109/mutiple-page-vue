/**
 * 本地存储服务封装处理
 *
 * @author huchiwei
 * @create 2018-01-18
 */
export default (function () {
  const namespace = "iotp";
  const localStorage = window.localStorage;

  let getStorage = function () {
    if(localStorage.getItem(namespace) === null) {
      localStorage.setItem(namespace,'{}');
    }
    return JSON.parse(localStorage.getItem(namespace));
  };

  return {
    set: function (key, val) {
      const storage = getStorage();
      storage[key] = val;
      localStorage.setItem(namespace, JSON.stringify(storage));
    },

    get: function (key) {
      const storage = getStorage();
      return storage[key] !== undefined ? storage[key] : null;
    },

    remove: function (key) {
      const storage = getStorage();
      delete storage[key];
      localStorage.setItem(namespace, JSON.stringify(storage));
    },

    hasKey: function (key) {
      const item = this.get(key);
      return item !== null && typeof item !== "undefined";
    }
  }
}())
