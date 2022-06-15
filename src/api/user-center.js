/*
 * @Description: 
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-06-08 16:40:58
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-08 16:40:59
 */
/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-11-24 15:39:30
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-08 16:38:25
 */
import request from '@/utils/request-center';

export function login(data) {
  return request({
    url: '/api2/admin/api/token/v2/login',
    method: 'post',
    data,
  });
}
// 获取所有角色
export function queryallRole(data) {
  return request({
    url: `/api2/admin/sys/role/queryall`,
    method: 'GET',
    data
  });
}
export function getInfo(params) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params,
  });
}
export function generateRoutes(params) {
  return request({
    url: '/api2/admin/api/permission/getMenuAndActionByToken',
    method: 'get',
    params,
  });
}

// export function generateRoutes(data) {
//   return request({
//     url: '/menu/index/getMenus',
//     method: 'post',
//     data,
//   });
// }
export function getButtonPermissions(data) {
  return request({
    url: '/menu/index/getButtons',
    method: 'post',
    data,
  });
}
export function logout(data) {
  return request({
    url: '/api2/admin/api/token/logout',
    method: 'post',
    data,
  });
}
/**
 * 用户信息查询接口
 */
export function getRtmToken(params) {
  return request({
    url: '/agora/getRtmToken',
    method: 'get',
    params,
  });
}
/**
 * 用户手机号/姓名/邮箱修改接口
 * @param {*} data
 * @returns
 */
export function updateUserInfo(data) {
  return request({
    url: '/api2/admin/api/user/updateUserInfo',
    method: 'post',
    data,
  });
}

/**
 * 更新当前用户密码接口
 * @param {*} data
 * @returns
 */
export function updateUserPassword(data) {
  return request({
    url: '/api2/admin/api/v2/user/updateUserPassword',
    method: 'post',
    data,
  });
}
