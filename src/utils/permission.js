/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-12-06 16:20:12
 * @LastEditors: lgc
 * @LastEditTime: 2021-12-16 17:13:50
 */
import store from '@/store';

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles;
    const permissionRoles = value;

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role);
    });
    return hasPermission;
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`);
    return false;
  }
}
