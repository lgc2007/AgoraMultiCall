/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-06-17 16:21:57
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-20 09:50:09
 */
const state = {
  logs: []
};

const mutations = {
  ADD_ERROR_LOG: (state, log) => {
    state.logs.push(log);
  },
  CLEAR_ERROR_LOG: (state) => {
    state.logs.splice(0);
  }
};

const actions = {
  addErrorLog({ commit }, log) {
    commit('ADD_ERROR_LOG', log);
  },
  clearErrorLog({ commit }) {
    commit('CLEAR_ERROR_LOG');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
