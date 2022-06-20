/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-05-27 14:58:45
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-20 09:50:02
 */
import { getRtmToken } from '@/api/url';
const state = {
  updateInfoShow: false,
  info: {}
};

const mutations = {
  SET_UPDATEINFOSHOW: (state, val) => {
    state.updateInfoShow = val;
  },
  SET_INFO(state, info) {
    state.info = info;
  }
};

const actions = {
  getRtmToken({ commit }) {
    return new Promise((resolve, reject) => {
      getRtmToken()
        .then(response => {
          commit('SET_INFO', response.obj);
          // const updateTime = new Date(response.result.updateTime).getTime();
          // const time = Date.now();
          // if (time - updateTime > 30 * 24 * 60 * 60 * 1000) {
          //   commit('SET_UPDATEINFOSHOW', true);
          // }
          resolve();
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
