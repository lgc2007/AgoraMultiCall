/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-02-25 09:48:50
 * @LastEditors: lgc
 * @LastEditTime: 2022-05-07 15:52:51
 */
export const shareWayTypeList = [
  {
    label: '库表',
    value: 1,
  },
  {
    label: '接口',
    value: 2,
  },
  {
    label: '文件',
    value: 4,
  },
  {
    label: '文件夹',
    value: 8,
  },
];
export const shareWayTypeListString = [
  {
    label: '库表',
    value: '1',
    icon: 'databaseTable',
  },
  {
    label: '接口',
    value: '2',
    icon: 'jiekou',
  },
  {
    label: '文件',
    value: '4',
    icon: 'fileType',
  },
  {
    label: '文件夹',
    value: '8',
    icon: 'folder',
  },
];
export const shareTypeList = [
  { label: '未设置', value: 0 },
  { label: '无条件共享', value: 1 },
  { label: '有条件共享', value: 2 },
  { label: '不予共享', value: 3 },
];
export const openTypeList = {
  0: '不可开放',
  1: '可开放',
};
export const shareTypeL = {
  0: '未设置',
  1: '无条件共享',
  2: '有条件共享',
  3: '不予共享',
};
export const shareWayTypeL = {
  1: '库表',
  2: '接口',
  4: '文件',
  8: '文件夹',
};
export const tableFieldIspkL = {
  0: '否',
  1: '是',
};
export const catalogList = [
  {
    title: '基础',
    name: '1',
  },
  {
    title: '部门',
    name: '3',
  },
  {
    title: '主题',
    name: '2',
  },
];
export const catalogListL = {
  1: '基础',
  3: '部门',
  2: '主题',
};
export const dataType = [
  {
    label: '数值型N',
    value: 'NUMERIC',
  },
  {
    label: '浮点型F',
    value: 'FLOAT',
  },
  {
    label: '双精度型B',
    value: 'DOUDLE',
  },
  {
    label: '货币型Y',
    value: 'DECIMAL',
  },
  {
    label: '字符型C',
    value: 'VARCHAR',
  },
  {
    label: '日期型D',
    value: 'DATE',
  },
  {
    label: '日期时间型T',
    value: 'DATETIME',
  },
  {
    label: '逻辑型L',
    value: 'BOOLEAN',
  },
  {
    label: '整型I',
    value: 'INT',
  },
  {
    label: 'JSON格式型J',
    value: 'JSONARRAY',
  },
];
export const dataTypeMatch = {
  'NUMERIC': '数值型N',
  'FLOAT': '浮点型F',
  'DOUDLE': '双精度型B',
  'DECIMAL': '货币型Y',
  'VARCHAR': '字符型C',
  'DATE': '日期型D',
  'DATETIME': '日期时间型T',
  'BOOLEAN': '逻辑型L',
  'INT': '整型I',
  'JSONARRAY': 'JSON格式型J'
};
export const judgment = [
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '大于',
    value: 'gt',
  },
  {
    label: '小于',
    value: 'lt',
  },
  {
    label: '大于等于',
    value: 'gte',
  },
  {
    label: '小于等于',
    value: 'lte',
  },
  {
    label: 'LIKE',
    value: 'like',
  },
];
export const scopeUseL = {
  0: '行政依据',
  1: '工作参考',
  2: '用于数据考核',
  3: '业务协同',
  4: '其它',
};
export const scopeUseList = [
  {
    label: '行政依据',
    value: 0,
  },
  {
    label: '工作参考',
    value: 1,
  },
  {
    label: '用于数据考核',
    value: 2,
  },
  {
    label: '业务协同',
    value: 3,
  },
  {
    label: '其它',
    value: 4,
  },
];
