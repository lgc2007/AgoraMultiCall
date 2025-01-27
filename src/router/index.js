/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-05-19 15:04:26
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-27 08:49:55
 */
import Vue from 'vue';
import Store from '@/store';
import { getToken } from '@/utils/auth'; // get token from cookie
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/login';

Vue.use(VueRouter);

const routes = [
  { path: '*', component: Login },
  {
    path: '/',
    name: 'Home',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登陆页'
    }
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 拦截器
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  const hasToken = getToken();
  // 路由遍历的时候监控cookies是否还在
  if (!hasToken) {
    Store.dispatch('user/SET_TOKEN', hasToken);
    // Store.state.userData = '';
  }
  next();
});

export default router;
