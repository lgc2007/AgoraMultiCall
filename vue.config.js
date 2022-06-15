/*
 * @Description: 
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-05-19 15:04:26
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-10 10:43:51
 */
'use strict';
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = '测试demo'; // page title

const port = process.env.port || process.env.npm_config_port || 9528; // dev port

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
       '/api2/admin/': {
        target: 'http://117.160.221.236:8087/api8-uat/supervision',
        changeOrigin: true,
        ws: false,
      },
      '/': {
        target: 'http://117.160.221.236:8087/api8-uat/supervision',
        changeOrigin: true,
        ws: false,
         pathRewrite: {
          '^/': '',
        },
      },
    },
  },
  configureWebpack: {
    // 在webpack的name字段中提供标题，这样可以在index.html中访问它以注入正确的标题。
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
  },
  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'));
  },
};
