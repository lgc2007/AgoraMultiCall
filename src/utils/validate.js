/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-11-18 11:07:43
 * @LastEditors: lgc
 * @LastEditTime: 2021-11-25 17:43:36
 */
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor'];
  return valid_map.indexOf(str.trim()) >= 0;
}

export function checkPhone(str) {
  var tel = /^0\d{2,3}-?\d{7,8}$/;
  var phone = /^1[3|4|5|7|8]\d{9}$/;
  if (str.length == 11) {
    // 手机号码
    if (phone.test(str)) {
      return true;
    }
  } else if (str.indexOf('-') != -1) {
    // 电话号码
    if (tel.test(str)) {
      return true;
    }
  }
  return false;
}
