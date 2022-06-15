/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-11-12 09:00:44
 * @LastEditors: lgc
 * @LastEditTime: 2021-12-16 10:39:12
 */
/**
 * 常用浏览器储存的封装
 */
import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
