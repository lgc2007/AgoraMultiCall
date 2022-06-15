/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-11-24 15:40:19
 * @LastEditors: lgc
 * @LastEditTime: 2022-05-11 15:39:12
 */
import axios from 'axios';
import { Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
// 创建实例
const service = axios.create({
  // withCredentials: true, // 当跨域请求时发送cookie
  timeout: 60000, // 超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = getToken();
    if (!config.headers.hasOwnProperty('token') && token) {
      config.headers['X-Access-Token'] = getToken();
      config.headers['X-Tenant-Id'] = 'ldjsc';
    }
    return config;
  },
  error => {
    // 处理请求错误
    console.log(error); // 方便调试
    return Promise.reject(error);
  }
);

// 响应拦截
service.interceptors.response.use(
  /**
   * 如果您想获得http信息，如报头或状态
   * 请返回  response => response
   */

  /**
   * 通过自定义代码确定请求状态
   * 这里只是一个例子
   * 也可以通过HTTP状态码来判断状态
   */
  response => {
    console.log(response);
    if (response.status === 200) {
      return response;
    } else {
      Message({
        message: 'Error',
        type: 'warning',
        duration: 2 * 1000,
      });
      return Promise.reject(new Error('Error'));
    }
  },
  error => {
    console.log('err111' + error); // 方便调试
    if (error.response.status === 401) {
      Message({
        message: '登陆失效，请重新登陆！',
        type: 'error',
        duration: 2 * 1000,
      });
      const token = getToken();
      if (token) {
        store.dispatch('user/logout');
      }
    }
    if (error.response && error.response.status >= 500) {
      Message({
        message: '网络发生异常，请稍后再试！',
        type: 'error',
        duration: 2 * 1000,
      });
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  },
);

export default service;
