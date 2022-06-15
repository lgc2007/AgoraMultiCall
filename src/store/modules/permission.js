import { constantRoutes } from '@/router/index';
import { generateRoutes } from '@/api/user-center';
import { generatorRouter } from '@/utils';
/**
 * 用 meta.role 以确定当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  routes: [],
  addRoutes: [],
  permissionsList: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
  SET_PERMISSION_LIST: (state, roles) => {
    state.permissionsList = roles;
  },
};

// /**
//  * 处理多层目录结构
//  * @param {*} data
//  * @param {*} result
//  * @returns
//  */
// const chengMenu = (data, result) => {
//   data.map(item => {
//     if (item.child && item.child.length > 0) {
//       chengMenu(item.child, result);
//     } else {
//       result.push(item.code);
//     }
//   });
//   return result;
// };

const actions = {
  // getMenu
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      generateRoutes({})
        .then(response => {
          const { action, menu } = response.result;
          const generateRoutes = generatorRouter(menu);
          const resultData = generateRoutes.concat([
          // 404 必须最后添加 !!!
            {
              path: '*',
              redirect: '/404',
              hidden: true,
            },
          ]);
          // if (roles.includes('admin')) {
          //   accessedRoutes = asyncRoutes || [];
          // } else {
          //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
          // }
          // TODO：
          commit('SET_ROUTES', resultData);
          commit('SET_PERMISSION_LIST', action);
          resolve(resultData);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
