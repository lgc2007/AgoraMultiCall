import { getCount } from '@/api/url';
const state = {
  messageCount: 0,
};

const mutations = {
  SET_COUNT: (state, count) => {
    state.messageCount = count;
  },
};

const actions = {
  getCount({ commit }) {
    return new Promise((resolve, reject) => {
      getCount()
        .then(response => {
          commit('SET_COUNT', response.obj);
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
