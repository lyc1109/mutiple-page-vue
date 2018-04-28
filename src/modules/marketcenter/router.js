import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let routes = [
  {
    path: "",
    meta: {
      title: '营销中心'
    },
    redirect: "/bulletin"
  },
  {
    path: "/bulletin",
    meta: {
      title: '公告管理'
    },
    component: function (resolve) {
      require(['@mdus/marketcenter/bulletin/list.vue'], resolve);
    }
  },
  {
    path: "/bulletin/create",
    meta: {
      title: '发布公告'
    },
    component: function (resolve) {
      require(['@mdus/marketcenter/bulletin/form.vue'], resolve);
    }
  },
  {
    path: "/bulletin/:id/view",
    meta: {
      title: '查看公告'
    },
    component: function (resolve) {
      require(['@mdus/marketcenter/bulletin/view.vue'], resolve);
    }
  },
  {
    path: "/bulletin/:id/edit",
    meta: {
      title: '修改公告'
    },
    component: function (resolve) {
      require(['@mdus/marketcenter/bulletin/form.vue'], resolve);
    }
  }
];

export default new Router({
  /*mode: 'history',*/
  // scrollBehavior,
  routes
})
