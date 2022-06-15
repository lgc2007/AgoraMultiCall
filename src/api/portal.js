/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-01-29 15:15:42
 * @LastEditors: lgc
 * @LastEditTime: 2022-05-27 15:35:29
 */

import request from '@/utils/request';
import requestProxy from '@/utils/request-proxy';

export function getPreview(query) {
  return request({
    url: '/portal/index/preview',
    method: 'get',
    params: query,
  });
}

export function getCatalogCateGoryTree({ pkid, status }) {
  return request({
    url: `/portal/catalog/getCatalogCateGoryTree/${pkid}/${status}`,
    method: 'get',
    params: {},
  });
}

export function getCatalogResource({ pkid }) {
  return request({
    url: `/portal/catalog/getCatalogResource/${pkid}`,
    method: 'get',
    params: {},
  });
}

export function authRanking({ type }) {
  return request({
    url: `/portal/api/authRanking/${type}`,
    method: 'get',
    params: {},
  });
}
export function catalogResourceApplyRanking() {
  return request({
    url: '/portal/catalog/catalogResourceApplyRanking',
    method: 'get',
    params: {},
  });
}
export function catalogResourcePublishRanking() {
  return request({
    url: '/portal/catalog/catalogResourcePublishRanking',
    method: 'get',
    params: {},
  });
}
export function catalogResourceBrowseRanking() {
  return request({
    url: '/portal/catalog/catalogResourceBrowseRanking',
    method: 'get',
    params: {},
  });
}
export function getCatalogResourceByPage(data) {
  return request({
    url: '/portal/catalog/getCatalogResourceByPage',
    method: 'post',
    data,
  });
}
export function apiInvokeRanking(data) {
  return request({
    url: '/portal/api/apiInvokeRanking',
    method: 'post',
    data,
  });
}

export function getApiParamBaseInfo(data) {
  return request({
    url: '/portal/api/getApiParamBaseInfo',
    method: 'post',
    data,
  });
}
export function getCatalogApiPage(data) {
  return request({
    url: '/portal/api/getCatalogApiPage',
    method: 'post',
    data,
  });
}
export function addCatalogResourceComment(data) {
  return request({
    url: '/portal/catalogResourceComment/addCatalogResourceComment',
    method: 'post',
    data,
  });
}
export function getResourceCommentPage(data) {
  return request({
    url: '/portal/catalogResourceComment/getResourceCommentPage',
    method: 'post',
    data,
  });
}
export function addResourceCollect(data) {
  return request({
    url: '/portal/catalogResourceCollect/addResourceCollect',
    method: 'post',
    data,
  });
}
// 信息项
export function getCatalogResourceItem({ pkid }) {
  return request({
    url: `/portal/catalog/getCatalogResourceItem/${pkid}`,
    method: 'get',
    params: {},
  });
}
// 信息项
export function getCatalogResourceItemApi({ resourceId, apiId }) {
  return request({
    url: `/portal/catalog/getCatalogResourceItem/${resourceId}/${apiId}`,
    method: 'get',
    params: {},
  });
}
// 根据资源id,获取次资源下挂接的库表信息，包括数据条数
export function getCatalogResourceTablesByResourceId({ pkid }) {
  return request({
    url: `/portal/dbExchange/getCatalogResourceTablesByResourceId/${pkid}`,
    method: 'get',
    params: {},
  });
}
// 文件(文件夹详情)，根据资源id获取文件或文件夹详情
export function getCatalogResourceFoldersByResourceId({ pkid }) {
  return request({
    url: `/portal/folderExchange/getCatalogResourceFoldersByResourceId/${pkid}`,
    method: 'get',
    params: {},
  });
}

export function judgeResourceCollect(data) {
  return request({
    url: `/portal/catalogResourceCollect/judgeResourceCollect`,
    method: 'post',
    data,
  });
}

export function delResourceCollect(data) {
  return request({
    url: `/portal/catalogResourceCollect/delResourceCollect`,
    method: 'post',
    data,
  });
}
export function getApiAuthInfo({ pkid, resourceId, data }) {
  return request({
    url: `/portal/api/getApiAuthInfo/${pkid}/${resourceId}`,
    method: 'post',
    data,
  });
}
export function deleteCommentById(data) {
  return request({
    url: `/portal/catalogResourceComment/deleteCommentById`,
    method: 'post',
    data,
  });
}
export function selectAppClientPage(data) {
  return request({
    url: '/portal/app/selectAppClientPage',
    method: 'post',
    data,
  });
}
export function queryResourceApplyPage(data) {
  return request({
    url: '/catalog/catalogResourceApply/queryResourceApplyPage',
    method: 'post',
    data,
  });
}
export function fileUpload(data) {
  return requestProxy({
    url: '/file/fileUpload',
    method: 'post',
    data,
  });
}
export function getItemValueByDictName(data) {
  return request({
    url: '/portal/sysDictItem/getItemValueByDictName',
    method: 'post',
    data,
  });
}
export function getApplyDbSourceListByDept(data) {
  return request({
    url: '/portal/dbExchange/getApplyDbSourceListByDept',
    method: 'post',
    data,
  });
}
export function getAppListForSub(data) {
  return request({
    url: '/portal/api/getAppListForSub',
    method: 'post',
    data,
  });
}
export function getResourceListByResourceId({ pkid }) {
  return request({
    url: `/portal/api/getResourceListByResourceId/${pkid}`,
    method: 'get',
    params: {},
  });
}
export function getCatalogResourceTableInfoAndItemById({
  resourceTableId,
}) {
  return request({
    url: `/portal/dbExchange/getCatalogResourceTableInfoAndItemById/${resourceTableId}`,
    method: 'get',
    params: {},
  });
}
export function getDistinctFiledValueById({ resourceTableId }) {
  return request({
    url: `/portal/dbExchange/getDistinctFiledValueById/${resourceTableId}`,
    method: 'get',
    params: {},
  });
}
// 查询接口的开放时间
export function getApiTimeByApiId({ apiId }) {
  return request({
    url: `/portal/api/getApiTimeByApiId/${apiId}`,
    method: 'get',
    params: {},
  });
}
// 信息项
export function getCatalogResourceAndItemByDto(data) {
  return request({
    url: `/catalog/catalogResource/getCatalogResourceAndItemByDto`,
    method: 'post',
    data,
  });
}
// 获取PDF
export function previewApplyInfo(data) {
  return request({
    url: `/portal/catalog/previewApplyInfo`,
    method: 'post',
    data,
  });
}
// 获取PDF
export function getApplyFolderSourceListByDept(data) {
  return request({
    url: `/portal/folderExchange/getApplyFolderSourceListByDept`,
    method: 'post',
    data,
  });
}
