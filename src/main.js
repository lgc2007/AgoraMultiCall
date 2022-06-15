/*
 * @Description: 
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-05-19 15:04:26
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-10 14:25:31
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Message from "./components/message/main.js"
import store from './store/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import AgoraRtcVue from "agora-rtc-vue/lib/agora-rtc-vue.umd";
import "agora-rtc-vue/lib/agora-rtc-vue.css";

Vue.config.productionTip = false;

Vue.prototype.$message = Message;

Vue.use(ElementUI);
Vue.use(AgoraRtcVue,{});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
