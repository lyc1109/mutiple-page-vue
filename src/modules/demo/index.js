/**
 * index
 *
 * @author  hucw
 * @created 2018-01-17
*/
import Vue from '@/entry';
import App from '@/app'
import router from './router';

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
});
