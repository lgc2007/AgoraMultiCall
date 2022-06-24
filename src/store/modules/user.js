import {
  login,
  getRtmToken,
  getAgoraId,
  meetingAttend,
  page,
  meetingDetail,
} from '@/api/url';
import { getInfo } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import router, { resetRouter } from '@/router';
import Vue from 'vue';

const getDefaultState = () => {
  return {
    token: getToken(),
    rtmToken: '',
    rtcToken: '',
    meeting: {},
    meetingAttend: {},
    userId: '',
    user: {},
    menu: [],
    meetingDetail: {},
    userDetail: {},
    meetingUsers: [],
    openlogin: false,
    operations: {},
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
  };
};
const state = getDefaultState();

const mutations = {
  setState(state, opt) {
    for (const [key, val] of Object.entries(opt)) {
      state[key] = val;
    }
  },
  //  return {
  //         ...item,
  //         isOnline: value
  //       };
  TURN_OFF_ALL_VIDEO(state, params) {
    state.meetingUsers.map((item, index) => {
      if (item.userType) {
        Vue.set(item, 'videoState', 0);
      }
    });
  },
  UPDATE_USER_LIST(state, params) {
    params.map(m => {
      const index = state.meetingUsers.findIndex(item => String(item.agoraId) === String(m.userId));
      const obj = state.meetingUsers.find(item => String(item.agoraId) === String(m.userId));
      Vue.set(state.meetingUsers, index, {
        ...obj,
        ...m
      });
    });
    // const index = state.meetingUsers.findIndex(item => String(item.agoraId) === params.userId);
    // const obj = state.meetingUsers.find(item => String(item.agoraId) === params.userId);
    // Vue.set(state.meetingUsers, index, {
    //   ...obj,
    //   ...params
    // });
    // state.meetingUsers.map((item, index) => {
    //   if (String(item.agoraId) === userId) {
    //     item;
    //   }
    //   return item;
    // });
    // state.meetingUsers = value;
    // state.meetingUsers.push();
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INFO(state, info) {
    state.info = info;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_USER: (state, user) => {
    state.user = user;
  },
  SET_MENU: (state, menu) => {
    state.menu = menu;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          commit('SET_TOKEN', response.result.token);
          setToken(response.result.token);
          resolve(response.result.token);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getRtmToken({ commit }) {
    return new Promise((resolve, reject) => {
      getRtmToken()
        .then(({ obj: { agoraId, token }}) => {
          commit('setState', {
            agoraId, rtmToken: token
          });
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getAgoraId({ commit }, token) {
    return new Promise((resolve, reject) => {
      getAgoraId()
        .then(({ obj }) => {
          commit('setState', {
            userId: obj
          });
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  page({ commit }, token) {
    return new Promise((resolve, reject) => {
      page({
        pageNum: '1',
        pageSize: '10',
        // meetingName: '测试会议0610'
      })
        .then(({ obj: { records }}) => {
          if (records && records.length) {
            if (records.length > 1) {
              commit('setState', {
                meetingPage: (records && records[records.length - 1]) || []
              });
            } else {
              commit('setState', {
                meetingPage: (records && records[0]) || []
              });
            }
          }

          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  meetingDetail({ commit, state }) {
    return new Promise((resolve, reject) => {
      meetingDetail(state.meetingPage.id)
        .then(({ obj }) => {
          if (obj) {
            const userDetail = obj.meetingUsers.find(item => item.agoraId === state.agoraId);
            commit('setState', {
              userDetail,
              meetingUsers: obj.meetingUsers,
            });
          }

          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  meetingAttend({ commit, state }) {
    return new Promise((resolve, reject) => {
      meetingAttend({
        id: state.meetingPage.id,
      })
        .then(({ obj: { channelName, rtcToken, salt, secretKey }}) => {
          commit('setState', {
            channelName, rtcToken, salt, secretKey
          });
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  UPDATE_MEETING({ commit, state }, params) {
    commit('UPDATE_USER_LIST', params);
  },
  // getMenu
  generateRoutes({ commit }, params) {
    return new Promise((resolve, reject) => {
      generateRoutes({ type: 'menu' })
        .then(response => {
          const result = response.obj.data;
          commit('SET_MENU', result);
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      getInfo({})
        .then(response => {
          // const response = {
          //   requestId: null,
          //   success: true,
          //   business: null,
          //   errorCode: null,
          //   errorMessage: null,
          //   params: null,
          //   date: null,
          //   version: null,
          //   obj: {
          //     userDTO: {
          //       id: '1472857446153220097',
          //       userName: 'test_test',
          //       realname: '测试接入用户中心',
          //       avatar: null,
          //       birthday: null,
          //       sex: null,
          //       email: null,
          //       phone: '13569569865',
          //       status: 1,
          //       userOrder: 10000.0,
          //       tenantIds: 'ldjsc',
          //     },
          //     departmentDTO: {
          //       key: '1472857068426784769',
          //       value: '1472857068426784769',
          //       title: '河南省发展和改革委员会',
          //       id: '1472857068426784769',
          //       parentId: '',
          //       departName: '河南省发展和改革委员会',
          //       departNameAbbr: '河南省发展和改革委员会',
          //       departOrder: 1000.0,
          //       description: null,
          //       orgCategory: '1',
          //       orgType: '1',
          //       orgCode: 'A01',
          //       mobile: null,
          //       fax: null,
          //       address: null,
          //       memo: null,
          //       labelIds: null,
          //       status: '1',
          //       departUniqueCode: 'hnsfzggw',
          //     },
          //   },
          // };
          const {
            obj: { userDTO, departmentDTO, roleDTO },
          } = response;
          const {
            address,
            departName,
            departNameAbbr,
            departOrder,
            departUniqueCode,
          } = departmentDTO;
          const {
            roleName,
          } = roleDTO;
          const {
            email,
            phone,
            realname,
            userName,
            userOrder,
            tenantIds,
          } = userDTO;
          if (!userDTO) {
            return reject('登录信息失效，请重新登录！');
          }
          const userInfoObj = {
            address,
            departName,
            departNameAbbr,
            departOrder,
            departUniqueCode,
            email,
            phone,
            realname,
            realName: realname,
            userName,
            roleName,
            userOrder,
            tenantIds,
            // userId: userDTO.userName,
            departmentId: departmentDTO.id,
            departmentName: departmentDTO.departName,
            alias: userDTO.realname,
          };
          commit('SET_USER', userInfoObj);
          resolve(response);

          // const { roles, name, avatar, introduction } = data;
          // roles must be a non-empty array
          // if (!roles || roles.length <= 0) {
          //   reject('getInfo: roles must be a non-null array!');
          // }

          // commit('SET_ROLES', roles);
          // commit('SET_NAME', name);
          // commit('SET_AVATAR', avatar);
          // commit('SET_INTRODUCTION', introduction);
          // resolve(data);
        })
        .catch(error => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resetRouter();
          location.reload();
          reject(error);
        });
    });
  },
  // get operations
  getButtonPermissions({ commit }, params) {
    return new Promise((resolve, reject) => {
      getButtonPermissions({
        type: 'button',
        id: params,
      })
        .then(response => {
          const result = response.obj;
          // const permissionList =
          //   result &&
          //   result.map(permission => {
          //     return permission.code;
          //   });
          // const obj = {};
          // for (let i = 0; i < result.length; i++) {
          //   obj[result[i].code] = true;
          // }
          commit('SET_ROLES', result);
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout({})
        .then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resetRouter();

          // 重置已访问视图和缓存视图
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          // dispatch('tagsView/delAllViews', null, { root: true });

          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      removeToken();
      resolve();
    });
  },

  // 动态地修改权限
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token';

    commit('SET_TOKEN', token);
    setToken(token);

    const { roles } = await dispatch('getInfo');

    resetRouter();

    // 基于角色映射动态修改peagenerate可访问路由图
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true,
    });
    // 动态添加可访问路由
    router.addRoutes(accessRoutes);

    // 重置已访问视图和缓存视图
    dispatch('tagsView/delAllViews', null, {
      root: true,
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
