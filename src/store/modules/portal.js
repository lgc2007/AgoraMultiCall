/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-12-06 16:20:12
 * @LastEditors: lgc
 * @LastEditTime: 2022-02-15 14:30:36
 */

const state = {
  resourceData: {},
  resourcePageList: [],
};

const mutations = {
  setState(state, opt) {
    for (const [key, val] of Object.entries(opt)) {
      state[key] = val;
    }
  },
};

const actions = {

};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
