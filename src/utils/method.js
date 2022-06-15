/**
 * 实例
 */
import request from '../utils/request';

export function _get(url, params,config,validation) {
  return request({
    url: url,
    method: 'get',
    params,
    validation,
    config
  });
}
export function _post(url, data,config,validation) {
  return request({
    url: url,
    method: 'post',
    data,
    validation,
    config
  });
}
export function _delete(url, data,config,validation) {
  return request({
    url: url,
    method: 'delete',
    data,
    validation,
    config
  });
}
export function _put(url, data,config,validation) {
  return request({
    url: url,
    method: 'put',
    data,
    validation,
    config
  });
}
