/**
 * 销售中心-路由
 *
 * @author  yangshubo
 * @created 2018-04-02
 */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

let routes = [
  {
    path: '',
    meta: {
      title: '销售订单'
    },
    redirect: '/order'
  },
  {
    path: "/order",
    meta: {
      title: '销售订单'
    },
    component: function (resolve) {
      require(['@mdus/salecenter/order/list.vue'], resolve);
    }
  },
  {
    path: "/order/:entityId",
    meta: {
      title: '销售订单详情'
    },
    component: function (resolve) {
      require(['@mdus/salecenter/order/view.vue'], resolve);
    }
  },
  {
    path: "/ifreshair/:deviceEntityId",
    meta: {
      title: '销售设备详情'
    },
    component: function (resolve) {
      require(['@mdus/salecenter/ifreshair/view.vue'], resolve);
    }
  }
];

export default new Router({
  routes
})
