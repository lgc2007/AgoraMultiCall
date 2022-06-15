/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-11-24 15:40:19
 * @LastEditors: lgc
 * @LastEditTime: 2021-12-30 11:05:39
 */
import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
// 创建实例
const service = axios.create({
  baseURL: '/api2', // 测试
  // withCredentials: true, // 当跨域请求时发送cookie
  timeout: 60000, // 超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = getToken();
    if (!config.headers.hasOwnProperty('token') && token) {
      config.headers.Authorization = token;
      config.headers['X-Access-Token'] = getToken();
      config.headers['X-Tenant-Id'] = 'ldjsc';
    }
    return config;
  },
  error => {
    // 处理请求错误
    console.log(error); // 方便调试
    return Promise.reject(error);
  },
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
    const res = response.data;
    if (res.success === true) {
      return res;
    } else {
      Message({
        message: res.obj || res.errorMessage || 'Error',
        type: 'warning',
        duration: 2 * 1000,
      });
      return Promise.reject(new Error(res.errorMessage || 'Error'));
    }
    // 如果定制码不是20000，则判定为错误。
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000,
    //   });

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm(
    //       'You have been logged out, you can cancel to stay on this page, or log in again',
    //       'Confirm logout',
    //       {
    //         confirmButtonText: 'Re-Login',
    //         cancelButtonText: 'Cancel',
    //         type: 'warning',
    //       },
    //     ).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload();
    //       });
    //     });
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'));
    // } else {
    //   return res;
    // }
  },
  error => {
    console.log('request err' + error, error.response.status); // 方便调试
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
        message: error.errorMessage,
        type: 'error',
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  },
);

export default service;
