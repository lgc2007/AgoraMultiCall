/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-05-19 15:04:26
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-17 15:55:44
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { Toast } from 'vant';
import Message from './components/message/main.js';
import store from './store/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/icon/index';

import AgoraRtcVue from 'agora-rtc-vue/lib/agora-rtc-vue.umd';
import 'agora-rtc-vue/lib/agora-rtc-vue.css';

Vue.config.productionTip = false;

Vue.prototype.$message = Message;

Vue.use(Toast);
Vue.use(ElementUI);
Vue.use(AgoraRtcVue, {});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
