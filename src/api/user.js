/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-11-24 15:39:30
 * @LastEditors: lgc
 * @LastEditTime: 2021-12-24 15:26:33
 */
import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data,
  });
}

export function getInfo(params) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params
  });
}

export function generateRoutes(data) {
  return request({
    url: '/menu/index/getMenus',
    method: 'post',
    data,
  });
}
export function getButtonPermissions(data) {
  return request({
    url: '/menu/index/getButtons',
    method: 'post',
    data,
  });
}
export function logout(data) {
  return request({
    url: '/admin/user/logout',
    method: 'post',
    data,
  });
}
export function goTest(data) {
  return request({
    url: '/catalog/catalogResourceCollect/getPage',
    method: 'post',
    data,
  });
}
