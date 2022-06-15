/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-06-01 10:02:10
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-15 08:57:36
 */
import { mds } from './mds';
import request from '@/utils/request';
import requestCenter from '@/utils/request-center';
import requestProxy from '@/utils/request-proxy';
export function login(data) {
  return request({
    url: '/api2-uat/admin/api/token/v2/login',
    method: 'post',
    data,
  });
}
// 获取RTMtoken
export function getRtmToken() {
  return request({
    url: `/api8-uat/supervision/agora/getRtmToken`,
    method: 'get',
    params: {},
  });
}
// 获取RTMtoken
export function getAgoraId() {
  return request({
    url: `/api8-uat/supervision/agora/agoraId`,
    method: 'get',
    params: {},
  });
}
// 会议列表查询
export function page(data) {
  return request({
    url: `/api8-uat/supervision/meeting/page`,
    method: 'POST',
    data,
  });
}
// 会议详情查询
export function meetingDetail(id) {
  return request({
    url: `/api8-uat/supervision/meeting?id=${id}`,
    method: 'get',
    params: {},
  });
}
// 开始/进入会议/重新连接
export function meetingAttend(data) {
  return request({
    url: `/api8-uat/supervision/meeting/attend`,
    method: 'post',
    data,
  });
}

// 开/闭麦，开/闭视频
export function meetingTurn(data) {
  return request({
    url: `/api8-uat/supervision/meeting/turn`,
    method: 'post',
    data,
  });
}
// 主持人退出会议时解散会议；普通用户退出会议时即退出会议；
export function exit(data) {
  return request({
    url: `/api8-uat/supervision/meeting/exit`,
    method: 'post',
    data,
  });
}

