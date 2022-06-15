/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-12-28 18:53:16
 * @LastEditors: lgc
 * @LastEditTime: 2022-01-29 15:14:48
 */
export const sgUrl = {
  getEnAuthorizedApp: id => {
    return '/apiAggregation/app/getEnAuthorizedApp/' + id;
    // return '/app/getEnAuthorizedApp/' + id;
  },
  AuthorizedAppDeleteAll: id => {
    return '/apiAggregation/appAuthority/deleteAll';
  },
  AuthorizedAppUpdate: id => {
    return '/apiAggregation/appAuthority/updateById';
  },
  // IP 列表（新）
  getAppBasicSelectPage: obj => {
    return '/apiAggregation/appIp/selectPage';
  },
  getAppBasicInfoPageInsert: id => {
    return '/apiAggregation/appIp/insert';
  },
  getAppBasicInfoPagePut: id => {
    return '/apiAggregation/appIp/updateById';
  },
  getAppBasicInfoPageOne: id => {
    return '/apiAggregation/appIp/selectById/' + id;
  },
  getAppBasicInfoPageDelete: id => {
    return '/apiAggregation/appIp/delete/' + id;
  },
  getAppBasicInfoPageDeleteAll: id => {
    return '/apiAggregation/appIp/deleteAll';
  },
  // 发布和下线
  getApiOffline: id => {
    return '/apiAggregation/apiBasicInfo/serviceOffline';
  },
  // 发布和下线
  getApiOnline: id => {
    return '/apiAggregation/apiBasicInfo/serviceOnline';
  },
};
