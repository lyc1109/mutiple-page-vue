/**
 * 系统管理-路由
 *
 * @author  luoyc
 * @created 2018-03-19
 */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes = [
  {
    path: '',
    meta: {
      title: '设备批量导入'
    },
    redirect: '/exportdevice'
  },
  {
    path: '/exportdevice',
    meta: {
      title: '设备批量导入'
    },
    component (resolve) {
      require(['@mdus/sysconfig/exportdevice/list.vue'],resolve)
    }
  }
]

export default new Router({
  /*mode: 'history',*/
  // scrollBehavior,
  routes
})
