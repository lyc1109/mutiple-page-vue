/**
 * 商品管理-index
 *
 * @author  luoyc
 * @created 2018-03-27
 */

import Vue from '@/entry'
import App from '@/app'
import router from './router'

import api from '@/apis/api-products/product'
import brandApi from '@/apis/api-products/brand'
import categoryApi from '@/apis/api-products/category'
import giftApi from '@/apis/api-products/gift'
import partApi from '@/apis/api-products/part'
import promotionApi from '@/apis/api-products/promotion'
import propertyApi from '@/apis/api-products/property'
import specApi from '@/apis/api-products/spec'
import iotmodelApi from '@/apis/api-products/iotmodel'

// 商品管理API
Vue.prototype.$shopproduct = '/pms/product'
Vue.prototype.$shopproducts = '/web/product'
// 商品品牌管理API
Vue.prototype.$proBrand = '/web/product/brand'
// 商品分类管理API
Vue.prototype.$proCategory = '/web/product/category'
// 商品赠品API
Vue.prototype.$proGift = '/web/productgift'
// 商品配件API
Vue.prototype.$proPart = '/web/productpart'
// 商品促销管理API
Vue.prototype.$promotion = '/web/promotion'
// 商品属性管理API
Vue.prototype.$property = '/web/product/property'
// 商品规格管理API
Vue.prototype.$proSpec = '/web/product/spec'
Vue.prototype.$proStandSpec = 'web/standard/spec'
// 商品标准参数管理API
Vue.prototype.$stdproperty = '/web/product/stdproperty'

Vue.prototype.$productApi = api
Vue.prototype.$proBrandApi = brandApi
Vue.prototype.$proCategoryApi = categoryApi
Vue.prototype.$proGiftApi = giftApi
Vue.prototype.$proPartApi = partApi
Vue.prototype.$promotionApi = promotionApi
Vue.prototype.$propertyApi = propertyApi
Vue.prototype.$specApi = specApi
Vue.prototype.$iotmodelApi = iotmodelApi

new Vue({
  el: '#app',
  router,
  template: '<app/>',
  components: { App }
})
