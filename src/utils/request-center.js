/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-11-24 15:40:19
 * @LastEditors: lgc
 * @LastEditTime: 2021-12-30 10:27:19
 */
import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
// 创建实例
const service = axios.create({
  baseURL: process.env.VUE_APP_LOGIN_BASE, // url = base url + request url
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
    const res = response.data;
    if (res.success === true) {
      return res;
    } else {
      Message({
        message:
                      res.obj || res.message || 'Error',
        type: 'warning',
        duration: 2 * 1000,
      });
      return Promise.reject(new Error(res.message || 'Error'));
    }
  },
  error => {
    console.log(error, error.response,); // 方便调试
    if (error.response.status === 401) {
      MessageBox.confirm('登陆失效，请重新登陆！', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload();
        });
      });
      // const token = getToken();
      // if (token) {
      //   store.dispatch('user/logout');
      // }
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
