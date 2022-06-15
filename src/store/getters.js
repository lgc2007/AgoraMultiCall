/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-12-06 16:20:12
 * @LastEditors: lgc
 * @LastEditTime: 2021-12-31 11:26:18
 */
const getter = {
  menu: state => state.user.menu,
  user: state => state.user.user,
  operations: state => state.user.operations,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  treeData: state => state.treeList.treeData, // 左侧数菜单
  currentTreeItem: state => state.treeList.currentTreeItem, // 当前选中项
  currentTreeType: state => state.treeList.currentTreeType, // 当前选中类型
  treeLoading: state => state.treeList.treeLoading, // treeMenu加载
  categoryTreeData: state => state.category.treeData, //
  categoryLabelData: state => state.category.labelData, //
  categoryTreeLoading: state => state.category.treeLoading,
  categorycurrentItem: state => state.category.treeLoading,
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  permission_addRoutes: state => state.permission.addRoutes,
  permission_list: state => state.permission.permissionsList,
  errorLogs: state => state.errorLog.logs,
  messageCount: state => state.notice.messageCount,
};
export default getter;
