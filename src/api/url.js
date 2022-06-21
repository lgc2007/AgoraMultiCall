/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-06-01 10:02:10
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-21 09:09:09
 */
import request from '@/utils/request';
export function login(data) {
  return request({
    url: '/api2/admin/api/token/v2/login',
    method: 'post',
    data,
  });
}
// 获取RTMtoken
export function getRtmToken() {
  return request({
    url: `/api8/supervision/agora/getRtmToken`,
    method: 'get',
    params: {},
  });
}
// 获取RTMtoken
export function getAgoraId() {
  return request({
    url: `/api8/supervision/agora/agoraId`,
    method: 'get',
    params: {},
  });
}
// 会议列表查询
export function page(data) {
  return request({
    url: `/api8/supervision/meeting/page`,
    method: 'POST',
    data,
  });
}
// 会议详情查询
export function meetingDetail(id) {
  return request({
    url: `/api8/supervision/meeting?id=${id}`,
    method: 'get',
    params: {},
  });
}
// 开始/进入会议/重新连接
export function meetingAttend(data) {
  return request({
    url: `/api8/supervision/meeting/attend`,
    method: 'post',
    data,
  });
}

// 开/闭麦，开/闭视频
export function meetingTurn(data) {
  return request({
    url: `/api8/supervision/meeting/turn`,
    method: 'post',
    data,
  });
}
// 主持人退出会议时解散会议；普通用户退出会议时即退出会议；
export function exit(data) {
  return request({
    url: `/api8/supervision/meeting/exit`,
    method: 'post',
    data,
  });
}
// 进入发言席
export function speechSeatAttend(data) {
  return request({
    url: `/api8/supervision/meeting/speechSeat/attend`,
    method: 'post',
    data,
  });
}
// 退出发言席
export function speechSeatExit(data) {
  return request({
    url: `/api8/supervision/meeting/speechSeat/exit`,
    method: 'post',
    data,
  });
}

