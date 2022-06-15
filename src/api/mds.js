export const mds = {
  snapshotDownload: id => {
    return '/snapshot/ResourceTemplate.xlsx';
  },
  resourceUpload: id => {
    return '/file/resourceUpload';
  },
  adminRegister: id => {
    return '/admin/register'; // 添加用户
  },
  adminUserList: id => {
    return '/admin/user/list';
  },
  adminUserListOne: id => {
    return '/admin/user/getUserById';
  },
  adminUserUpdate: id => {
    return '/admin/user/updateUserInfo';
  },
  adminUserDetele: id => {
    return '/admin/user/deleteUserById';
  },
  adminRoleList: id => {
    return '/admin/role/listRole';
  },
  adminRoleListOne: id => {
    return '/admin/role/getRoleById';
  },
  adminRoleInsert: id => {
    return '/admin/role/insertRole';
  },
  adminRoleUpdate: id => {
    return '/admin/role/updateRole';
  },
  adminRoleDetele: id => {
    return '/admin/role/deleteRoleById';
  },
  getAllDepart: id => {
    return '/admin/department/getSubDeparments';
  },
  departmentInsert: id => {
    return '/admin/department/insert';
  },
  departmentUpdate: id => {
    return '/admin/department/update';
  },
  deleteDepart: id => {
    return '/admin/department/deleteDepart';
  },
  postMenuInset: id => {
    return '/menu/index/insertMenu';
  },
  putMenuupdata: id => {
    return '/menu/index/updateMenu';
  },
  deleteMenuupdata: id => {
    return '/menu/index/deleteMenuById/' + id;
  },
  getAllDepartTree: id => {
    return '/admin/department/getAllDepart';
  },
  getJobs: id => {
    return '/admin/job/queryList';
  },
  insertJob: id => {
    return '/admin/job/insertJob';
  },
  getJobsOne: id => {
    return '/admin/job/getById';
  },
  putJobs: id => {
    return '/admin/job/updateById';
  },
  deleteJobs: id => {
    return '/admin/job/deleteJobById';
  },
  getSelectPage: id => {
    return '/bpmn/model/list';
  },
  // 删除配置
  bpmnRemove: id => {
    return '/bpmn/model/' + id + '/remove';
  },
  // 流程名称重复
  getProcessRecordByName: id => {
    return '/bpmn/model/getProcessRecordByName/' + id;
  },
  updateById: id => {
    return '/apiAggregation/processItems/updateById';
  },
  updateRoleMenu: id => {
    return '/menu/index/auth/' + id;
  },
  getRoleMenu: id => {
    return '/menu/index/getMenus/' + id;
  },
  getRoleMenuAll: id => {
    return '/menu/index/all';
  },
  // 修改密码
  putPassword: id => {
    return '/admin/user/updatePassword';
  },
  // 获取过滤掉按钮后的所有菜单
  allMenus: id => {
    return '/menu/index/allMenus';
  },
  // 获取过滤掉按钮后的所有菜单
  // getButtons: id => {
  //   return '/menu/index/getButtons';
  // },
  // 批量删除用户
  deleteAllUser: id => {
    return '/admin/user/deleteAll';
  },
  // 获取过滤掉按钮后的所有菜单
  deleteAllDepartment: id => {
    return '/admin/department/deleteAll';
  },
  // 获取过滤掉按钮后的所有菜单
  deleteAllRole: id => {
    return '/admin/role/deleteAll';
  },
  // 获取过滤掉按钮后的所有菜单
  deleteAllMenu: id => {
    return '/menu/index/deleteAll';
  },

  // 审核  -- 审批流程
  auditUrl: id => {
    return '/catalog/catalogResource/audit';
  },

  // 类目审核
  catalogCategoryAuditUrl: id => {
    return '/catalog/catalogCategory/audit';
  },
  // 接口审核
  apiBasicInfoAuditUrl: id => {
    return '/apiAggregation/apiBasicInfo/audit';
  },
};
