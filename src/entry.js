/**
 * APP入口基础配置文件，所有多页面模块都必须引用此文件导入Vue模块
 *
 * @author huchiwei
 * @create 2018-02-25
 */

import Vue from 'vue'
import ElementUI from 'element-ui';

import VueBus from 'vue-bus'
Vue.use(VueBus)

// 注册app样式
// -----------------------------------------------
import '@assets/scss/app.scss';

// 注册iotp工具库
import iotp from '@scripts/iotp';
import utils from '@scripts/iotp-utils';
import MessageBox from '@/assets/scripts/iotp-message-box'
Vue.prototype.$app = iotp.constant;
Vue.prototype.$localStorage = iotp.localStorage;
Vue.prototype.$sessionStorage = iotp.sessionStorage;
Vue.prototype.$http = iotp.http;
Vue.prototype.$utils = utils;
Vue.prototype.$messageBox = MessageBox

// api地址配置
// 基本api地址，如 http://api.xohaa.net
Vue.prototype.$baseApi = process.env.HOST_BASE;
// 通用api地址，如 http://api.xohaa.net/api/v3
Vue.prototype.$apis = process.env.API_HOST_BASE;

// 注册通用组件
import VApp from '@/layout/v-app';
import VDatagrid from '@/components/v-datagrid';
import VButtonOk from '@/components/v-button-ok';
import VButtonBack from '@/components/v-button-back';
import VConfirmBtnr from '@/components/v-confirm-btn'
import VTableDialog from '@/components/v-table-dialog'
import VFormPopover from '@/components/v-form-popover'
import VSelectCity from '@/components/v-select-city'

Vue.component("v-app", VApp);
Vue.component("v-datagrid", VDatagrid);
Vue.component("v-button-ok", VButtonOk);
Vue.component("v-button-back", VButtonBack);
Vue.component('v-confirm-btn', VConfirmBtnr);
Vue.component('v-table-dialog',VTableDialog);
Vue.component('v-form-popover',VFormPopover);
Vue.component('v-select-city',VSelectCity);

// 注册filter
import filters from '@/filters/index';
Vue.prototype.$filters = filters;

// 注册UI工具库

Vue.use(ElementUI);

export default Vue;
