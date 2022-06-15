/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-11-24 11:07:03
 * @LastEditors: lgc
 * @LastEditTime: 2021-12-08 16:23:08
 */
import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
Vue.use(Vuex);
const modulesFiles = require.context('./modules', true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});
const store = new Vuex.Store({
  modules,
  getters,
});
export default store;
