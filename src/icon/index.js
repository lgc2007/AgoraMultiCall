/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-06-17 11:06:01
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-17 11:07:04
 */
// index.js

// 引入vue

import Vue from 'vue';

// 引入svgIcon组件

import SvgIcon from '@/components/SvgIcon';

// 注册为全局组件

Vue.component('svg-icon', SvgIcon);

// 引入当前svg目录下的文件、不遍历子目录、匹配以'.svg'为结尾的文件

/**

 * webpack 是模块化打包工具

 * require.context()  返回上下文构造函数webpackContext。存放了所有匹配到的模块信息

 * 参一：设置配置模块目录

 * 参二：表示是否匹配子目录 true 匹配 false 不匹配

 * 参三：正则， 匹配文件的正则表达式。

 *

 * webpackContext.keys() 返回所有匹配到模块的文件地址 【集合】

 */

const webpackContext = require.context('./svg', false, /\.svg$/);

// // 相当于 req.keys().forEach(key => req(key)), req.keys()是匹配到的svg文件的路径数组

const requireAll = (requireContext) => {
  // requireContext.keys()   匹配的 文件路径数组

  return requireContext.keys().map(requireContext);
};

// // 得到一个完整解析的module数组

requireAll(webpackContext);

// 实现:webpackApi方式自动化导入模块，代替 import...from方式```

