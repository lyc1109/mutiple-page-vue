import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let routes = [
  {
    path: "",
    meta: {
      title: 'iotp-web-demo'
    },
    redirect: "/datagrid"
  },
  {
    path: "/datagrid",
    meta: {
      title: 'demo-datagrid'
    },
    component: function (resolve) {
      require(['@mdus/demo/datagrid/list.vue'], resolve);
    }
  },
  {
    path: "/timeline",
    meta: {
      title: 'demo-timeline'
    },
    component: function (resolve) {
      require(['@mdus/demo/timeline/index.vue'], resolve);
    }
  },
  {
    path: "/form",
    meta: {
      title: 'demo-form'
    },
    component: function (resolve) {
      require(['@mdus/demo/forms/form.vue'], resolve);
    }
  },
  {
    path: "/v-form-currency",
    meta: {
      title: 'v-form-currency'
    },
    component: function (resolve) {
      require(['@mdus/demo/forms/form-currency.vue'], resolve);
    }
  }
];

export default new Router({
  /*mode: 'history',*/
  // scrollBehavior,
  routes
})
