import * as $request from '@/utils/method';
const treeList = {
  state: {
    labelData: [],
    treeData: [],
    currentTreeItem: {},
    currentTreeType: '01',
    treeLoading: false,
  },
  actions: {
    getLabelData({ commit, state }, url) {
      commit('setTreeLoad', true);
      commit('getLabelData', [
        {
          title: '基础',
          name: '1',
        },
        {
          title: '部门',
          name: '2',
        },
        {
          title: '主题',
          name: '3',
        },
      ]);
    },
    getTreeData({ commit, state }, url) {
      commit('setTreeLoad', true);
      commit('getTreeData', [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1',
                },
              ],
            },
          ],
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1',
                },
              ],
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1',
                },
              ],
            },
          ],
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1',
                },
              ],
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1',
                },
              ],
            },
          ],
        },
      ]);
    },
    getTreeList({ commit, state }, url) {
      commit('setTreeLoad', true);
      return new Promise((resolve, reject) => {
        $request
          ._get(url)
          .then(res => {
            if (res.code === 0) {
              commit('getTreeData', res.result);
              resolve(res.message);
              commit('setTreeLoad', false);
            } else {
              commit('getTreeData', []);
              commit('setTreeLoad', false);
              reject(res.message || '数据获取错误');
            }
          })
          .catch(err => {
            console.log(err);
            commit('getTreeData', []);
            commit('setTreeLoad', false);
            reject(err || '数据获取错误');
          });
      });
    },
    setCurrentTreeItem({ state }, data) {
      state.currentTreeItem = data;
    },
    setCurrentTreeType({ state }, data) {
      state.currentTreeType = data;
    },
  },
  mutations: {
    getLabelData(state, data) {
      state.labelData = data;
    },
    getTreeData(state, data) {
      state.treeData = data;
    },
    setTreeList(state, data) {
      // state.treeData = data;
    },
    setTreeLoad(state, flag) {
      state.treeLoading = flag;
    },
  },
};
export default treeList;
