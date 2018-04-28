/**
 * 租赁-路由
 *
 * @author  luoyc
 * @created 2018-03-13
 */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes = [
  {
    path: '',
    meta: {
      title: '租赁管理'
    },
    redirect: '/statistic'
  },
  {
    path: '/statistic',
    meta: {
      title: '统计分析'
    },
    component (resolve) {
      require(['@mdus/leasecenter/statistic/list.vue'],resolve)
    }
  },
  {
    path: '/statistic/:type',
    meta: {
      title: '统计分析详情'
    },
    component (resolve) {
      require(['@mdus/leasecenter/statistic/view.vue'],resolve)
    }
   }
]

export default new Router({
  /*mode: 'history',*/
  // scrollBehavior,
  routes
})
