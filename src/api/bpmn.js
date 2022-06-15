/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-11-24 15:39:30
 * @LastEditors: lgc
 * @LastEditTime: 2021-12-23 15:24:54
 */
import request from '@/utils/request';

export function bpmnDeploy(data) {
  return request({
    url: '/bpmn/model/deploy',
    method: 'post',
    data,
  });
}

export function saveBak(data) {
  return request({
    url: '/bpmn/model/buffer',
    method: 'post',
    data,
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
