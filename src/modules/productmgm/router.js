/**
 * 商品管理-路由
 *
 * @author  luoyc
 * @created 2018-03-27
 */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes = [
  /**
   * 商品管理
   */
  {
    path: '/',
    meta: {
      title: '商品管理'
    },
    redirect: '/product'
  },
  {
    path: '/product',
    meta: {
      title: '商品管理'
    },
    component (resolve) {
      require(['@mdus/productmgm/product/list.vue'],resolve)
    }
  },
  {
    path: '/product/create',
    meta: {
      title: '添加商品'
    },
    component (resolve) {
      require(['@mdus/productmgm/product/form.vue'],resolve)
    }
  },
  {
    path: '/product/:id',
    meta: {
      title: '商品详情'
    },
    component (resolve) {
      require(['@mdus/productmgm/product/view.vue'],resolve)
    }
  },

  /**
   * 品牌管理
   */
  {
    path: '/brand',
    meta: {
      title: '品牌管理'
    },
    component (resolve) {
      require(['@mdus/productmgm/brand/list.vue'],resolve)
    }
  },

  /**
   * 分类管理
   */
  {
    path: '/category',
    meta: {
      title: '分类管理'
    },
    component (resolve) {
      require(['@mdus/productmgm/category/list.vue'],resolve)
    }
  },

  /**
   * 智能模板配置
   */
  {
    path: '/iotmodel',
    meta: {
      title: '智能模板配置'
    },
    component (resolve) {
      require(['@mdus/productmgm/iotmodel/list.vue'],resolve)
    }
  },
]

export default new Router({
  /*mode: 'history',*/
  // scrollBehavior,
  routes
})
