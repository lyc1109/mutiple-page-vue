/**
 * 系统管理-index
 *
 * @author  luoyc
 * @created 2018-03-19
 */

import Vue from '@/entry'
import App from '@/app'
import router from './router'

new Vue({
  el: '#app',
  router,
  template: '<app/>',
  components: { App }
})
